<template>
  <div class="report-layout">
    <div class="page-header">
      <h1 class="page-title">
        训练报告
      </h1>
      <div class="header-actions">
        <div class="tab-group">
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'weekly' }"
            @click="activeTab = 'weekly'"
          >
            周报
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'monthly' }"
            @click="activeTab = 'monthly'"
          >
            月报
          </button>
        </div>
        <button
          class="btn"
          @click="goHome"
        >
          返回首页
        </button>
      </div>
    </div>

    <!-- 周报 -->
    <template v-if="activeTab === 'weekly'">
      <div class="report-period">
        {{ weeklyReport.period.start }} 至 {{ weeklyReport.period.end }}
      </div>

      <div class="overview-grid">
        <div class="overview-card">
          <div class="overview-value">
            {{ weeklyReport.stats.totalSessions }}
          </div>
          <div class="overview-label">
            训练次数
          </div>
          <div
            class="overview-trend"
            :class="weeklyReport.trend.direction"
          >
            <span v-if="weeklyReport.trend.direction === 'up'">↑</span>
            <span v-if="weeklyReport.trend.direction === 'down'">↓</span>
            {{ weeklyReport.trend.percentage }}%
          </div>
        </div>
        <div class="overview-card">
          <div class="overview-value">
            {{ weeklyReport.stats.totalQuestions }}
          </div>
          <div class="overview-label">
            答题总数
          </div>
        </div>
        <div class="overview-card">
          <div class="overview-value">
            {{ weeklyReport.stats.accuracy }}%
          </div>
          <div class="overview-label">
            正确率
          </div>
        </div>
        <div class="overview-card">
          <div class="overview-value">
            {{ weeklyReport.stats.avgTime }}s
          </div>
          <div class="overview-label">
            平均用时
          </div>
        </div>
      </div>

      <!-- 每日分布 -->
      <div class="section-card">
        <h3 class="section-title">
          每日训练量
        </h3>
        <div class="daily-chart">
          <div
            v-for="(day, index) in weekDays"
            :key="index"
            class="day-bar"
          >
            <div class="bar-container">
              <div
                class="bar-fill"
                :style="{ height: getBarHeight(day) + '%' }"
              />
            </div>
            <div class="day-label">
              {{ day.label }}
            </div>
            <div class="day-value">
              {{ day.value }}
            </div>
          </div>
        </div>
      </div>

      <!-- 模式分布 -->
      <div class="section-card">
        <h3 class="section-title">
          模式分布
        </h3>
        <div class="mode-list">
          <div
            v-for="(data, mode) in weeklyReport.stats.byMode"
            :key="mode"
            class="mode-item"
          >
            <div class="mode-name">
              {{ modeLabels[mode] || mode }}
            </div>
            <div class="mode-bar">
              <div
                class="mode-fill"
                :style="{ width: getModePercent(data) + '%' }"
              />
            </div>
            <div class="mode-value">
              {{ data.questions }}题
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 月报 -->
    <template v-if="activeTab === 'monthly'">
      <div class="report-period">
        {{ monthlyReport.period.start }} 至 {{ monthlyReport.period.end }}
      </div>

      <div class="overview-grid">
        <div class="overview-card">
          <div class="overview-value">
            {{ monthlyReport.stats.totalSessions }}
          </div>
          <div class="overview-label">
            训练次数
          </div>
          <div
            class="overview-trend"
            :class="monthlyReport.trend.direction"
          >
            <span v-if="monthlyReport.trend.direction === 'up'">↑</span>
            <span v-if="monthlyReport.trend.direction === 'down'">↓</span>
            {{ monthlyReport.trend.percentage }}%
          </div>
        </div>
        <div class="overview-card">
          <div class="overview-value">
            {{ monthlyReport.stats.totalQuestions }}
          </div>
          <div class="overview-label">
            答题总数
          </div>
        </div>
        <div class="overview-card">
          <div class="overview-value">
            {{ monthlyReport.stats.accuracy }}%
          </div>
          <div class="overview-label">
            正确率
          </div>
        </div>
        <div class="overview-card">
          <div class="overview-value">
            {{ formatTotalTime(monthlyReport.stats.totalTime) }}
          </div>
          <div class="overview-label">
            总用时
          </div>
        </div>
      </div>

      <!-- 周分布 -->
      <div class="section-card">
        <h3 class="section-title">
          每周训练量
        </h3>
        <div class="weekly-list">
          <div
            v-for="(data, week) in monthlyReport.weeklyBreakdown"
            :key="week"
            class="weekly-item"
          >
            <div class="week-name">
              {{ week }}
            </div>
            <div class="week-bar">
              <div
                class="week-fill"
                :style="{ width: getWeekPercent(data) + '%' }"
              />
            </div>
            <div class="week-value">
              {{ data.sessions }}次 / {{ data.questions }}题
            </div>
          </div>
        </div>
      </div>

      <!-- 语言分布 -->
      <div class="section-card">
        <h3 class="section-title">
          语言分布
        </h3>
        <div class="lang-grid">
          <div
            v-for="(data, lang) in monthlyReport.stats.byLanguage"
            :key="lang"
            class="lang-card"
          >
            <div class="lang-name">
              {{ lang }}
            </div>
            <div class="lang-stats">
              <span>{{ data.sessions }}次</span>
              <span>{{ data.questions }}题</span>
              <span>{{ getLangAccuracy(data) }}%</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { generateWeeklyReport, generateMonthlyReport } from "@/lib/reportGenerator";

const router = useRouter();
const activeTab = ref("weekly");

const modeLabels = {
  copy: "代码临摹",
  fill: "代码填空",
  debug: "改错练习",
  reflex: "限时速写",
  arena: "竞技场",
  daily: "每日挑战",
};

const weeklyReport = ref({
  period: { start: "", end: "" },
  stats: { totalSessions: 0, totalQuestions: 0, accuracy: 0, avgTime: "0.0", totalTime: 0, byMode: {}, byLanguage: {} },
  previousStats: { totalSessions: 0, accuracy: 0 },
  trend: { direction: "stable", percentage: 0 },
  dailyBreakdown: {},
});

const monthlyReport = ref({
  period: { start: "", end: "" },
  stats: { totalSessions: 0, totalQuestions: 0, accuracy: 0, totalTime: 0, byMode: {}, byLanguage: {} },
  previousStats: { totalSessions: 0, accuracy: 0 },
  trend: { direction: "stable", percentage: 0 },
  weeklyBreakdown: {},
});

const weekDays = computed(() => {
  const days = ["日", "一", "二", "三", "四", "五", "六"];
  const today = new Date();
  const result = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split("T")[0];
    const dayData = weeklyReport.value.dailyBreakdown[dateKey];

    result.push({
      label: days[date.getDay()],
      date: dateKey,
      value: dayData ? dayData.questions : 0,
    });
  }

  return result;
});

function getBarHeight(day) {
  const maxValue = Math.max(...weekDays.value.map((d) => d.value), 1);
  return (day.value / maxValue) * 100;
}

function getModePercent(data) {
  const total = weeklyReport.value.stats.totalQuestions;
  if (total === 0) {return 0;}
  return Math.round((data.questions / total) * 100);
}

function getWeekPercent(data) {
  const maxSessions = Math.max(
    ...Object.values(monthlyReport.value.weeklyBreakdown).map((w) => w.sessions),
    1,
  );
  return Math.round((data.sessions / maxSessions) * 100);
}

function getLangAccuracy(data) {
  if (data.questions === 0) {return 0;}
  return Math.round((data.correct / data.questions) * 100);
}

function formatTotalTime(seconds) {
  if (!seconds) {return "0分钟";}
  if (seconds < 60) {return `${seconds}秒`;}
  if (seconds < 3600) {return `${Math.round(seconds / 60)}分钟`;}
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  return `${hours}小时${minutes}分钟`;
}

function goHome() {
  router.push("/");
}

onMounted(() => {
  weeklyReport.value = generateWeeklyReport();
  monthlyReport.value = generateMonthlyReport();
});
</script>

<style scoped>
.report-layout {
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

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.tab-group {
  display: flex;
  background: var(--border-light);
  border-radius: var(--radius-sm);
  padding: 2px;
}

.tab-btn {
  padding: var(--space-1) var(--space-3);
  font-size: var(--text-xs);
  font-weight: 500;
  font-family: var(--font);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--text-500);
}

.tab-btn.active {
  background: var(--bg-card);
  color: var(--text-900);
  box-shadow: var(--shadow-sm);
}

.report-period {
  font-size: var(--text-sm);
  color: var(--text-400);
  text-align: center;
  margin-bottom: var(--space-4);
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

.overview-trend {
  font-size: var(--text-xs);
  font-weight: 600;
  margin-top: var(--space-1);
}

.overview-trend.up { color: var(--correct); }
.overview-trend.down { color: var(--incorrect); }
.overview-trend.stable { color: var(--text-400); }

.section-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  margin-bottom: var(--space-4);
}

.section-title {
  font-size: var(--text-sm);
  font-weight: 600;
  margin-bottom: var(--space-4);
}

.daily-chart {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 120px;
  gap: var(--space-2);
}

.day-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.bar-container {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
}

.bar-fill {
  width: 100%;
  background: var(--accent-10);
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  min-height: 2px;
  transition: height 300ms ease;
}

.day-label {
  font-size: var(--text-xs);
  color: var(--text-400);
  margin-top: var(--space-1);
}

.day-value {
  font-size: var(--text-xs);
  font-family: var(--mono);
  color: var(--text-500);
}

.mode-list, .weekly-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.mode-item, .weekly-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.mode-name, .week-name {
  width: 80px;
  font-size: var(--text-xs);
  color: var(--text-500);
}

.mode-bar, .week-bar {
  flex: 1;
  height: 8px;
  background: var(--border-light);
  border-radius: 4px;
  overflow: hidden;
}

.mode-fill, .week-fill {
  height: 100%;
  background: var(--accent-10);
  border-radius: 4px;
  transition: width 300ms ease;
}

.mode-value, .week-value {
  width: 80px;
  font-size: var(--text-xs);
  font-family: var(--mono);
  color: var(--text-500);
  text-align: right;
}

.lang-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
}

.lang-card {
  padding: var(--space-3);
  background: var(--border-light);
  border-radius: var(--radius-md);
  text-align: center;
}

.lang-name {
  font-size: var(--text-sm);
  font-weight: 600;
  margin-bottom: var(--space-2);
}

.lang-stats {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: var(--text-xs);
  color: var(--text-500);
  font-family: var(--mono);
}

/* 移动端响应式 */
@media (max-width: 768px) {
  .report-layout {
    padding: var(--space-4);
  }

  .report-grid {
    grid-template-columns: 1fr;
    gap: var(--space-3);
  }

  .report-card {
    padding: var(--space-4);
  }

  .mode-grid {
    grid-template-columns: 1fr;
  }

  .lang-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-2);
  }
}
</style>
