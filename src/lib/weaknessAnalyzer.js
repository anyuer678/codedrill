/**
 * 弱点分析器
 * 分析用户在各模块、各错误类型上的薄弱环节
 */

import { getHistory } from "./recordManager";

/**
 * 分析用户弱点
 */
export function analyzeWeaknesses(historyLimit = 50) {
  const history = getHistory(historyLimit);

  if (history.length === 0) {
    return { hasData: false, modules: {}, errorTypes: {}, recommendations: [] };
  }

  const moduleStats = {};
  const errorTypeStats = {};

  for (const session of history) {
    const module = session.module || "unknown";
    if (!moduleStats[module]) {
      moduleStats[module] = { total: 0, correct: 0, errors: [] };
    }
    moduleStats[module].total += session.total || 0;
    moduleStats[module].correct += session.correct || 0;

    if (session.questions) {
      for (const q of session.questions) {
        if (!q.correct && q.errorType) {
          moduleStats[module].errors.push(q.errorType);
          if (!errorTypeStats[q.errorType]) {
            errorTypeStats[q.errorType] = { count: 0, modules: [] };
          }
          errorTypeStats[q.errorType].count++;
          if (!errorTypeStats[q.errorType].modules.includes(module)) {
            errorTypeStats[q.errorType].modules.push(module);
          }
        }
      }
    }
  }

  const modules = {};
  for (const [mod, stats] of Object.entries(moduleStats)) {
    const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
    const errorCounts = {};
    for (const err of stats.errors) {
      errorCounts[err] = (errorCounts[err] || 0) + 1;
    }
    const topError = Object.entries(errorCounts).sort(([, a], [, b]) => b - a)[0];

    modules[mod] = {
      accuracy,
      total: stats.total,
      correct: stats.correct,
      weaknessLevel: getWeaknessLevel(accuracy),
      topError: topError ? topError[0] : null,
      errorCounts,
    };
  }

  const errorTypes = {};
  for (const [err, stats] of Object.entries(errorTypeStats)) {
    errorTypes[err] = {
      count: stats.count,
      modules: stats.modules,
      percentage: Math.round((stats.count / history.length) * 100),
    };
  }

  const recommendations = generateRecommendations(modules, errorTypes);

  return {
    hasData: true,
    modules,
    errorTypes,
    recommendations,
  };
}

/**
 * 获取弱点等级
 */
function getWeaknessLevel(accuracy) {
  if (accuracy >= 90) {return "strong";}
  if (accuracy >= 70) {return "normal";}
  if (accuracy >= 50) {return "weak";}
  return "critical";
}

/**
 * 生成训练建议
 */
function generateRecommendations(modules, errorTypes) {
  const recommendations = [];

  // 按模块弱点排序
  const weakModules = Object.entries(modules)
    .filter(([, stats]) => stats.weaknessLevel === "weak" || stats.weaknessLevel === "critical")
    .sort(([, a], [, b]) => a.accuracy - b.accuracy);

  if (weakModules.length > 0) {
    const [mod, stats] = weakModules[0];
    recommendations.push({
      type: "module",
      priority: "high",
      module: mod,
      message: `${mod} 模块正确率仅 ${stats.accuracy}%，建议加强练习`,
      action: { mode: "copy", module: mod },
    });
  }

  // 按错误类型排序
  const topErrors = Object.entries(errorTypes)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 2);

  for (const [errType, stats] of topErrors) {
    const labels = {
      syntax: "语法",
      structure: "结构",
      api: "API使用",
      logic: "逻辑",
      typo: "手速",
    };
    recommendations.push({
      type: "error",
      priority: "medium",
      errorType: errType,
      message: `${labels[errType] || errType} 错误出现 ${stats.count} 次，集中在 ${stats.modules.join(", ")} 模块`,
      action: { mode: "debug", module: stats.modules[0] },
    });
  }

  return recommendations;
}

/**
 * 获取指定模块的弱点详情
 */
export function getModuleWeakness(module) {
  const result = analyzeWeaknesses();
  return result.modules[module] || null;
}

/**
 * 获取训练建议
 */
export function getTrainingSuggestions() {
  const result = analyzeWeaknesses();
  if (!result.hasData) {
    return [{ type: "start", message: "开始训练以获取个性化建议", action: { mode: "copy", module: "loop" } }];
  }
  return result.recommendations;
}

export default {
  analyzeWeaknesses,
  getModuleWeakness,
  getTrainingSuggestions,
};
