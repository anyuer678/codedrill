<template>
  <div class="plan-layout">
    <div class="page-header">
      <h1 class="page-title">
        训练计划
      </h1>
      <button
        class="btn"
        @click="goHome"
      >
        返回首页
      </button>
    </div>

    <!-- 当前计划 -->
    <div
      v-if="currentPlan"
      class="current-plan"
    >
      <div class="plan-header">
        <h2 class="plan-name">
          {{ currentPlan.plan.name }}
        </h2>
        <button
          class="btn btn-sm btn-danger"
          @click="confirmCancel"
        >
          取消计划
        </button>
      </div>

      <div class="plan-overview">
        <div class="overview-item">
          <div class="overview-value">
            {{ currentPlan.completedDays }}/{{ currentPlan.totalDays }}
          </div>
          <div class="overview-label">
            完成天数
          </div>
        </div>
        <div class="overview-item">
          <div class="overview-value">
            {{ currentPlan.totalQuestions }}
          </div>
          <div class="overview-label">
            总答题数
          </div>
        </div>
        <div class="overview-item">
          <div class="overview-value">
            {{ currentPlan.currentAccuracy }}%
          </div>
          <div class="overview-label">
            正确率
          </div>
        </div>
        <div class="overview-item">
          <div class="overview-value">
            {{ currentPlan.progress }}%
          </div>
          <div class="overview-label">
            总进度
          </div>
        </div>
      </div>

      <!-- 今日进度 -->
      <div class="today-section">
        <h3 class="section-title">
          今日进度
        </h3>
        <div class="today-bar">
          <div
            class="today-fill"
            :style="{ width: currentPlan.todayProgress.percentage + '%' }"
          />
        </div>
        <div class="today-text">
          {{ currentPlan.todayProgress.completed }} / {{ currentPlan.todayProgress.goal }} 题
          <span
            v-if="currentPlan.todayProgress.percentage >= 100"
            class="today-done"
          >✓ 已完成</span>
        </div>
      </div>

      <!-- 总进度 -->
      <div class="progress-section">
        <h3 class="section-title">
          计划进度
        </h3>
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: currentPlan.progress + '%' }"
          />
        </div>
        <div class="progress-text">
          已坚持 {{ currentPlan.daysPassed }} 天，还需 {{ currentPlan.totalDays - currentPlan.daysPassed }} 天
        </div>
      </div>

      <!-- 每日记录 -->
      <div class="daily-section">
        <h3 class="section-title">
          每日记录
        </h3>
        <div class="daily-grid">
          <div
            v-for="day in dailyLogDisplay"
            :key="day.date"
            class="daily-item"
            :class="{ completed: day.completed, today: day.isToday }"
          >
            <div class="daily-date">
              {{ day.label }}
            </div>
            <div class="daily-questions">
              {{ day.questions }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 选择计划 -->
    <div
      v-else
      class="select-plan"
    >
      <h2 class="select-title">
        选择训练计划
      </h2>
      <p class="select-desc">
        设定目标，坚持训练，提升编程能力
      </p>

      <div class="plan-grid">
        <div
          v-for="plan in availablePlans"
          :key="plan.id"
          class="plan-card"
          @click="selectPlan(plan.id)"
        >
          <div class="card-icon">
            {{ getPlanIcon(plan.id) }}
          </div>
          <div class="card-name">
            {{ plan.name }}
          </div>
          <div class="card-desc">
            {{ plan.desc }}
          </div>
          <div class="card-details">
            <span>{{ plan.dailyGoal }}题/天</span>
            <span>{{ plan.duration }}天</span>
            <span>目标{{ plan.targetAccuracy }}%</span>
          </div>
        </div>
      </div>

      <!-- 历史记录 -->
      <div
        v-if="history.completed.length > 0 || history.abandoned.length > 0"
        class="history-section"
      >
        <h3 class="section-title">
          计划历史
        </h3>
        <div class="history-list">
          <div
            v-for="plan in history.completed"
            :key="plan.startDate"
            class="history-item completed"
          >
            <span class="history-name">{{ plan.name }}</span>
            <span class="history-progress">{{ plan.progress }}%</span>
            <span class="history-status">已完成</span>
          </div>
          <div
            v-for="plan in history.abandoned"
            :key="plan.startDate"
            class="history-item abandoned"
          >
            <span class="history-name">{{ plan.name }}</span>
            <span class="history-progress">-</span>
            <span class="history-status">已放弃</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 确认弹窗 -->
    <div
      v-if="showConfirm"
      class="modal-overlay"
      @click="showConfirm = false"
    >
      <div
        class="modal"
        @click.stop
      >
        <div class="modal-header">
          确认操作
        </div>
        <div class="modal-body">
          确定要取消当前计划吗？
        </div>
        <div class="modal-actions">
          <button
            class="btn"
            @click="showConfirm = false"
          >
            取消
          </button>
          <button
            class="btn btn-danger"
            @click="doCancelPlan"
          >
            确认
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  startPlan,
  getPlanProgress,
  cancelPlan,
  getPlanHistory,
  getAvailablePlans,
} from "@/lib/planService";

const router = useRouter();
const currentPlan = ref(null);
const history = ref({ completed: [], abandoned: [] });
const availablePlans = ref([]);
const showConfirm = ref(false);

const planIcons = {
  beginner: "🌱",
  intermediate: "🔥",
  advanced: "💎",
};

const dailyLogDisplay = computed(() => {
  if (!currentPlan.value) {return [];}

  const plan = currentPlan.value.plan;
  const dailyLog = plan.dailyLog || {};
  const startDate = new Date(plan.startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = [];
  for (let i = 0; i < plan.duration; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];
    const isToday = date.getTime() === today.getTime();
    const isPast = date < today;
    const log = dailyLog[dateStr];

    days.push({
      date: dateStr,
      label: `${date.getMonth() + 1}/${date.getDate()}`,
      questions: log ? log.questions : 0,
      completed: log ? log.questions >= plan.dailyGoal : false,
      isToday: isToday,
      isPast: isPast,
    });
  }

  return days;
});

function getPlanIcon(id) {
  return planIcons[id] || "📋";
}

function selectPlan(planId) {
  startPlan(planId);
  loadPlan();
}

function confirmCancel() {
  showConfirm.value = true;
}

function doCancelPlan() {
  showConfirm.value = false;
  cancelPlan();
  loadPlan();
}

function goHome() {
  router.push("/");
}

function loadPlan() {
  currentPlan.value = getPlanProgress();
  history.value = getPlanHistory();
  availablePlans.value = getAvailablePlans();
}

onMounted(() => {
  loadPlan();
});
</script>

<style scoped>
.plan-layout {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-6);
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

.current-plan {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.plan-name {
  font-size: var(--text-lg);
  font-weight: 600;
}

.plan-overview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
}

.overview-item {
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

.today-section,
.progress-section,
.daily-section {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
}

.section-title {
  font-size: var(--text-sm);
  font-weight: 600;
  margin-bottom: var(--space-3);
}

.today-bar,
.progress-bar {
  height: 12px;
  background: var(--border-light);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: var(--space-2);
}

.today-fill,
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-10), #60a5fa);
  border-radius: 6px;
  transition: width 300ms ease;
}

.today-text,
.progress-text {
  font-size: var(--text-xs);
  color: var(--text-400);
  text-align: center;
}

.today-done {
  color: var(--correct);
  font-weight: 600;
}

.daily-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--space-2);
}

.daily-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
}

.daily-item.completed {
  background: var(--correct-bg);
  border-color: var(--correct);
}

.daily-item.today {
  border-color: var(--accent-10);
  border-width: 2px;
}

.daily-date {
  color: var(--text-400);
}

.daily-questions {
  font-family: var(--mono);
  font-weight: 600;
}

.select-plan {
  text-align: center;
}

.select-title {
  font-size: var(--text-lg);
  font-weight: 600;
  margin-bottom: var(--space-2);
}

.select-desc {
  font-size: var(--text-sm);
  color: var(--text-400);
  margin-bottom: var(--space-6);
}

.plan-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.plan-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  cursor: pointer;
  transition: all 200ms ease;
  text-align: center;
}

.plan-card:hover {
  border-color: var(--accent-10);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.card-icon {
  font-size: 48px;
  margin-bottom: var(--space-3);
}

.card-name {
  font-size: var(--text-base);
  font-weight: 600;
  margin-bottom: var(--space-2);
}

.card-desc {
  font-size: var(--text-sm);
  color: var(--text-500);
  margin-bottom: var(--space-3);
}

.card-details {
  display: flex;
  justify-content: center;
  gap: var(--space-3);
  font-size: var(--text-xs);
  color: var(--text-400);
}

.history-section {
  margin-top: var(--space-6);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3);
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}

.history-item.completed {
  border-color: var(--correct);
}

.history-item.abandoned {
  opacity: 0.6;
}

.history-name {
  font-size: var(--text-sm);
  font-weight: 500;
}

.history-progress {
  font-size: var(--text-sm);
  font-family: var(--mono);
}

.history-status {
  font-size: var(--text-xs);
  color: var(--text-400);
}

.history-item.completed .history-status {
  color: var(--correct);
}

.btn-sm {
  padding: var(--space-1) var(--space-3);
  font-size: var(--text-xs);
}

.btn-danger {
  background: var(--incorrect);
  border-color: var(--incorrect);
  color: white;
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
  padding: var(--space-6);
  width: 400px;
  max-width: 90%;
}

.modal-header {
  font-size: var(--text-lg);
  font-weight: 600;
  margin-bottom: var(--space-4);
}

.modal-body {
  font-size: var(--text-sm);
  color: var(--text-500);
  margin-bottom: var(--space-6);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
}

/* 移动端响应式 */
@media (max-width: 768px) {
  .plan-layout {
    padding: var(--space-4);
  }

  .plan-grid {
    grid-template-columns: 1fr;
    gap: var(--space-3);
  }

  .plan-card {
    padding: var(--space-4);
  }

  .card-icon {
    font-size: 36px;
  }

  .card-details {
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  .detail-item {
    font-size: 11px;
  }

  .modal {
    width: 90%;
    padding: var(--space-4);
  }
}
</style>
