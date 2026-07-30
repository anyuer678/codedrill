/**
 * 行为追踪 composable
 * 采集用户训练行为数据
 */

import { ref } from "vue";
import { storage } from "@/lib/utils";

const STORAGE_KEY = "behavior_data";

export function useBehaviorTracking() {
  const sessionEvents = ref([]);
  const sessionStart = ref(null);

  /**
   * 开始追踪会话
   */
  function startTracking(sessionId) {
    sessionStart.value = Date.now();
    sessionEvents.value = [];
    addEvent("session_start", { sessionId });
  }

  /**
   * 记录事件
   */
  function addEvent(type, data = {}) {
    sessionEvents.value.push({
      type,
      timestamp: Date.now(),
      relativeTime: sessionStart.value ? Date.now() - sessionStart.value : 0,
      ...data,
    });
  }

  /**
   * 记录按键
   */
  function recordKeystroke(key) {
    addEvent("keystroke", { key });
  }

  /**
   * 记录输入
   */
  function recordInput(length, lineCount) {
    addEvent("input", { length, lineCount });
  }

  /**
   * 记录停顿（超过阈值）
   */
  function recordPause(duration) {
    addEvent("pause", { duration });
  }

  /**
   * 记录删除
   */
  function recordDelete(count) {
    addEvent("delete", { count });
  }

  /**
   * 记录提交
   */
  function recordSubmit(correct, timeSpent) {
    addEvent("submit", { correct, timeSpent });
  }

  /**
   * 记录卡点
   */
  function recordStuck(line, duration) {
    addEvent("stuck", { line, duration });
  }

  /**
   * 结束追踪并生成报告
   */
  function endTracking() {
    addEvent("session_end");
    const report = generateReport();
    saveReport(report);
    return report;
  }

  /**
   * 生成行为报告
   */
  function generateReport() {
    const events = sessionEvents.value;
    const duration = events.length > 0
      ? events[events.length - 1].relativeTime
      : 0;

    const keystrokes = events.filter((e) => e.type === "keystroke").length;
    const pauses = events.filter((e) => e.type === "pause");
    const deletes = events.filter((e) => e.type === "delete");
    const submits = events.filter((e) => e.type === "submit");
    const stuckEvents = events.filter((e) => e.type === "stuck");

    const correctSubmits = submits.filter((s) => s.correct);
    const submitTimes = submits.map((s) => s.timeSpent || 0);

    return {
      sessionId: events[0]?.sessionId || "",
      duration,
      durationFormatted: formatDuration(duration),
      metrics: {
        totalKeystrokes: keystrokes,
        totalPauses: pauses.length,
        totalDeletes: deletes.reduce((sum, d) => sum + (d.count || 1), 0),
        submitCount: submits.length,
        correctCount: correctSubmits.length,
      },
      analysis: {
        typingSpeed: duration > 0 ? Math.round((keystrokes / (duration / 1000)) * 60) : 0,
        avgSubmitTime: submitTimes.length > 0
          ? (submitTimes.reduce((a, b) => a + b, 0) / submitTimes.length).toFixed(1)
          : "0.0",
        accuracy: submits.length > 0
          ? Math.round((correctSubmits.length / submits.length) * 100)
          : 0,
        stuckPoints: stuckEvents.length,
        deleteRatio: keystrokes > 0
          ? Math.round((deletes.reduce((sum, d) => sum + (d.count || 1), 0) / keystrokes) * 100)
          : 0,
      },
      events: events.slice(-100), // 只保留最近100个事件
    };
  }

  /**
   * 保存报告
   */
  function saveReport(report) {
    const history = storage.get(STORAGE_KEY, []);
    history.unshift(report);
    if (history.length > 50) {
      history.length = 50;
    }
    storage.set(STORAGE_KEY, history);
  }

  /**
   * 获取历史报告
   */
  function getHistory(limit = 10) {
    const history = storage.get(STORAGE_KEY, []);
    return history.slice(0, limit);
  }

  /**
   * 获取趋势
   */
  function getTrend() {
    const history = getHistory(20);
    if (history.length < 2) {return null;}

    const recent = history.slice(0, 5);
    const older = history.slice(5, 10);

    if (older.length === 0) {return null;}

    const recentAvgSpeed = recent.reduce((sum, r) => sum + (r.analysis?.typingSpeed || 0), 0) / recent.length;
    const olderAvgSpeed = older.reduce((sum, r) => sum + (r.analysis?.typingSpeed || 0), 0) / older.length;

    const recentAccuracy = recent.reduce((sum, r) => sum + (r.analysis?.accuracy || 0), 0) / recent.length;
    const olderAccuracy = older.reduce((sum, r) => sum + (r.analysis?.accuracy || 0), 0) / older.length;

    return {
      speedTrend: recentAvgSpeed > olderAvgSpeed * 1.1 ? "improving" :
                  recentAvgSpeed < olderAvgSpeed * 0.9 ? "declining" : "stable",
      accuracyTrend: recentAccuracy > olderAccuracy + 5 ? "improving" :
                     recentAccuracy < olderAccuracy - 5 ? "declining" : "stable",
      recentAvgSpeed: Math.round(recentAvgSpeed),
      recentAccuracy: Math.round(recentAccuracy),
    };
  }

  return {
    sessionEvents,
    startTracking,
    addEvent,
    recordKeystroke,
    recordInput,
    recordPause,
    recordDelete,
    recordSubmit,
    recordStuck,
    endTracking,
    getHistory,
    getTrend,
  };
}

function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes === 0) {return `${remainingSeconds}秒`;}
  return `${minutes}分${remainingSeconds}秒`;
}

export default useBehaviorTracking;
