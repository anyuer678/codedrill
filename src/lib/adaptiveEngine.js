/**
 * 自适应难度引擎
 * 根据用户表现动态调整题目难度
 */

/**
 * 计算下一题难度
 */
export function calculateNextDifficulty(recentResults, currentDifficulty) {
  if (!recentResults || recentResults.length === 0) {
    return currentDifficulty || 1;
  }

  const recent = recentResults.slice(-5);
  const accuracy = recent.filter((r) => r.correct).length / recent.length;
  const avgTime = recent.reduce((sum, r) => sum + (r.timeSpent || 0), 0) / recent.length;

  let adjustment = 0;

  // 正确率高 + 速度快 = 升级
  if (accuracy >= 0.8 && avgTime < getTimeThreshold(currentDifficulty)) {
    adjustment = 1;
  }
  // 正确率低 = 降级
  else if (accuracy < 0.5) {
    adjustment = -1;
  }
  // 正确率中等 + 速度慢 = 保持
  else if (accuracy >= 0.6 && avgTime > getTimeThreshold(currentDifficulty) * 1.5) {
    adjustment = 0;
  }

  const newDifficulty = Math.max(1, Math.min(5, currentDifficulty + adjustment));

  return newDifficulty;
}

/**
 * 获取速度阈值（秒）
 */
function getTimeThreshold(difficulty) {
  const thresholds = {
    1: 15,
    2: 25,
    3: 40,
    4: 60,
    5: 90,
  };
  return thresholds[difficulty] || 20;
}

/**
 * 计算综合能力评分
 */
export function calculateSkillScore(history) {
  if (!history || history.length === 0) {
    return { overall: 0, byModule: {}, byErrorType: {} };
  }

  const byModule = {};
  const byErrorType = {};

  for (const session of history) {
    const module = session.module || "unknown";
    if (!byModule[module]) {
      byModule[module] = { total: 0, correct: 0, totalTime: 0 };
    }
    byModule[module].total += session.total || 0;
    byModule[module].correct += session.correct || 0;
    byModule[module].totalTime += session.totalTime || 0;

    if (session.questions) {
      for (const q of session.questions) {
        const errType = q.errorType || "unknown";
        if (!byErrorType[errType]) {
          byErrorType[errType] = { count: 0, correct: 0 };
        }
        byErrorType[errType].count++;
        if (q.correct) {byErrorType[errType].correct++;}
      }
    }
  }

  // 计算模块得分
  const moduleScores = {};
  for (const [mod, stats] of Object.entries(byModule)) {
    const accuracy = stats.total > 0 ? stats.correct / stats.total : 0;
    const avgTime = stats.total > 0 ? stats.totalTime / stats.total : 0;
    const speedScore = Math.max(0, 1 - avgTime / 60);
    moduleScores[mod] = Math.round((accuracy * 0.7 + speedScore * 0.3) * 100);
  }

  // 计算错误类型得分
  const errorScores = {};
  for (const [errType, stats] of Object.entries(byErrorType)) {
    if (errType !== "unknown") {
      errorScores[errType] = stats.count > 0 ? Math.round((stats.correct / stats.count) * 100) : 0;
    }
  }

  // 综合得分
  const moduleValues = Object.values(moduleScores);
  const overall = moduleValues.length > 0
    ? Math.round(moduleValues.reduce((a, b) => a + b, 0) / moduleValues.length)
    : 0;

  return {
    overall,
    byModule: moduleScores,
    byErrorType: errorScores,
  };
}

/**
 * 推荐训练模式
 */
export function recommendTrainingMode(skillScore, weaknessAnalysis) {
  if (!skillScore || skillScore.overall === 0) {
    return { mode: "copy", reason: "从临摹模式开始" };
  }

  if (skillScore.overall < 40) {
    return { mode: "copy", reason: "基础较弱，建议多做临摹练习" };
  }

  if (skillScore.overall < 70) {
    if (weaknessAnalysis?.primaryType === "logic") {
      return { mode: "debug", reason: "逻辑错误较多，建议练习改错" };
    }
    return { mode: "fill", reason: "建议通过填空巩固知识点" };
  }

  return { mode: "reflex", reason: "基础扎实，可以挑战限时速写" };
}

export default {
  calculateNextDifficulty,
  calculateSkillScore,
  recommendTrainingMode,
};
