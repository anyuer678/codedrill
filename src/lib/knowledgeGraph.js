/**
 * 知识图谱引擎
 * 管理编程知识点的关联关系
 */

import knowledgeGraphData from "../../core/knowledge_graph.json";

class KnowledgeGraph {
  constructor() {
    this.nodes = new Map();
    this.edges = [];
    this.learningPaths = {};

    this.loadData();
  }

  loadData() {
    // 加载节点
    for (const node of knowledgeGraphData.nodes) {
      this.nodes.set(node.id, { ...node, mastery: 0, visited: false });
    }

    // 加载边
    this.edges = knowledgeGraphData.edges || [];

    // 加载学习路径
    this.learningPaths = knowledgeGraphData.learningPaths || {};
  }

  /**
   * 获取节点信息
   */
  getNode(nodeId) {
    return this.nodes.get(nodeId) || null;
  }

  /**
   * 获取所有节点
   */
  getAllNodes() {
    return Array.from(this.nodes.values());
  }

  /**
   * 获取节点的前置依赖
   */
  getPrerequisites(nodeId) {
    return this.edges
      .filter((e) => e.to === nodeId && e.type === "requires")
      .map((e) => this.nodes.get(e.from))
      .filter(Boolean);
  }

  /**
   * 获取节点的后续节点
   */
  getDependents(nodeId) {
    return this.edges
      .filter((e) => e.from === nodeId)
      .map((e) => this.nodes.get(e.to))
      .filter(Boolean);
  }

  /**
   * 获取节点的关联节点（双向）
   */
  getRelatedNodes(nodeId) {
    const related = new Set();

    for (const edge of this.edges) {
      if (edge.from === nodeId) {related.add(edge.to);}
      if (edge.to === nodeId) {related.add(edge.from);}
    }

    return Array.from(related)
      .map((id) => this.nodes.get(id))
      .filter(Boolean);
  }

  /**
   * 更新节点掌握度
   */
  updateMastery(nodeId, mastery) {
    const node = this.nodes.get(nodeId);
    if (node) {
      node.mastery = Math.max(0, Math.min(100, mastery));
      node.visited = true;
    }
  }

  /**
   * 获取学习路径
   */
  getPath(pathName) {
    const pathNodes = this.learningPaths[pathName] || [];
    return pathNodes.map((id) => this.nodes.get(id)).filter(Boolean);
  }

  /**
   * 获取推荐的下一个学习节点
   */
  getNextRecommendation() {
    const unvisited = Array.from(this.nodes.values()).filter((n) => !n.visited);

    if (unvisited.length === 0) {
      // 所有节点已访问，推荐掌握度最低的
      return Array.from(this.nodes.values()).sort((a, b) => a.mastery - b.mastery)[0];
    }

    // 找到前置已满足的未访问节点
    for (const node of unvisited) {
      const prereqs = this.getPrerequisites(node.id);
      const allMet = prereqs.every((p) => p.mastery >= 50);
      if (allMet) {return node;}
    }

    return unvisited[0];
  }

  /**
   * 计算图谱完成度
   */
  getCompletionRate() {
    const nodes = Array.from(this.nodes.values());
    if (nodes.length === 0) {return 0;}

    const visited = nodes.filter((n) => n.visited).length;
    return Math.round((visited / nodes.length) * 100);
  }

  /**
   * 获取图谱数据（用于可视化）
   */
  getGraphData() {
    const nodes = Array.from(this.nodes.values()).map((n) => ({
      id: n.id,
      label: n.label,
      module: n.module,
      level: n.level,
      mastery: n.mastery,
      visited: n.visited,
    }));

    const edges = this.edges.map((e) => ({
      from: e.from,
      to: e.to,
      type: e.type,
      weight: e.weight || 1,
    }));

    return { nodes, edges };
  }
}

// 单例实例
const graph = new KnowledgeGraph();

export function getKnowledgeGraph() {
  return graph;
}

export function updateNodeMastery(nodeId, mastery) {
  graph.updateMastery(nodeId, mastery);
}

export function getNextRecommendation() {
  return graph.getNextRecommendation();
}

export function getGraphData() {
  return graph.getGraphData();
}

export function getCompletionRate() {
  return graph.getCompletionRate();
}

export default {
  getKnowledgeGraph,
  updateNodeMastery,
  getNextRecommendation,
  getGraphData,
  getCompletionRate,
};
