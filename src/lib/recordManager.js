/**
 * 训练记录管理器
 * 负责记录、查询、统计训练数据
 */

import { storage } from "./utils";
import { STORAGE_KEYS } from "./constants";

const MAX_HISTORY = 500;

/**
 * 记录一次训练会话
 */
export function recordSession(sessionData) {
  const history = getHistory();

  const record = {
    id: `session_${Date.now()}`,
    timestamp: new Date().toISOString(),
    ...sessionData,
  };

  history.unshift(record);

  if (history.length > MAX_HISTORY) {
    history.length = MAX_HISTORY;
  }

  storage.set(STORAGE_KEYS.HISTORY, history);
  updateStats(record);

  return record;
}

/**
 * 获取训练历史
 */
export function getHistory(limit = 100) {
  return storage.get(STORAGE_KEYS.HISTORY, []).slice(0, limit);
}

/**
 * 按条件筛选历史
 */
export function filterHistory({ mode, language, module, startDate, endDate } = {}) {
  let history = getHistory();

  if (mode) {
    history = history.filter((r) => r.mode === mode);
  }
  if (language) {
    history = history.filter((r) => r.language === language);
  }
  if (module) {
    history = history.filter((r) => r.module === module);
  }
  if (startDate) {
    history = history.filter((r) => new Date(r.timestamp) >= new Date(startDate));
  }
  if (endDate) {
    history = history.filter((r) => new Date(r.timestamp) <= new Date(endDate));
  }

  return history;
}

/**
 * 更新统计数据
 */
function updateStats(record) {
  const stats = storage.get(STORAGE_KEYS.STATS, {
    totalSessions: 0,
    totalQuestions: 0,
    totalCorrect: 0,
    totalTime: 0,
    byMode: {},
    byLanguage: {},
    byModule: {},
    dailyStats: {},
  });

  stats.totalSessions++;
  stats.totalQuestions += record.total || 0;
  stats.totalCorrect += record.correct || 0;
  stats.totalTime += record.totalTime || 0;

  // 按模式统计
  if (!stats.byMode[record.mode]) {
    stats.byMode[record.mode] = { sessions: 0, questions: 0, correct: 0 };
  }
  stats.byMode[record.mode].sessions++;
  stats.byMode[record.mode].questions += record.total || 0;
  stats.byMode[record.mode].correct += record.correct || 0;

  // 按语言统计
  if (!stats.byLanguage[record.language]) {
    stats.byLanguage[record.language] = { sessions: 0, questions: 0, correct: 0 };
  }
  stats.byLanguage[record.language].sessions++;
  stats.byLanguage[record.language].questions += record.total || 0;
  stats.byLanguage[record.language].correct += record.correct || 0;

  // 按模块统计
  if (record.module) {
    if (!stats.byModule[record.module]) {
      stats.byModule[record.module] = { sessions: 0, questions: 0, correct: 0 };
    }
    stats.byModule[record.module].sessions++;
    stats.byModule[record.module].questions += record.total || 0;
    stats.byModule[record.module].correct += record.correct || 0;
  }

  // 每日统计
  const dateKey = new Date().toISOString().split("T")[0];
  if (!stats.dailyStats[dateKey]) {
    stats.dailyStats[dateKey] = { sessions: 0, questions: 0, correct: 0 };
  }
  stats.dailyStats[dateKey].sessions++;
  stats.dailyStats[dateKey].questions += record.total || 0;
  stats.dailyStats[dateKey].correct += record.correct || 0;

  // 清理超过30天的每日统计
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  for (const key of Object.keys(stats.dailyStats)) {
    if (new Date(key) < thirtyDaysAgo) {
      delete stats.dailyStats[key];
    }
  }

  storage.set(STORAGE_KEYS.STATS, stats);
}

/**
 * 获取总览统计
 */
export function getOverviewStats() {
  const stats = storage.get(STORAGE_KEYS.STATS, {
    totalSessions: 0,
    totalQuestions: 0,
    totalCorrect: 0,
    totalTime: 0,
  });

  return {
    totalSessions: stats.totalSessions,
    totalQuestions: stats.totalQuestions,
    totalCorrect: stats.totalCorrect,
    accuracy: stats.totalQuestions > 0 ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100) : 0,
    avgTimePerQuestion: stats.totalQuestions > 0 ? (stats.totalTime / stats.totalQuestions).toFixed(1) : "0.0",
    totalTime: stats.totalTime,
  };
}

/**
 * 获取模式统计
 */
export function getModeStats() {
  const stats = storage.get(STORAGE_KEYS.STATS, { byMode: {} });
  const result = {};

  for (const [mode, data] of Object.entries(stats.byMode)) {
    result[mode] = {
      ...data,
      accuracy: data.questions > 0 ? Math.round((data.correct / data.questions) * 100) : 0,
    };
  }

  return result;
}

/**
 * 获取每日趋势
 */
export function getDailyTrend(days = 7) {
  const stats = storage.get(STORAGE_KEYS.STATS, { dailyStats: {} });
  const trend = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const key = date.toISOString().split("T")[0];
    const dayStats = stats.dailyStats[key] || { sessions: 0, questions: 0, correct: 0 };

    trend.push({
      date: key,
      ...dayStats,
      accuracy: dayStats.questions > 0 ? Math.round((dayStats.correct / dayStats.questions) * 100) : 0,
    });
  }

  return trend;
}

/**
 * 获取连续训练天数
 */
export function getStreak() {
  const stats = storage.get(STORAGE_KEYS.STATS, { dailyStats: {} });
  const dates = Object.keys(stats.dailyStats).sort().reverse();

  if (dates.length === 0) {return { current: 0, max: 0 };}

  let current = 0;
  let max = 0;
  let streak = 0;

  for (let i = 0; i < dates.length; i++) {
    const expected = new Date();
    expected.setDate(expected.getDate() - i);
    const expectedKey = expected.toISOString().split("T")[0];

    if (dates[i] === expectedKey) {
      streak++;
      max = Math.max(max, streak);
    } else {
      break;
    }
  }

  current = streak;

  return { current, max };
}

/**
 * 清除所有记录
 */
export function clearAll() {
  storage.remove(STORAGE_KEYS.HISTORY);
  storage.remove(STORAGE_KEYS.STATS);
}

export default {
  recordSession,
  getHistory,
  filterHistory,
  getOverviewStats,
  getModeStats,
  getDailyTrend,
  getStreak,
  clearAll,
};
