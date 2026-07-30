/**
 * 间隔重复服务
 * 基于 SM-2 算法，根据遗忘曲线安排复习
 */

import { storage } from "./utils";

const SRS_KEY = "srs_cards";

/**
 * SM-2 算法计算下次复习时间
 * @param {number} quality - 答题质量 (0-5)
 * @param {number} repetitions - 连续正确次数
 * @param {number} easeFactor - 难度因子
 * @param {number} interval - 当前间隔天数
 * @returns {Object} 新的复习参数
 */
export function sm2(quality, repetitions, easeFactor, interval) {
  let newRepetitions = repetitions;
  let newEaseFactor = easeFactor;
  let newInterval = interval;

  if (quality >= 3) {
    // 答对
    if (repetitions === 0) {
      newInterval = 1;
    } else if (repetitions === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * easeFactor);
    }
    newRepetitions = repetitions + 1;
  } else {
    // 答错，重置
    newRepetitions = 0;
    newInterval = 1;
  }

  // 更新难度因子
  newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newEaseFactor < 1.3) {newEaseFactor = 1.3;}

  return {
    repetitions: newRepetitions,
    easeFactor: newEaseFactor,
    interval: newInterval,
    nextReview: Date.now() + newInterval * 24 * 60 * 60 * 1000,
  };
}

/**
 * 获取所有 SRS 卡片
 */
export function getCards() {
  return storage.get(SRS_KEY, []);
}

/**
 * 获取需要复习的卡片
 */
export function getDueCards(limit = 20) {
  const cards = getCards();
  const now = Date.now();
  return cards
    .filter((c) => c.nextReview <= now)
    .sort((a, b) => a.nextReview - b.nextReview)
    .slice(0, limit);
}

/**
 * 添加或更新卡片
 */
export function addCard(questionId, language, module, code, explanation) {
  const cards = getCards();
  const existing = cards.find((c) => c.questionId === questionId);

  if (existing) {
    return existing;
  }

  const card = {
    questionId,
    language,
    module,
    code,
    explanation,
    repetitions: 0,
    easeFactor: 2.5,
    interval: 0,
    nextReview: Date.now(),
    createdAt: Date.now(),
    lastReview: null,
    reviewCount: 0,
  };

  cards.unshift(card);

  // 限制卡片数量
  if (cards.length > 500) {
    cards.length = 500;
  }

  storage.set(SRS_KEY, cards);
  return card;
}

/**
 * 复习卡片
 * @param {string} questionId - 题目 ID
 * @param {number} quality - 答题质量 (0-5)
 */
export function reviewCard(questionId, quality) {
  const cards = getCards();
  const card = cards.find((c) => c.questionId === questionId);

  if (!card) {return null;}

  const result = sm2(quality, card.repetitions, card.easeFactor, card.interval);

  card.repetitions = result.repetitions;
  card.easeFactor = result.easeFactor;
  card.interval = result.interval;
  card.nextReview = result.nextReview;
  card.lastReview = Date.now();
  card.reviewCount++;

  storage.set(SRS_KEY, cards);
  return card;
}

/**
 * 删除卡片
 */
export function removeCard(questionId) {
  const cards = getCards();
  const filtered = cards.filter((c) => c.questionId !== questionId);
  storage.set(SRS_KEY, filtered);
}

/**
 * 获取 SRS 统计
 */
export function getSrsStats() {
  const cards = getCards();
  const now = Date.now();
  const due = cards.filter((c) => c.nextReview <= now).length;
  const learning = cards.filter((c) => c.repetitions < 3).length;
  const mature = cards.filter((c) => c.repetitions >= 3).length;
  const totalReviews = cards.reduce((sum, c) => sum + c.reviewCount, 0);

  return {
    total: cards.length,
    due,
    learning,
    mature,
    totalReviews,
  };
}

/**
 * 从错题本导入卡片
 */
export function importFromWrongBook(wrongQuestions) {
  let imported = 0;
  for (const q of wrongQuestions) {
    if (!q.mastered) {
      addCard(q.questionId, q.language, q.module, q.code, q.explanation);
      imported++;
    }
  }
  return imported;
}

export default {
  sm2,
  getCards,
  getDueCards,
  addCard,
  reviewCard,
  removeCard,
  getSrsStats,
  importFromWrongBook,
};
