<template>
  <div class="summary-layout">
    <div class="page-header">
      <h1 class="page-title">
        训练完成
      </h1>
      <button
        class="btn"
        @click="goHome"
      >
        返回首页
      </button>
    </div>

    <!-- 成就解锁提示 -->
    <div
      v-if="newAchievements.length > 0"
      class="achievement-notice"
    >
      <div class="notice-icon">
        🏆
      </div>
      <div class="notice-content">
        <div class="notice-title">
          解锁新成就！
        </div>
        <div class="notice-list">
          <span
            v-for="a in newAchievements"
            :key="a.id"
            class="achievement-tag"
          >
            {{ a.icon }} {{ a.name }}
          </span>
        </div>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">
          {{ summary.accuracy }}%
        </div>
        <div class="stat-label">
          正确率
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-value">
          {{ summary.correct }}/{{ summary.total }}
        </div>
        <div class="stat-label">
          正确/总数
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-value">
          {{ summary.totalTime }}
        </div>
        <div class="stat-label">
          总用时
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-value">
          {{ summary.avgTime }}s
        </div>
        <div class="stat-label">
          平均用时
        </div>
      </div>
    </div>

    <div class="table-card">
      <div class="table-header">
        答题详情
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>题号</th>
            <th>结果</th>
            <th>用时</th>
            <th>速度</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(r, i) in summary.results"
            :key="i"
          >
            <td class="cell-mono">
              {{ i + 1 }}
            </td>
            <td :class="r.correct ? 'cell-ok' : 'cell-fail'">
              {{ r.correct ? '✓ 正确' : '✗ 错误' }}
            </td>
            <td class="cell-mono">
              {{ r.timeSpent?.toFixed(1) }}s
            </td>
            <td class="cell-mono">
              {{ r.speedRating }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="actions">
      <button
        class="btn btn-primary"
        @click="retry"
      >
        再来一次
      </button>
      <button
        class="btn"
        @click="goHome"
      >
        返回首页
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useTrainingStore } from "@/stores/training";
import { useAchievementStore } from "@/stores/achievement";

const router = useRouter();
const trainingStore = useTrainingStore();
const achievementStore = useAchievementStore();
const summary = computed(() => trainingStore.getSessionSummary());
const newAchievements = computed(() => achievementStore.newAchievements);

function retry() {
  trainingStore.startSession({
    mode: trainingStore.mode,
    language: trainingStore.language,
    module: trainingStore.module,
    count: trainingStore.questions.length,
  });
  router.push(`/train/${trainingStore.mode}`);
}

function goHome() {
  trainingStore.reset();
  router.push("/");
}
</script>

<style scoped>
.summary-layout {
  max-width: 720px;
  margin: 0 auto;
  padding: var(--space-8);
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
  color: var(--text-900);
  letter-spacing: -0.02em;
}

/* 成就解锁提示 */
.achievement-notice {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background: rgba(217, 119, 6, 0.1);
  border: 1px solid var(--warning);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-6);
}

.notice-icon {
  font-size: 32px;
}

.notice-title {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--warning);
  margin-bottom: var(--space-2);
}

.notice-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.achievement-tag {
  padding: var(--space-1) var(--space-2);
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  text-align: center;
  box-shadow: var(--shadow-sm);
}

.stat-value {
  font-size: var(--text-xl);
  font-weight: 700;
  font-family: var(--mono);
  color: var(--accent-10);
}

.stat-label {
  font-size: var(--text-xs);
  color: var(--text-400);
  margin-top: var(--space-1);
}

.table-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: var(--space-6);
  box-shadow: var(--shadow-sm);
}

.table-header {
  padding: var(--space-4);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-900);
  border-bottom: 1px solid var(--border);
  background: var(--border-light);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: var(--space-3) var(--space-4);
  text-align: left;
  border-bottom: 1px solid var(--border-light);
  font-size: var(--text-sm);
}

.data-table th {
  font-weight: 500;
  color: var(--text-400);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.cell-mono {
  font-family: var(--mono);
  font-weight: 500;
}

.cell-ok {
  color: var(--correct);
  font-weight: 600;
}

.cell-fail {
  color: var(--incorrect);
  font-weight: 600;
}

.actions {
  display: flex;
  gap: var(--space-3);
  justify-content: center;
}

/* 移动端响应式 */
@media (max-width: 768px) {
  .summary-layout {
    padding: var(--space-4);
  }

  .overview-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-3);
  }

  .overview-card {
    padding: var(--space-3);
  }

  .table-card {
    overflow-x: auto;
  }

  .data-table th,
  .data-table td {
    padding: var(--space-2) var(--space-3);
    font-size: var(--text-xs);
    white-space: nowrap;
  }

  .actions {
    flex-wrap: wrap;
  }
}
</style>
