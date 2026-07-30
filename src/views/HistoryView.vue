<template>
  <div class="history-layout">
    <div class="page-header">
      <h1 class="page-title">
        训练历史
      </h1>
      <div class="header-actions">
        <select
          v-model="filterMode"
          class="select filter-select"
        >
          <option value="">
            全部模式
          </option>
          <option value="copy">
            代码临摹
          </option>
          <option value="fill">
            代码填空
          </option>
          <option value="debug">
            改错练习
          </option>
          <option value="reflex">
            限时速写
          </option>
          <option value="arena">
            竞技场
          </option>
        </select>
        <select
          v-model="filterLang"
          class="select filter-select"
        >
          <option value="">
            全部语言
          </option>
          <option value="Java">
            Java
          </option>
          <option value="Python">
            Python
          </option>
          <option value="C++">
            C++
          </option>
        </select>
        <button
          class="btn"
          @click="goHome"
        >
          返回首页
        </button>
      </div>
    </div>

    <!-- 统计概览 -->
    <div class="overview-grid">
      <div class="overview-card">
        <div class="overview-value">
          {{ filteredHistory.length }}
        </div>
        <div class="overview-label">
          训练次数
        </div>
      </div>
      <div class="overview-card">
        <div class="overview-value">
          {{ totalQuestions }}
        </div>
        <div class="overview-label">
          总答题数
        </div>
      </div>
      <div class="overview-card">
        <div class="overview-value">
          {{ overallAccuracy }}%
        </div>
        <div class="overview-label">
          正确率
        </div>
      </div>
      <div class="overview-card">
        <div class="overview-value">
          {{ avgTime }}s
        </div>
        <div class="overview-label">
          平均用时
        </div>
      </div>
    </div>

    <!-- 趋势图 -->
    <div class="charts-row">
      <TrendChart
        title="正确率趋势"
        period="近7天"
        suffix="%"
        :data="accuracyTrend"
      />
      <TrendChart
        title="训练量趋势"
        period="近7天"
        suffix="题"
        :data="volumeTrend"
      />
    </div>

    <!-- 历史列表 -->
    <div class="history-list">
      <div
        v-if="filteredHistory.length === 0"
        class="empty-state"
      >
        暂无训练记录
      </div>
      <div
        v-for="(record, i) in paginatedHistory"
        :key="i"
        class="history-item"
        @click="showDetail(record)"
      >
        <div class="item-left">
          <div
            class="item-mode"
            :class="record.mode"
          >
            {{ modeLabels[record.mode] || record.mode }}
          </div>
          <div class="item-info">
            <span class="item-lang">{{ record.language }}</span>
            <span
              v-if="record.module"
              class="item-module"
            >{{ moduleLabels[record.module] || record.module }}</span>
          </div>
        </div>
        <div class="item-center">
          <div class="item-score">
            <span class="score-correct">{{ record.correct }}</span>
            <span class="score-separator">/</span>
            <span class="score-total">{{ record.total }}</span>
          </div>
          <div
            class="item-accuracy"
            :class="getAccuracyClass(record.accuracy)"
          >
            {{ record.accuracy }}%
          </div>
        </div>
        <div class="item-right">
          <div class="item-time">
            {{ formatTotalTime(record.totalTime) }}
          </div>
          <div class="item-date">
            {{ formatDate(record.timestamp) }}
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div
      v-if="totalPages > 1"
      class="pagination"
    >
      <button
        class="btn btn-sm"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        上一页
      </button>
      <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
      <button
        class="btn btn-sm"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        下一页
      </button>
    </div>

    <!-- 详情弹窗 -->
    <div
      v-if="selectedRecord"
      class="modal-overlay"
      @click="selectedRecord = null"
    >
      <div
        class="modal"
        @click.stop
      >
        <div class="modal-header">
          <span>训练详情</span>
          <button
            class="btn btn-sm"
            @click="selectedRecord = null"
          >
            ×
          </button>
        </div>
        <div class="modal-body">
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">模式</span>
              <span class="detail-value">{{ modeLabels[selectedRecord.mode] }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">语言</span>
              <span class="detail-value">{{ selectedRecord.language }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">模块</span>
              <span class="detail-value">{{ moduleLabels[selectedRecord.module] || selectedRecord.module }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">正确率</span>
              <span
                class="detail-value"
                :class="getAccuracyClass(selectedRecord.accuracy)"
              >{{ selectedRecord.accuracy }}%</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">正确/总数</span>
              <span class="detail-value">{{ selectedRecord.correct }}/{{ selectedRecord.total }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">总用时</span>
              <span class="detail-value">{{ formatTotalTime(selectedRecord.totalTime) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">平均用时</span>
              <span class="detail-value">{{ selectedRecord.avgTime }}s</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">时间</span>
              <span class="detail-value">{{ formatDate(selectedRecord.timestamp) }}</span>
            </div>
          </div>
          <div
            v-if="selectedRecord.questions?.length > 0"
            class="detail-questions"
          >
            <div class="questions-title">
              逐题详情
            </div>
            <div class="questions-list">
              <div
                v-for="(q, j) in selectedRecord.questions"
                :key="j"
                class="question-item"
                :class="{ correct: q.correct, incorrect: !q.correct }"
              >
                <span class="q-num">{{ j + 1 }}</span>
                <span class="q-status">{{ q.correct ? '✓' : '✗' }}</span>
                <span
                  v-if="q.timeSpent"
                  class="q-time"
                >{{ q.timeSpent.toFixed(1) }}s</span>
                <span
                  v-if="q.speedRating"
                  class="q-rating"
                >{{ q.speedRating }}</span>
              </div>
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
import { getHistory } from "@/lib/recordManager";
import TrendChart from "@/components/TrendChart.vue";

const router = useRouter();

const modeLabels = {
  copy: "代码临摹",
  fill: "代码填空",
  debug: "改错练习",
  reflex: "限时速写",
  arena: "竞技场",
};

const moduleLabels = {
  loop: "循环",
  condition: "条件",
  array: "数组",
  string: "字符串",
  function: "函数",
};

const history = ref([]);
const filterMode = ref("");
const filterLang = ref("");
const currentPage = ref(1);
const pageSize = 20;
const selectedRecord = ref(null);

const filteredHistory = computed(() => {
  let result = history.value;
  if (filterMode.value) {
    result = result.filter((r) => r.mode === filterMode.value);
  }
  if (filterLang.value) {
    result = result.filter((r) => r.language === filterLang.value);
  }
  return result;
});

const totalPages = computed(() => Math.ceil(filteredHistory.value.length / pageSize));

const paginatedHistory = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredHistory.value.slice(start, start + pageSize);
});

const totalQuestions = computed(() => {
  return filteredHistory.value.reduce((sum, r) => sum + (r.total || 0), 0);
});

const overallAccuracy = computed(() => {
  const total = totalQuestions.value;
  if (total === 0) {return 0;}
  const correct = filteredHistory.value.reduce((sum, r) => sum + (r.correct || 0), 0);
  return Math.round((correct / total) * 100);
});

const avgTime = computed(() => {
  const records = filteredHistory.value.filter((r) => r.avgTime);
  if (records.length === 0) {return "0.0";}
  const sum = records.reduce((s, r) => s + parseFloat(r.avgTime || 0), 0);
  return (sum / records.length).toFixed(1);
});

// 趋势数据
const accuracyTrend = computed(() => {
  const days = ["日", "一", "二", "三", "四", "五", "六"];
  const today = new Date();
  const result = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const records = history.value.filter((r) => r.timestamp?.startsWith(dateStr));
    const total = records.reduce((sum, r) => sum + (r.total || 0), 0);
    const correct = records.reduce((sum, r) => sum + (r.correct || 0), 0);
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    result.push({
      label: days[d.getDay()],
      value: accuracy,
      highlight: i === 0,
    });
  }

  return result;
});

const volumeTrend = computed(() => {
  const days = ["日", "一", "二", "三", "四", "五", "六"];
  const today = new Date();
  const result = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const records = history.value.filter((r) => r.timestamp?.startsWith(dateStr));
    const total = records.reduce((sum, r) => sum + (r.total || 0), 0);

    result.push({
      label: days[d.getDay()],
      value: total,
      highlight: i === 0,
    });
  }

  return result;
});

function getAccuracyClass(accuracy) {
  if (accuracy >= 90) {return "high";}
  if (accuracy >= 70) {return "medium";}
  return "low";
}

function formatTotalTime(seconds) {
  if (!seconds) {return "0s";}
  if (seconds < 60) {return `${Math.round(seconds)}s`;}
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}m${s}s`;
}

function formatDate(timestamp) {
  if (!timestamp) {return "";}
  const d = new Date(timestamp);
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${d.getMinutes().toString().padStart(2, "0")}`;
}

function showDetail(record) {
  selectedRecord.value = record;
}

function goHome() {
  router.push("/");
}

onMounted(() => {
  history.value = getHistory(500);
});
</script>

<style scoped>
.history-layout {
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

.filter-select {
  width: auto;
  min-width: 100px;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.overview-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  text-align: center;
}

.overview-value {
  font-size: var(--text-xl);
  font-weight: 700;
  font-family: var(--mono);
  color: var(--accent-10);
}

.overview-label {
  font-size: var(--text-xs);
  color: var(--text-400);
  margin-top: var(--space-1);
}

.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
  margin-bottom: var(--space-5);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.empty-state {
  text-align: center;
  padding: var(--space-10);
  color: var(--text-400);
}

.history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 150ms ease;
}

.history-item:hover {
  border-color: var(--accent-10);
  box-shadow: var(--shadow-sm);
}

.item-left {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.item-mode {
  padding: var(--space-1) var(--space-2);
  font-size: var(--text-xs);
  font-weight: 600;
  border-radius: var(--radius-sm);
  background: var(--border-light);
  color: var(--text-500);
}

.item-mode.copy { background: rgba(37, 99, 235, 0.1); color: var(--accent-10); }
.item-mode.fill { background: rgba(5, 150, 105, 0.1); color: var(--correct); }
.item-mode.debug { background: rgba(220, 38, 38, 0.1); color: var(--incorrect); }
.item-mode.reflex { background: rgba(217, 119, 6, 0.1); color: var(--warning); }
.item-mode.arena { background: rgba(139, 92, 246, 0.1); color: #8B5CF6; }

.item-info {
  display: flex;
  gap: var(--space-2);
  font-size: var(--text-xs);
  color: var(--text-400);
}

.item-center {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.item-score {
  font-family: var(--mono);
  font-size: var(--text-sm);
}

.score-correct {
  color: var(--correct);
  font-weight: 600;
}

.score-separator {
  color: var(--text-400);
}

.score-total {
  color: var(--text-500);
}

.item-accuracy {
  font-family: var(--mono);
  font-weight: 600;
  font-size: var(--text-sm);
}

.item-accuracy.high { color: var(--correct); }
.item-accuracy.medium { color: var(--warning); }
.item-accuracy.low { color: var(--incorrect); }

.item-right {
  text-align: right;
}

.item-time {
  font-family: var(--mono);
  font-size: var(--text-sm);
  color: var(--text-700);
}

.item-date {
  font-size: var(--text-xs);
  color: var(--text-400);
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
}

.page-info {
  font-size: var(--text-sm);
  font-family: var(--mono);
  color: var(--text-500);
}

.btn-sm {
  padding: var(--space-1) var(--space-3);
  font-size: var(--text-xs);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  width: 500px;
  max-width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4);
  border-bottom: 1px solid var(--border);
  font-weight: 600;
}

.modal-body {
  padding: var(--space-4);
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: var(--space-2) 0;
  border-bottom: 1px solid var(--border-light);
}

.detail-label {
  font-size: var(--text-xs);
  color: var(--text-400);
}

.detail-value {
  font-size: var(--text-sm);
  font-weight: 600;
}

.detail-value.high { color: var(--correct); }
.detail-value.medium { color: var(--warning); }
.detail-value.low { color: var(--incorrect); }

.questions-title {
  font-size: var(--text-sm);
  font-weight: 600;
  margin-bottom: var(--space-3);
  padding-top: var(--space-3);
  border-top: 1px solid var(--border);
}

.questions-list {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--space-2);
}

.question-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
}

.question-item.correct {
  background: var(--correct-bg);
  border-color: var(--correct);
}

.question-item.incorrect {
  background: var(--incorrect-bg);
  border-color: var(--incorrect);
}

.q-num {
  color: var(--text-400);
}

.q-status {
  font-size: var(--text-base);
  font-weight: 700;
}

.correct .q-status { color: var(--correct); }
.incorrect .q-status { color: var(--incorrect); }

.q-time {
  font-family: var(--mono);
  color: var(--text-400);
}

.q-rating {
  font-weight: 600;
  color: var(--accent-10);
}

/* 移动端响应式 */
@media (max-width: 768px) {
  .history-layout {
    padding: var(--space-4);
  }

  .page-header {
    flex-direction: column;
    gap: var(--space-3);
    align-items: flex-start;
  }

  .header-actions {
    flex-wrap: wrap;
    width: 100%;
  }

  .filter-select {
    flex: 1;
    min-width: 80px;
  }

  .overview-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-3);
  }

  .overview-card {
    padding: var(--space-3);
  }

  .overview-value {
    font-size: var(--text-lg);
  }

  .charts-row {
    grid-template-columns: 1fr;
  }

  .history-item {
    flex-wrap: wrap;
    gap: var(--space-2);
    padding: var(--space-3);
  }

  .item-left {
    width: 100%;
  }

  .item-center {
    width: 100%;
    justify-content: space-between;
  }

  .item-right {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .modal {
    width: 95%;
    max-height: 90vh;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .questions-list {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
