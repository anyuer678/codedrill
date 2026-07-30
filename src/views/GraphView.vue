<template>
  <div class="graph-layout">
    <div class="page-header">
      <h1 class="page-title">
        知识图谱
      </h1>
      <div class="header-actions">
        <span class="completion-badge">完成度 {{ completionRate }}%</span>
        <button
          class="btn"
          @click="goHome"
        >
          返回首页
        </button>
      </div>
    </div>

    <div class="graph-content">
      <!-- 图谱可视化 -->
      <div class="graph-panel">
        <div
          ref="canvasRef"
          class="graph-canvas"
        >
          <svg
            :width="canvasWidth"
            :height="canvasHeight"
          >
            <!-- 连线 -->
            <line
              v-for="(edge, i) in graphEdges"
              :key="'e' + i"
              :x1="getNodeX(edge.from)"
              :y1="getNodeY(edge.from)"
              :x2="getNodeX(edge.to)"
              :y2="getNodeY(edge.to)"
              :stroke="edge.type === 'requires' ? 'var(--border)' : 'var(--accent-10)'"
              stroke-width="2"
              :stroke-dasharray="edge.type === 'enhances' ? '5,5' : ''"
              opacity="0.5"
            />
            <!-- 节点 -->
            <g
              v-for="node in graphNodes"
              :key="node.id"
              :transform="`translate(${getNodeX(node.id)}, ${getNodeY(node.id)})`"
              class="graph-node"
              :class="{ visited: node.visited, selected: selectedNode?.id === node.id }"
              @click="selectNode(node)"
            >
              <circle
                r="24"
                :fill="getNodeColor(node)"
                :stroke="selectedNode?.id === node.id ? 'var(--accent-10)' : 'var(--border)'"
                stroke-width="2"
              />
              <text
                text-anchor="middle"
                dy="4"
                fill="white"
                font-size="12"
                font-weight="600"
              >
                {{ node.label.slice(0, 2) }}
              </text>
              <text
                text-anchor="middle"
                dy="38"
                fill="var(--text-500)"
                font-size="11"
              >
                {{ node.label }}
              </text>
            </g>
          </svg>
        </div>
      </div>

      <!-- 侧边信息 -->
      <div class="info-panel">
        <!-- 选中节点详情 -->
        <div
          v-if="selectedNode"
          class="detail-section"
        >
          <h3>{{ selectedNode.label }}</h3>
          <div class="detail-row">
            <span class="detail-label">模块</span>
            <span class="detail-value">{{ selectedNode.module }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">掌握度</span>
            <span class="detail-value">{{ selectedNode.mastery }}%</span>
          </div>
          <div class="mastery-bar">
            <div
              class="mastery-fill"
              :style="{ width: selectedNode.mastery + '%' }"
            />
          </div>

          <div
            v-if="prerequisites.length > 0"
            class="detail-section"
          >
            <div class="detail-subtitle">
              前置知识
            </div>
            <div class="prereq-list">
              <div
                v-for="pre in prerequisites"
                :key="pre.id"
                class="prereq-item"
                :class="{ met: pre.mastery >= 50 }"
              >
                <span class="prereq-icon">{{ pre.mastery >= 50 ? '✓' : '✗' }}</span>
                <span>{{ pre.label }}</span>
                <span class="prereq-mastery">{{ pre.mastery }}%</span>
              </div>
            </div>
          </div>

          <button
            class="btn btn-primary btn-train"
            @click="trainNode"
          >
            开始训练
          </button>
        </div>

        <!-- 学习路径 -->
        <div class="path-section">
          <h3>推荐学习路径</h3>
          <div class="path-list">
            <div
              v-for="(node, i) in recommendedPath"
              :key="node.id"
              class="path-item"
              :class="{ current: i === 0 }"
            >
              <span class="path-number">{{ i + 1 }}</span>
              <span class="path-label">{{ node.label }}</span>
              <span class="path-mastery">{{ node.mastery }}%</span>
            </div>
          </div>
        </div>

        <!-- 学习建议 -->
        <div
          v-if="suggestions.length > 0"
          class="suggestion-section"
        >
          <h3>学习建议</h3>
          <div class="suggestion-list">
            <div
              v-for="(s, i) in suggestions"
              :key="i"
              class="suggestion-item"
              :class="s.priority"
            >
              {{ s.message }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getGraphData, getCompletionRate } from "@/lib/knowledgeGraph";
import { getPersonalizedPath } from "@/lib/learningPath";

const router = useRouter();
const canvasRef = ref(null);
const canvasWidth = 800;
const canvasHeight = 500;
const selectedNode = ref(null);
const prerequisites = ref([]);
const recommendedPath = ref([]);
const suggestions = ref([]);
const completionRate = ref(0);

const graphData = ref({ nodes: [], edges: [] });

const graphNodes = computed(() => graphData.value.nodes);
const graphEdges = computed(() => graphData.value.edges);

// 节点布局 - 按层级排列
const nodePositions = {};

function calculatePositions() {
  const levels = {};
  for (const node of graphData.value.nodes) {
    const level = node.level || 1;
    if (!levels[level]) {levels[level] = [];}
    levels[level].push(node.id);
  }

  const levelKeys = Object.keys(levels).sort((a, b) => a - b);
  const levelHeight = canvasHeight / (levelKeys.length + 1);

  for (let i = 0; i < levelKeys.length; i++) {
    const level = levelKeys[i];
    const nodes = levels[level];
    const levelWidth = canvasWidth / (nodes.length + 1);

    for (let j = 0; j < nodes.length; j++) {
      nodePositions[nodes[j]] = {
        x: levelWidth * (j + 1),
        y: levelHeight * (i + 1),
      };
    }
  }
}

function getNodeX(nodeId) {
  return nodePositions[nodeId]?.x || 0;
}

function getNodeY(nodeId) {
  return nodePositions[nodeId]?.y || 0;
}

function getNodeColor(node) {
  if (node.mastery >= 80) {return "var(--correct)";}
  if (node.mastery >= 50) {return "var(--accent-10)";}
  if (node.mastery >= 20) {return "var(--accent-orange)";}
  if (node.visited) {return "var(--text-500)";}
  return "var(--text-400)";
}

function selectNode(node) {
  selectedNode.value = node;

  // 获取前置
  const pathData = getPersonalizedPath();
  prerequisites.value = pathData.currentNode?.id === node.id
    ? pathData.path[0]?.prerequisites || []
    : [];
}

function trainNode() {
  if (!selectedNode.value) {return;}
  router.push({
    name: "Train",
    params: { mode: "copy" },
    query: { lang: "Java", module: selectedNode.value.module, count: 10 },
  });
}

function goHome() {
  router.push("/");
}

onMounted(() => {
  graphData.value = getGraphData();
  completionRate.value = getCompletionRate();
  calculatePositions();

  const pathData = getPersonalizedPath();
  recommendedPath.value = pathData.path;
  suggestions.value = pathData.suggestions;
});
</script>

<style scoped>
.graph-layout {
  height: 100%;
  padding: var(--space-6);
  overflow-y: auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--border);
}

.page-title {
  font-size: var(--text-xl);
  font-weight: 700;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.completion-badge {
  padding: var(--space-2) var(--space-3);
  background: rgba(37, 99, 235, 0.1);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--accent-10);
}

.graph-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: var(--space-4);
}

.graph-panel {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.graph-canvas {
  width: 100%;
  height: 500px;
}

.graph-canvas svg {
  width: 100%;
  height: 100%;
}

.graph-node {
  cursor: pointer;
}

.graph-node:hover circle {
  filter: brightness(1.1);
}

.info-panel {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.detail-section, .path-section, .suggestion-section {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
}

.detail-section h3, .path-section h3, .suggestion-section h3 {
  font-size: var(--text-sm);
  font-weight: 600;
  margin-bottom: var(--space-3);
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-2);
}

.detail-label {
  font-size: var(--text-xs);
  color: var(--text-400);
}

.detail-value {
  font-size: var(--text-xs);
  font-weight: 600;
  font-family: var(--mono);
}

.mastery-bar {
  height: 6px;
  background: var(--border-light);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: var(--space-3);
}

.mastery-fill {
  height: 100%;
  background: var(--accent-10);
  border-radius: 3px;
}

.detail-subtitle {
  font-size: var(--text-xs);
  color: var(--text-400);
  margin-bottom: var(--space-2);
}

.prereq-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.prereq-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-xs);
}

.prereq-icon {
  font-weight: 700;
}

.prereq-item.met .prereq-icon {
  color: var(--correct);
}

.prereq-item:not(.met) .prereq-icon {
  color: var(--incorrect);
}

.prereq-mastery {
  margin-left: auto;
  font-family: var(--mono);
  color: var(--text-400);
}

.btn-train {
  width: 100%;
  margin-top: var(--space-3);
}

.path-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.path-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2);
  border-radius: var(--radius-sm);
}

.path-item.current {
  background: rgba(37, 99, 235, 0.1);
}

.path-number {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--border-light);
  border-radius: 50%;
  font-size: 11px;
  font-weight: 600;
}

.path-item.current .path-number {
  background: var(--accent-10);
  color: white;
}

.path-label {
  flex: 1;
  font-size: var(--text-xs);
}

.path-mastery {
  font-size: var(--text-xs);
  font-family: var(--mono);
  color: var(--text-400);
}

.suggestion-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.suggestion-item {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-xs);
  border-radius: var(--radius-sm);
  background: var(--border-light);
}

.suggestion-item.high {
  background: rgba(220, 38, 38, 0.1);
  color: var(--incorrect);
}

.suggestion-item.medium {
  background: rgba(217, 119, 6, 0.1);
  color: var(--warning);
}

/* 移动端响应式 */
@media (max-width: 768px) {
  .graph-layout {
    padding: var(--space-4);
  }

  .graph-content {
    grid-template-columns: 1fr;
  }

  .graph-panel {
    overflow-x: auto;
  }

  .graph-canvas {
    min-width: 300px;
    height: 300px;
  }

  .info-panel {
    gap: var(--space-3);
  }

  .detail-section, .path-section, .suggestion-section {
    padding: var(--space-3);
  }

  .btn-train {
    width: 100%;
  }
}
</style>
