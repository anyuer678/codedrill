/**
 * 训练报告生成器
 * 生成每周/每月训练统计报告
 */

import { getHistory } from "./recordManager";

/**
 * 获取本周日期范围
 */
function getWeekRange() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - dayOfWeek);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(now);
  endDate.setHours(23, 59, 59, 999);

  return { start: startDate, end: endDate };
}

/**
 * 获取本月日期范围
 */
function getMonthRange() {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  return { start: startDate, end: endDate };
}

/**
 * 筛选日期范围内的记录
 */
function filterByDateRange(history, start, end) {
  return history.filter((r) => {
    const date = new Date(r.timestamp);
    return date >= start && date <= end;
  });
}

/**
 * 计算统计数据
 */
function calculateStats(records) {
  if (records.length === 0) {
    return {
      totalSessions: 0,
      totalQuestions: 0,
      totalCorrect: 0,
      accuracy: 0,
      avgTime: 0,
      totalTime: 0,
      byMode: {},
      byLanguage: {},
      dailyBreakdown: {},
    };
  }

  const totalQuestions = records.reduce((sum, r) => sum + (r.total || 0), 0);
  const totalCorrect = records.reduce((sum, r) => sum + (r.correct || 0), 0);
  const totalTime = records.reduce((sum, r) => sum + (r.totalTime || 0), 0);

  const byMode = {};
  const byLanguage = {};
  const dailyBreakdown = {};

  for (const record of records) {
    // 按模式
    const mode = record.mode || "unknown";
    if (!byMode[mode]) {byMode[mode] = { sessions: 0, questions: 0, correct: 0 };}
    byMode[mode].sessions++;
    byMode[mode].questions += record.total || 0;
    byMode[mode].correct += record.correct || 0;

    // 按语言
    const lang = record.language || "unknown";
    if (!byLanguage[lang]) {byLanguage[lang] = { sessions: 0, questions: 0, correct: 0 };}
    byLanguage[lang].sessions++;
    byLanguage[lang].questions += record.total || 0;
    byLanguage[lang].correct += record.correct || 0;

    // 每日分布
    const dateKey = record.timestamp ? record.timestamp.split("T")[0] : "unknown";
    if (!dailyBreakdown[dateKey]) {dailyBreakdown[dateKey] = { sessions: 0, questions: 0 };}
    dailyBreakdown[dateKey].sessions++;
    dailyBreakdown[dateKey].questions += record.total || 0;
  }

  return {
    totalSessions: records.length,
    totalQuestions,
    totalCorrect,
    accuracy: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
    avgTime: totalQuestions > 0 ? (totalTime / totalQuestions).toFixed(1) : "0.0",
    totalTime: Math.round(totalTime),
    byMode,
    byLanguage,
    dailyBreakdown,
  };
}

/**
 * 计算趋势
 */
function calculateTrend(current, previous) {
  if (previous.totalSessions === 0) {
    return { direction: "new", percentage: 0 };
  }

  const diff = current.accuracy - previous.accuracy;
  if (diff > 0) {return { direction: "up", percentage: diff };}
  if (diff < 0) {return { direction: "down", percentage: Math.abs(diff) };}
  return { direction: "stable", percentage: 0 };
}

/**
 * 生成周报
 */
export function generateWeeklyReport() {
  const history = getHistory(1000);
  const { start, end } = getWeekRange();

  // 本周数据
  const thisWeekRecords = filterByDateRange(history, start, end);
  const thisWeekStats = calculateStats(thisWeekRecords);

  // 上周数据
  const lastWeekStart = new Date(start);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);
  const lastWeekEnd = new Date(start);
  lastWeekEnd.setMilliseconds(-1);
  const lastWeekRecords = filterByDateRange(history, lastWeekStart, lastWeekEnd);
  const lastWeekStats = calculateStats(lastWeekRecords);

  const trend = calculateTrend(thisWeekStats, lastWeekStats);

  return {
    type: "weekly",
    period: {
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0],
    },
    stats: thisWeekStats,
    previousStats: lastWeekStats,
    trend,
    dailyBreakdown: thisWeekStats.dailyBreakdown,
  };
}

/**
 * 生成月报
 */
export function generateMonthlyReport() {
  const history = getHistory(1000);
  const { start, end } = getMonthRange();

  // 本月数据
  const thisMonthRecords = filterByDateRange(history, start, end);
  const thisMonthStats = calculateStats(thisMonthRecords);

  // 上月数据
  const lastMonthStart = new Date(start);
  lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
  const lastMonthEnd = new Date(start);
  lastMonthEnd.setMilliseconds(-1);
  const lastMonthRecords = filterByDateRange(history, lastMonthStart, lastMonthEnd);
  const lastMonthStats = calculateStats(lastMonthRecords);

  const trend = calculateTrend(thisMonthStats, lastMonthStats);

  // 计算周分布
  const weeklyBreakdown = {};
  for (const record of thisMonthRecords) {
    const date = new Date(record.timestamp);
    const weekNum = Math.ceil(date.getDate() / 7);
    const weekKey = `第${weekNum}周`;
    if (!weeklyBreakdown[weekKey]) {weeklyBreakdown[weekKey] = { sessions: 0, questions: 0 };}
    weeklyBreakdown[weekKey].sessions++;
    weeklyBreakdown[weekKey].questions += record.total || 0;
  }

  return {
    type: "monthly",
    period: {
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0],
    },
    stats: thisMonthStats,
    previousStats: lastMonthStats,
    trend,
    weeklyBreakdown,
  };
}

/**
 * 获取报告摘要
 */
export function getReportSummary() {
  const weekly = generateWeeklyReport();
  const monthly = generateMonthlyReport();

  return {
    weekly: {
      sessions: weekly.stats.totalSessions,
      questions: weekly.stats.totalQuestions,
      accuracy: weekly.stats.accuracy,
      trend: weekly.trend,
    },
    monthly: {
      sessions: monthly.stats.totalSessions,
      questions: monthly.stats.totalQuestions,
      accuracy: monthly.stats.accuracy,
      trend: monthly.trend,
    },
  };
}

export default {
  generateWeeklyReport,
  generateMonthlyReport,
  getReportSummary,
};
