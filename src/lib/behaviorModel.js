/**
 * 行为建模器
 * 采集和分析用户的编码行为数据
 */

import { storage } from "./utils";

const STORAGE_KEY = "behavior_model";

class BehaviorModel {
  constructor() {
    this.events = [];
    this.sessionData = null;
    this.patterns = {};
  }

  /**
   * 开始新的行为采集会话
   */
  startSession(sessionId) {
    this.sessionData = {
      sessionId,
      startTime: Date.now(),
      events: [],
      metrics: {
        totalKeystrokes: 0,
        totalPauses: 0,
        totalDeletes: 0,
        pauseCount: 0,
        avgPauseDuration: 0,
        longestPause: 0,
        typingSpeed: 0,
        errorRate: 0,
      },
    };
  }

  /**
   * 记录按键事件
   */
  recordKeystroke(data) {
    if (!this.sessionData) {return;}

    this.sessionData.events.push({
      type: "keystroke",
      timestamp: Date.now(),
      key: data.key,
      line: data.line,
      column: data.column,
    });

    this.sessionData.metrics.totalKeystrokes++;
  }

  /**
   * 记录停顿事件
   */
  recordPause(duration) {
    if (!this.sessionData) {return;}

    this.sessionData.events.push({
      type: "pause",
      timestamp: Date.now(),
      duration,
    });

    this.sessionData.metrics.totalPauses += duration;
    this.sessionData.metrics.pauseCount++;
    this.sessionData.metrics.avgPauseDuration =
      this.sessionData.metrics.totalPauses / this.sessionData.metrics.pauseCount;
    this.sessionData.metrics.longestPause = Math.max(
      this.sessionData.metrics.longestPause,
      duration,
    );
  }

  /**
   * 记录删除事件
   */
  recordDelete(data) {
    if (!this.sessionData) {return;}

    this.sessionData.events.push({
      type: "delete",
      timestamp: Date.now(),
      count: data.count || 1,
      line: data.line,
    });

    this.sessionData.metrics.totalDeletes += data.count || 1;
  }

  /**
   * 记录提交事件
   */
  recordSubmit(data) {
    if (!this.sessionData) {return;}

    this.sessionData.events.push({
      type: "submit",
      timestamp: Date.now(),
      correct: data.correct,
      timeSpent: data.timeSpent,
    });
  }

  /**
   * 记录卡点事件（停顿超过阈值）
   */
  recordStuckPoint(data) {
    if (!this.sessionData) {return;}

    this.sessionData.events.push({
      type: "stuck",
      timestamp: Date.now(),
      line: data.line,
      duration: data.duration,
      context: data.context,
    });
  }

  /**
   * 结束会话并生成分析报告
   */
  endSession() {
    if (!this.sessionData) {return null;}

    const duration = Date.now() - this.sessionData.startTime;
    const submits = this.sessionData.events.filter((e) => e.type === "submit");
    const correctSubmits = submits.filter((s) => s.correct);

    const report = {
      sessionId: this.sessionData.sessionId,
      duration,
      durationFormatted: formatDuration(duration),
      metrics: { ...this.sessionData.metrics },
      analysis: {
        typingSpeed: this.calculateTypingSpeed(),
        pausePattern: this.analyzePausePattern(),
        errorPattern: this.analyzeErrorPattern(),
        stuckPoints: this.identifyStuckPoints(),
        cognitiveLoad: this.estimateCognitiveLoad(),
      },
      summary: {
        totalSubmits: submits.length,
        correctSubmits: correctSubmits.length,
        accuracy: submits.length > 0 ? Math.round((correctSubmits.length / submits.length) * 100) : 0,
      },
    };

    // 保存到历史
    this.saveToHistory(report);

    this.sessionData = null;
    return report;
  }

  /**
   * 计算打字速度（字符/分钟）
   */
  calculateTypingSpeed() {
    if (!this.sessionData) {return 0;}

    const keystrokes = this.sessionData.metrics.totalKeystrokes;
    const duration = Date.now() - this.sessionData.startTime;
    const minutes = duration / 60000;

    return minutes > 0 ? Math.round(keystrokes / minutes) : 0;
  }

  /**
   * 分析停顿模式
   */
  analyzePausePattern() {
    if (!this.sessionData) {return { type: "unknown" };}

    const pauses = this.sessionData.events.filter((e) => e.type === "pause");
    if (pauses.length === 0) {return { type: "smooth" };}

    const avgDuration = pauses.reduce((sum, p) => sum + p.duration, 0) / pauses.length;
    const longPauses = pauses.filter((p) => p.duration > 5000);

    if (longPauses.length > pauses.length * 0.3) {
      return { type: "frequent_stops", avgDuration, longPauseCount: longPauses.length };
    }

    if (avgDuration > 3000) {
      return { type: "slow_thinking", avgDuration };
    }

    return { type: "normal", avgDuration };
  }

  /**
   * 分析错误模式
   */
  analyzeErrorPattern() {
    if (!this.sessionData) {return { type: "unknown" };}

    const submits = this.sessionData.events.filter((e) => e.type === "submit");
    const errors = submits.filter((s) => !s.correct);

    if (errors.length === 0) {return { type: "perfect" };}

    const errorRate = errors.length / submits.length;

    if (errorRate > 0.5) {
      return { type: "high_error", rate: Math.round(errorRate * 100) };
    }

    if (errorRate > 0.2) {
      return { type: "moderate_error", rate: Math.round(errorRate * 100) };
    }

    return { type: "low_error", rate: Math.round(errorRate * 100) };
  }

  /**
   * 识别卡点位置
   */
  identifyStuckPoints() {
    if (!this.sessionData) {return [];}

    const stuckEvents = this.sessionData.events.filter((e) => e.type === "stuck");
    return stuckEvents.map((e) => ({
      line: e.line,
      duration: e.duration,
      context: e.context,
    }));
  }

  /**
   * 估算认知负荷
   */
  estimateCognitiveLoad() {
    if (!this.sessionData) {return "unknown";}

    const { avgPauseDuration, totalDeletes, totalKeystrokes } = this.sessionData.metrics;
    const deleteRatio = totalKeystrokes > 0 ? totalDeletes / totalKeystrokes : 0;

    if (avgPauseDuration > 5000 || deleteRatio > 0.3) {
      return "high";
    }

    if (avgPauseDuration > 2000 || deleteRatio > 0.15) {
      return "medium";
    }

    return "low";
  }

  /**
   * 保存到历史记录
   */
  saveToHistory(report) {
    const history = storage.get(STORAGE_KEY, []);
    history.unshift(report);

    // 只保留最近50条
    if (history.length > 50) {
      history.length = 50;
    }

    storage.set(STORAGE_KEY, history);
  }

  /**
   * 获取历史记录
   */
  getHistory(limit = 10) {
    const history = storage.get(STORAGE_KEY, []);
    return history.slice(0, limit);
  }

  /**
   * 获取行为趋势
   */
  getTrend() {
    const history = storage.get(STORAGE_KEY, []);
    if (history.length < 2) {return null;}

    const recent = history.slice(0, 5);
    const older = history.slice(5, 10);

    if (older.length === 0) {return null;}

    const recentAvgSpeed = recent.reduce((sum, r) => sum + (r.analysis?.typingSpeed || 0), 0) / recent.length;
    const olderAvgSpeed = older.reduce((sum, r) => sum + (r.analysis?.typingSpeed || 0), 0) / older.length;

    const recentAccuracy = recent.reduce((sum, r) => sum + (r.summary?.accuracy || 0), 0) / recent.length;
    const olderAccuracy = older.reduce((sum, r) => sum + (r.summary?.accuracy || 0), 0) / older.length;

    return {
      speedTrend: recentAvgSpeed > olderAvgSpeed ? "improving" : recentAvgSpeed < olderAvgSpeed ? "declining" : "stable",
      accuracyTrend: recentAccuracy > olderAccuracy ? "improving" : recentAccuracy < olderAccuracy ? "declining" : "stable",
      recentAvgSpeed: Math.round(recentAvgSpeed),
      olderAvgSpeed: Math.round(olderAvgSpeed),
      recentAccuracy: Math.round(recentAccuracy),
      olderAccuracy: Math.round(olderAccuracy),
    };
  }
}

function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes === 0) {return `${remainingSeconds}秒`;}
  return `${minutes}分${remainingSeconds}秒`;
}

// 单例实例
const model = new BehaviorModel();

export function getBehaviorModel() {
  return model;
}

export function startBehaviorSession(sessionId) {
  model.startSession(sessionId);
}

export function endBehaviorSession() {
  return model.endSession();
}

export function getBehaviorHistory(limit) {
  return model.getHistory(limit);
}

export function getBehaviorTrend() {
  return model.getTrend();
}

export default {
  getBehaviorModel,
  startBehaviorSession,
  endBehaviorSession,
  getBehaviorHistory,
  getBehaviorTrend,
};
