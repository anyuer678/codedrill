<template>
  <div class="trend-chart">
    <div class="chart-header">
      <span class="chart-title">{{ title }}</span>
      <span class="chart-period">{{ period }}</span>
    </div>
    <div class="chart-body">
      <div class="chart-area">
        <div class="y-axis">
          <span
            v-for="tick in yTicks"
            :key="tick"
            class="y-tick"
          >{{ tick }}</span>
        </div>
        <div class="chart-bars">
          <div
            v-for="(item, i) in data"
            :key="i"
            class="bar-col"
          >
            <div class="bar-wrapper">
              <div
                class="bar"
                :style="{ height: getBarHeight(item.value) + '%' }"
                :class="{ highlight: item.highlight }"
              >
                <span
                  v-if="showValues"
                  class="bar-value"
                >{{ item.value }}{{ suffix }}</span>
              </div>
            </div>
            <span class="bar-label">{{ item.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  title: { type: String, default: "" },
  period: { type: String, default: "" },
  data: { type: Array, default: () => [] },
  suffix: { type: String, default: "" },
  showValues: { type: Boolean, default: true },
  max: { type: Number, default: 0 },
});

const maxValue = computed(() => {
  if (props.max > 0) {return props.max;}
  return Math.max(...props.data.map((d) => d.value), 1);
});

const yTicks = computed(() => {
  const ticks = [];
  const step = Math.ceil(maxValue.value / 4);
  for (let i = 0; i <= 4; i++) {
    ticks.push(step * i);
  }
  return ticks.reverse();
});

function getBarHeight(value) {
  return Math.round((value / maxValue.value) * 100);
}
</script>

<style scoped>
.trend-chart {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.chart-title {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-700);
}

.chart-period {
  font-size: var(--text-xs);
  color: var(--text-400);
}

.chart-body {
  height: 200px;
}

.chart-area {
  display: flex;
  height: 100%;
  gap: var(--space-2);
}

.y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 40px;
  flex-shrink: 0;
}

.y-tick {
  font-size: 10px;
  color: var(--text-400);
  font-family: var(--mono);
  text-align: right;
}

.chart-bars {
  flex: 1;
  display: flex;
  align-items: flex-end;
  gap: var(--space-1);
}

.bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.bar-wrapper {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
}

.bar {
  width: 100%;
  background: var(--accent-10);
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  transition: height 300ms ease;
  min-height: 2px;
  position: relative;
}

.bar.highlight {
  background: var(--correct);
}

.bar-value {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  font-family: var(--mono);
  color: var(--text-500);
  white-space: nowrap;
}

.bar-label {
  font-size: 10px;
  color: var(--text-400);
  margin-top: var(--space-1);
}
</style>
