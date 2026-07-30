/**
 * 错题本服务
 * 自动收集错题，支持复习
 */

import { storage } from "./utils";

const WRONG_KEY = "wrong_questions";
const FAVORITES_KEY = "favorite_questions";
const MAX_WRONG = 200;
const MAX_FAVORITES = 100;

/**
 * 添加错题
 */
export function addWrongQuestion(question, errorType, userAnswer) {
  const wrongList = storage.get(WRONG_KEY, []);

  // 检查是否已存在
  const existing = wrongList.find((w) => w.questionId === question.id);
  if (existing) {
    existing.wrongCount = (existing.wrongCount || 1) + 1;
    existing.lastWrongTime = new Date().toISOString();
    existing.errorTypes = [...new Set([...(existing.errorTypes || []), errorType])];
  } else {
    wrongList.unshift({
      questionId: question.id,
      language: question.language,
      module: question.module,
      code: question.code || question.code_with_bug,
      expected: question.code || question.correct_code,
      explanation: question.explanation,
      errorType,
      userAnswer,
      wrongCount: 1,
      lastWrongTime: new Date().toISOString(),
      mastered: false,
    });
  }

  // 限制数量
  if (wrongList.length > MAX_WRONG) {
    wrongList.length = MAX_WRONG;
  }

  storage.set(WRONG_KEY, wrongList);
}

/**
 * 获取错题列表
 */
export function getWrongQuestions(options = {}) {
  const { language, module, mastered, limit = 50 } = options;
  let list = storage.get(WRONG_KEY, []);

  if (language) {
    list = list.filter((w) => w.language === language);
  }
  if (module) {
    list = list.filter((w) => w.module === module);
  }
  if (mastered !== undefined) {
    list = list.filter((w) => w.mastered === mastered);
  }

  return list.slice(0, limit);
}

/**
 * 标记错题已掌握
 */
export function markWrongMastered(questionId) {
  const wrongList = storage.get(WRONG_KEY, []);
  const item = wrongList.find((w) => w.questionId === questionId);
  if (item) {
    item.mastered = true;
    item.masteredTime = new Date().toISOString();
    storage.set(WRONG_KEY, wrongList);
  }
}

/**
 * 删除错题
 */
export function removeWrongQuestion(questionId) {
  const wrongList = storage.get(WRONG_KEY, []);
  const filtered = wrongList.filter((w) => w.questionId !== questionId);
  storage.set(WRONG_KEY, filtered);
}

/**
 * 添加收藏
 */
export function addFavorite(question) {
  const favList = storage.get(FAVORITES_KEY, []);

  if (favList.find((f) => f.questionId === question.id)) {
    return false; // 已收藏
  }

  favList.unshift({
    questionId: question.id,
    language: question.language,
    module: question.module,
    code: question.code || question.code_with_bug,
    explanation: question.explanation,
    addedTime: new Date().toISOString(),
  });

  if (favList.length > MAX_FAVORITES) {
    favList.length = MAX_FAVORITES;
  }

  storage.set(FAVORITES_KEY, favList);
  return true;
}

/**
 * 取消收藏
 */
export function removeFavorite(questionId) {
  const favList = storage.get(FAVORITES_KEY, []);
  const filtered = favList.filter((f) => f.questionId !== questionId);
  storage.set(FAVORITES_KEY, filtered);
}

/**
 * 获取收藏列表
 */
export function getFavorites(options = {}) {
  const { language, module, limit = 50 } = options;
  let list = storage.get(FAVORITES_KEY, []);

  if (language) {
    list = list.filter((f) => f.language === language);
  }
  if (module) {
    list = list.filter((f) => f.module === module);
  }

  return list.slice(0, limit);
}

/**
 * 检查是否已收藏
 */
export function isFavorite(questionId) {
  const favList = storage.get(FAVORITES_KEY, []);
  return favList.some((f) => f.questionId === questionId);
}

/**
 * 获取错题统计
 */
export function getWrongStats() {
  const wrongList = storage.get(WRONG_KEY, []);
  const total = wrongList.length;
  const mastered = wrongList.filter((w) => w.mastered).length;
  const unmastered = total - mastered;

  const byType = {};
  for (const w of wrongList) {
    const type = w.errorType || "unknown";
    byType[type] = (byType[type] || 0) + 1;
  }

  return { total, mastered, unmastered, byType };
}

export default {
  addWrongQuestion,
  getWrongQuestions,
  markWrongMastered,
  removeWrongQuestion,
  addFavorite,
  removeFavorite,
  getFavorites,
  isFavorite,
  getWrongStats,
};
