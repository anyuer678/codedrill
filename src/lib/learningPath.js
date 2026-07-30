/**
 * 学习路径推荐器
 * 基于知识图谱和用户状态推荐学习路径
 */

import { getKnowledgeGraph, updateNodeMastery } from "./knowledgeGraph";
import { getBehaviorModel } from "./behaviorModel";
import { analyzeWeaknesses } from "./weaknessAnalyzer";
import { getHistory } from "./recordManager";

/**
 * 获取个性化学习路径推荐
 */
export function getPersonalizedPath() {
  const graph = getKnowledgeGraph();
  const weaknesses = analyzeWeaknesses(50);
  const behavior = getBehaviorModel();
  const history = getHistory(50);

  // 更新图谱节点掌握度
  updateGraphMastery(graph, history);

  // 获取推荐
  const recommendation = graph.getNextRecommendation();
  const completionRate = graph.getCompletionRate();

  // 生成路径
  const path = generatePath(graph, weaknesses, recommendation);

  return {
    currentNode: recommendation,
    path,
    completionRate,
    weakAreas: getWeakAreas(weaknesses),
    suggestions: generateSuggestions(weaknesses, behavior.getTrend()),
  };
}

/**
 * 根据训练历史更新图谱掌握度
 */
function updateGraphMastery(graph, history) {
  const moduleStats = {};

  for (const session of history) {
    const module = session.module;
    if (!moduleStats[module]) {
      moduleStats[module] = { total: 0, correct: 0 };
    }
    moduleStats[module].total += session.total || 0;
    moduleStats[module].correct += session.correct || 0;
  }

  for (const [module, stats] of Object.entries(moduleStats)) {
    const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
    updateNodeMastery(module, accuracy);
  }
}

/**
 * 生成学习路径
 */
function generatePath(graph, weaknesses, currentNode) {
  if (!currentNode) {return [];}

  const path = [currentNode];
  const visited = new Set([currentNode.id]);

  // 向后延伸
  let current = currentNode;
  for (let i = 0; i < 4; i++) {
    const dependents = graph.getDependents(current.id);
    const next = dependents.find((d) => !visited.has(d.id));
    if (next) {
      path.push(next);
      visited.add(next.id);
      current = next;
    } else {
      break;
    }
  }

  return path;
}

/**
 * 获取薄弱领域
 */
function getWeakAreas(weaknesses) {
  if (!weaknesses.hasData) {return [];}

  return Object.entries(weaknesses.modules)
    .filter(([, stats]) => stats.weaknessLevel === "weak" || stats.weaknessLevel === "critical")
    .map(([module, stats]) => ({
      module,
      accuracy: stats.accuracy,
      level: stats.weaknessLevel,
    }))
    .sort((a, b) => a.accuracy - b.accuracy);
}

/**
 * 生成学习建议
 */
function generateSuggestions(weaknesses, trend) {
  const suggestions = [];

  // 基于弱点的建议
  if (weaknesses.hasData) {
    const weakModules = Object.entries(weaknesses.modules)
      .filter(([, stats]) => stats.accuracy < 70)
      .sort(([, a], [, b]) => a.accuracy - b.accuracy);

    if (weakModules.length > 0) {
      const [module, stats] = weakModules[0];
      suggestions.push({
        type: "weakness",
        priority: "high",
        message: `${module} 模块正确率仅 ${stats.accuracy}%，建议重点练习`,
        action: { mode: "copy", module },
      });
    }
  }

  // 基于趋势的建议
  if (trend) {
    if (trend.speedTrend === "declining") {
      suggestions.push({
        type: "speed",
        priority: "medium",
        message: "近期打字速度下降，建议做限时速写练习",
        action: { mode: "reflex" },
      });
    }

    if (trend.accuracyTrend === "declining") {
      suggestions.push({
        type: "accuracy",
        priority: "medium",
        message: "近期正确率下降，建议回到基础模式巩固",
        action: { mode: "copy" },
      });
    }
  }

  // 默认建议
  if (suggestions.length === 0) {
    suggestions.push({
      type: "general",
      priority: "low",
      message: "保持每日练习，持续提升编程能力",
      action: { mode: "copy", module: "loop" },
    });
  }

  return suggestions;
}

/**
 * 获取模块学习顺序
 */
export function getModuleOrder(language = "Java") {
  const graph = getKnowledgeGraph();
  const lang = language.toLowerCase().replace("++", "cpp");
  
  const beginnerPath = graph.getPath(`${lang}-beginner`) || graph.getPath("java-beginner");
  const intermediatePath = graph.getPath(`${lang}-intermediate`) || graph.getPath("java-intermediate");
  const advancedPath = graph.getPath(`${lang}-advanced`) || graph.getPath("java-advanced");

  return {
    beginner: beginnerPath,
    intermediate: intermediatePath,
    advanced: advancedPath,
  };
}

/**
 * 获取语言特定的学习路径
 */
export function getLanguagePath(language) {
  const graph = getKnowledgeGraph();
  const lang = language.toLowerCase().replace("++", "cpp");
  
  const paths = {
    beginner: graph.getPath(`${lang}-beginner`),
    intermediate: graph.getPath(`${lang}-intermediate`),
    advanced: graph.getPath(`${lang}-advanced`),
  };
  
  // 如果没有找到语言特定路径，返回默认路径
  if (paths.beginner.length === 0) {
    return getModuleOrder("Java");
  }
  
  return paths;
}

/**
 * 检查前置是否满足
 */
export function checkPrerequisites(module) {
  const graph = getKnowledgeGraph();
  const prereqs = graph.getPrerequisites(module);

  return {
    met: prereqs.every((p) => p.mastery >= 50),
    prerequisites: prereqs.map((p) => ({
      id: p.id,
      label: p.label,
      mastery: p.mastery,
      met: p.mastery >= 50,
    })),
  };
}

export default {
  getPersonalizedPath,
  getModuleOrder,
  getLanguagePath,
  checkPrerequisites,
};
