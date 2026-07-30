<template>
  <div class="stats-layout">
    <div class="page-header">
      <h1 class="page-title">
        训练统计
      </h1>
      <div class="header-actions">
        <button class="btn btn-sm" @click="goHome">
          返回首页
        </button>
      </div>
    </div>

    <!-- 概览 -->
    <div class="overview-grid">
      <div class="overview-card">
        <div class="overview-value">
          {{ stats.totalSessions }}
        </div>
        <div class="overview-label">
          训练次数
        </div>
      </div>
      <div class="overview-card">
        <div class="overview-value">
          {{ stats.totalQuestions }}
        </div>
        <div class="overview-label">
          答题总数
        </div>
      </div>
      <div class="overview-card">
        <div class="overview-value">
          {{ stats.accuracy }}%
        </div>
        <div class="overview-label">
          正确率
        </div>
      </div>
      <div class="overview-card">
        <div class="overview-value">
          {{ stats.avgTimePerQuestion }}s
        </div>
        <div class="overview-label">
          平均用时
        </div>
      </div>
    </div>

    <!-- 图表区 -->
    <div class="charts-row">
      <div class="chart-card">
        <h3 class="card-title">
          按模式统计
        </h3>
        <div class="bar-chart">
          <div
            v-for="(data, mode) in modeStats"
            :key="mode"
            class="bar-row"
          >
            <span class="bar-label">{{ modeLabels[mode] || mode }}</span>
            <div class="bar-track">
              <div
                class="bar-fill"
                :style="{ width: getModePercent(data) + '%' }"
              />
            </div>
            <span class="bar-value">{{ data.questions }}</span>
          </div>
        </div>
      </div>
      <div class="chart-card">
        <h3 class="card-title">
          正确率趋势（近7天）
        </h3>
        <div class="trend-chart">
          <div
            v-for="(item, i) in trendData"
            :key="i"
            class="trend-bar-wrapper"
          >
            <div
              class="trend-bar"
              :style="{ height: item.accuracy + '%' }"
            >
              <span class="trend-value">{{ item.accuracy }}%</span>
            </div>
            <span class="trend-label">{{ item.date }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 热力图和雷达图 -->
    <div class="charts-row">
      <HeatmapChart
        title="训练热力图"
        :days="28"
        :data="heatmapData"
      />
      <RadarChart
        title="能力雷达图"
        :data="radarData"
      />
    </div>

    <!-- 记录表格 -->
    <div class="table-card">
      <h3 class="card-title">
        最近记录
      </h3>
      <table
        v-if="recentHistory.length > 0"
        class="data-table"
      >
        <thead>
          <tr>
            <th>时间</th>
            <th>模式</th>
            <th>语言</th>
            <th>模块</th>
            <th>正确率</th>
            <th>用时</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(r, i) in recentHistory"
            :key="i"
          >
            <td>{{ formatTime(r.timestamp) }}</td>
            <td>{{ modeLabels[r.mode] || r.mode }}</td>
            <td>{{ r.language }}</td>
            <td>{{ moduleLabels[r.module] || r.module }}</td>
            <td :class="r.accuracy >= 70 ? 'ok' : 'fail'">
              {{ r.accuracy }}%
            </td>
            <td>{{ r.totalTime?.toFixed(0) }}s</td>
          </tr>
        </tbody>
      </table>
      <div
        v-else
        class="empty"
      >
        暂无训练记录
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { getOverviewStats, getModeStats, getHistory } from "@/lib/recordManager";
import HeatmapChart from "@/components/HeatmapChart.vue";
import RadarChart from "@/components/RadarChart.vue";

const router = useRouter();
const modeLabels = { copy: "临摹", fill: "填空", debug: "改错", reflex: "速写", arena: "竞技", daily: "每日" };
const moduleLabels = { loop: "循环", condition: "条件", array: "数组", string: "字符串", function: "函数" };

function goHome() {
  router.push("/");
}

const stats = computed(() => getOverviewStats());
const modeStats = computed(() => getModeStats());
const recentHistory = computed(() => getHistory(20));

const trendData = computed(() => {
  const history = getHistory(1000);
  const result = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().split("T")[0];
    const recs = history.filter((r) => r.timestamp?.startsWith(ds));
    const t = recs.reduce((s, r) => s + (r.total || 0), 0);
    const c = recs.reduce((s, r) => s + (r.correct || 0), 0);
    result.push({
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      accuracy: t > 0 ? Math.round((c / t) * 100) : 0,
    });
  }
  return result;
});

// 热力图数据
const heatmapData = computed(() => {
  const history = getHistory(1000);
  const dayMap = {};

  for (const r of history) {
    const date = r.timestamp?.split("T")[0];
    if (date) {
      dayMap[date] = (dayMap[date] || 0) + (r.total || 0);
    }
  }

  return Object.entries(dayMap).map(([date, value]) => ({ date, value }));
});

// 雷达图数据
const radarData = computed(() => {
  const modeStatsVal = modeStats.value;
  return [
    { label: "临摹", value: modeStatsVal.copy?.questions || 0, max: 100 },
    { label: "填空", value: modeStatsVal.fill?.questions || 0, max: 100 },
    { label: "改错", value: modeStatsVal.debug?.questions || 0, max: 100 },
    { label: "速写", value: modeStatsVal.reflex?.questions || 0, max: 100 },
    { label: "竞技", value: modeStatsVal.arena?.questions || 0, max: 100 },
  ];
});

function getModePercent(data) {
  const max = Math.max(...Object.values(modeStats.value).map((d) => d.questions), 1);
  return Math.round((data.questions / max) * 100);
}

function formatTime(ts) {
  if (!ts) {return "";}
  const d = new Date(ts);
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
}
</script>

<style scoped>
.stats-layout {
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  overflow-y: auto;
  height: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: var(--text-xl);
  font-weight: 700;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
}

.overview-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  text-align: center;
}

.overview-value {
  font-size: var(--text-2xl);
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
  gap: var(--space-5);
}

.chart-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
}

.card-title {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-700);
  margin-bottom: var(--space-4);
}

.bar-chart {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.bar-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.bar-label {
  width: 60px;
  font-size: var(--text-xs);
  color: var(--text-500);
}

.bar-track {
  flex: 1;
  height: 16px;
  background: var(--border-light);
  border-radius: 8px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: var(--accent-10);
  border-radius: 8px;
  transition: width 300ms ease;
}

.bar-value {
  width: 40px;
  text-align: right;
  font-size: var(--text-xs);
  font-family: var(--mono);
  font-weight: 600;
}

.trend-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 120px;
  gap: var(--space-2);
}

.trend-bar-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.trend-bar {
  flex: 1;
  width: 100%;
  background: var(--accent-10);
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-height: 2px;
}

.trend-value {
  font-size: 10px;
  font-family: var(--mono);
  color: white;
  padding-top: 2px;
}

.trend-label {
  font-size: 10px;
  color: var(--text-400);
  margin-top: 4px;
}

.table-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
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
  background: var(--border-light);
}

.ok { color: var(--correct); font-weight: 600; }
.fail { color: var(--incorrect); font-weight: 600; }

.empty {
  padding: var(--space-10);
  text-align: center;
  color: var(--text-400);
}

/* 移动端响应式 */
@media (max-width: 768px) {
  .stats-layout {
    padding: var(--space-4);
  }

  .overview-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-3);
  }

  .overview-card {
    padding: var(--space-3);
  }

  .overview-value {
    font-size: var(--text-xl);
  }

  .charts-row {
    grid-template-columns: 1fr;
  }

  .chart-card {
    padding: var(--space-4);
  }

  .trend-chart {
    height: 100px;
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
}
</style>
