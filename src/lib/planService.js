/**
 * 训练计划服务
 * 设定目标、追踪进度
 */

import { storage } from "./utils";

const STORAGE_KEY = "training_plan";

/**
 * 默认计划模板
 */
const DEFAULT_PLANS = [
  {
    id: "beginner",
    name: "新手入门",
    desc: "每天10题，坚持7天",
    dailyGoal: 10,
    duration: 7,
    targetAccuracy: 60,
  },
  {
    id: "intermediate",
    name: "进阶训练",
    desc: "每天20题，坚持14天",
    dailyGoal: 20,
    duration: 14,
    targetAccuracy: 75,
  },
  {
    id: "advanced",
    name: "高手挑战",
    desc: "每天30题，坚持30天",
    dailyGoal: 30,
    duration: 30,
    targetAccuracy: 85,
  },
];

/**
 * 获取当前计划
 */
export function getCurrentPlan() {
  const data = storage.get(STORAGE_KEY, null);
  if (!data || !data.current) {return null;}

  // 检查是否过期
  const startDate = new Date(data.current.startDate);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + data.current.duration);

  if (new Date() > endDate) {
    // 计划已结束
    data.completed = data.completed || [];
    data.completed.push({
      ...data.current,
      completedDate: new Date().toISOString(),
      progress: calculateProgress(data.current),
    });
    data.current = null;
    storage.set(STORAGE_KEY, data);
    return null;
  }

  return data.current;
}

/**
 * 开始新计划
 */
export function startPlan(planId) {
  const template = DEFAULT_PLANS.find((p) => p.id === planId);
  if (!template) {return null;}

  const plan = {
    ...template,
    startDate: new Date().toISOString(),
    dailyLog: {},
  };

  const data = storage.get(STORAGE_KEY, { completed: [] });
  data.current = plan;
  storage.set(STORAGE_KEY, data);

  return plan;
}

/**
 * 记录今日训练
 */
export function recordDailyTraining(questionsAnswered, correctCount) {
  const plan = getCurrentPlan();
  if (!plan) {return null;}

  const today = new Date().toISOString().split("T")[0];

  if (!plan.dailyLog[today]) {
    plan.dailyLog[today] = {
      questions: 0,
      correct: 0,
      sessions: 0,
    };
  }

  plan.dailyLog[today].questions += questionsAnswered;
  plan.dailyLog[today].correct += correctCount;
  plan.dailyLog[today].sessions++;

  // 保存
  const data = storage.get(STORAGE_KEY, { completed: [] });
  data.current = plan;
  storage.set(STORAGE_KEY, data);

  return getPlanProgress();
}

/**
 * 计算计划进度
 */
export function getPlanProgress() {
  const plan = getCurrentPlan();
  if (!plan) {return null;}

  const startDate = new Date(plan.startDate);
  const today = new Date();
  const daysPassed = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
  const totalDays = plan.duration;

  // 统计完成情况
  const dailyLog = plan.dailyLog || {};
  const completedDays = Object.keys(dailyLog).filter(
    (date) => dailyLog[date].questions >= plan.dailyGoal,
  ).length;

  const totalQuestions = Object.values(dailyLog).reduce(
    (sum, day) => sum + day.questions,
    0,
  );
  const totalCorrect = Object.values(dailyLog).reduce(
    (sum, day) => sum + day.correct,
    0,
  );

  return {
    plan: plan,
    daysPassed: Math.min(daysPassed, totalDays),
    totalDays: totalDays,
    completedDays: completedDays,
    dailyGoal: plan.dailyGoal,
    targetAccuracy: plan.targetAccuracy,
    currentAccuracy: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
    totalQuestions: totalQuestions,
    totalCorrect: totalCorrect,
    progress: Math.round((completedDays / totalDays) * 100),
    todayProgress: getTodayProgress(),
    isOnTrack: completedDays >= daysPassed - 1,
  };
}

/**
 * 获取今日进度
 */
export function getTodayProgress() {
  const plan = getCurrentPlan();
  if (!plan) {return { completed: 0, goal: 0, percentage: 0 };}

  const today = new Date().toISOString().split("T")[0];
  const dailyLog = plan.dailyLog || {};
  const todayLog = dailyLog[today] || { questions: 0 };

  return {
    completed: todayLog.questions,
    goal: plan.dailyGoal,
    percentage: Math.min(100, Math.round((todayLog.questions / plan.dailyGoal) * 100)),
  };
}

/**
 * 取消当前计划
 */
export function cancelPlan() {
  const data = storage.get(STORAGE_KEY, { completed: [] });
  if (data.current) {
    data.abandoned = data.abandoned || [];
    data.abandoned.push({
      ...data.current,
      abandonedDate: new Date().toISOString(),
    });
    data.current = null;
    storage.set(STORAGE_KEY, data);
  }
}

/**
 * 获取计划历史
 */
export function getPlanHistory() {
  const data = storage.get(STORAGE_KEY, { completed: [], abandoned: [] });
  return {
    completed: data.completed || [],
    abandoned: data.abandoned || [],
  };
}

/**
 * 获取可用计划模板
 */
export function getAvailablePlans() {
  return DEFAULT_PLANS;
}

/**
 * 计算进度
 */
function calculateProgress(plan) {
  const dailyLog = plan.dailyLog || {};
  const completedDays = Object.keys(dailyLog).filter(
    (date) => dailyLog[date].questions >= plan.dailyGoal,
  ).length;
  return Math.round((completedDays / plan.duration) * 100);
}

export default {
  getCurrentPlan,
  startPlan,
  recordDailyTraining,
  getPlanProgress,
  getTodayProgress,
  cancelPlan,
  getPlanHistory,
  getAvailablePlans,
};
