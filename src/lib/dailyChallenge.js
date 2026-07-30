/**
 * 每日挑战服务
 * 每天生成固定的挑战题目
 */

import { getQuestions } from "./questionService";
import { storage } from "./utils";

const STORAGE_KEY = "daily_challenge";

/**
 * 获取今天的日期字符串
 */
function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
}

/**
 * 基于日期生成种子
 */
function dateSeed(dateStr) {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * 获取每日挑战配置
 */
export function getDailyChallenge() {
  const today = getTodayStr();
  const saved = storage.get(STORAGE_KEY, null);

  // 如果今天已经有挑战且已完成，返回保存的数据
  if (saved && saved.date === today) {
    return saved;
  }

  // 生成今天的挑战
  const seed = dateSeed(today);
  const languages = ["Java", "Python", "C++", "JavaScript"];
  const modules = ["loop", "condition", "array", "string", "function"];

  const lang = languages[seed % languages.length];
  const mod = modules[(seed >> 4) % modules.length];

  const challenge = {
    date: today,
    language: lang,
    module: mod,
    questionCount: 10,
    timeLimit: 300, // 5分钟
    completed: false,
    score: 0,
    accuracy: 0,
    questions: [],
    results: [],
  };

  return challenge;
}

/**
 * 加载每日挑战题目
 */
export async function loadDailyQuestions() {
  const challenge = getDailyChallenge();
  if (challenge.questions.length > 0) {
    return challenge.questions;
  }

  const questions = await getQuestions(
    challenge.language,
    challenge.module,
    challenge.questionCount,
  );

  challenge.questions = questions;
  saveChallenge(challenge);

  return questions;
}

/**
 * 保存挑战结果
 */
export function saveChallengeResult(results, score) {
  const challenge = getDailyChallenge();
  challenge.completed = true;
  challenge.results = results;
  challenge.score = score;

  const correct = results.filter((r) => r?.correct).length;
  challenge.accuracy = results.length > 0 ? Math.round((correct / results.length) * 100) : 0;

  saveChallenge(challenge);

  // 更新历史记录
  updateHistory(challenge);

  return challenge;
}

/**
 * 获取挑战历史
 */
export function getChallengeHistory() {
  const data = storage.get(STORAGE_KEY, {});
  return data.history || [];
}

/**
 * 获取连续挑战天数
 */
export function getStreak() {
  const history = getChallengeHistory();
  if (history.length === 0) {return 0;}

  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

    if (history.some((h) => h.date === dateStr)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function saveChallenge(challenge) {
  storage.set(STORAGE_KEY, challenge);
}

function updateHistory(challenge) {
  const data = storage.get(STORAGE_KEY, {});
  if (!data.history) {data.history = [];}

  // 添加到历史
  data.history.unshift({
    date: challenge.date,
    language: challenge.language,
    module: challenge.module,
    score: challenge.score,
    accuracy: challenge.accuracy,
  });

  // 只保留90天
  if (data.history.length > 90) {
    data.history = data.history.slice(0, 90);
  }

  storage.set(STORAGE_KEY, data);
}

export default {
  getDailyChallenge,
  loadDailyQuestions,
  saveChallengeResult,
  getChallengeHistory,
  getStreak,
};
