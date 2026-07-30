<template>
  <div class="chart-container">
    <div class="chart-header">
      <span class="chart-title">{{ title }}</span>
    </div>
    <div class="chart-body">
      <div class="bar-chart">
        <div
          v-for="(item, index) in data"
          :key="index"
          class="bar-item"
        >
          <div class="bar-label">
            {{ item.label }}
          </div>
          <div class="bar-track">
            <div
              class="bar-fill"
              :style="{ width: getPercent(item.value) + '%' }"
            />
          </div>
          <div class="bar-value">
            {{ item.value }}
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
  data: { type: Array, default: () => [] },
  maxValue: { type: Number, default: 0 },
});

const max = computed(() => {
  if (props.maxValue > 0) {return props.maxValue;}
  return Math.max(...props.data.map((d) => d.value), 1);
});

function getPercent(value) {
  return Math.round((value / max.value) * 100);
}
</script>

<style scoped>
.chart-container {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.chart-header {
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border);
}

.chart-title {
  font-size: var(--text-sm);
  font-weight: 600;
}

.chart-body {
  padding: var(--space-4);
}

.bar-chart {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.bar-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.bar-label {
  width: 80px;
  font-size: var(--text-xs);
  color: var(--text-500);
  flex-shrink: 0;
}

.bar-track {
  flex: 1;
  height: 20px;
  background: var(--border-light);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-10), #60a5fa);
  border-radius: var(--radius-sm);
  transition: width 500ms ease;
  min-width: 2px;
}

.bar-value {
  width: 50px;
  text-align: right;
  font-size: var(--text-xs);
  font-family: var(--mono);
  font-weight: 600;
  color: var(--text-700);
  flex-shrink: 0;
}
</style>
