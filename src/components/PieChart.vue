<template>
  <div class="chart-container">
    <div class="chart-header">
      <span class="chart-title">{{ title }}</span>
    </div>
    <div class="chart-body">
      <div class="pie-chart">
        <svg
          viewBox="0 0 100 100"
          class="pie-svg"
        >
          <circle
            v-for="(seg, i) in segments"
            :key="i"
            cx="50"
            cy="50"
            r="40"
            fill="none"
            :stroke="seg.color"
            stroke-width="20"
            :stroke-dasharray="seg.dash"
            :stroke-dashoffset="seg.offset"
            :transform="`rotate(-90 50 50)`"
          />
        </svg>
        <div class="pie-center">
          <div class="pie-total">
            {{ total }}
          </div>
          <div class="pie-label">
            总计
          </div>
        </div>
      </div>
      <div class="pie-legend">
        <div
          v-for="(item, i) in data"
          :key="i"
          class="legend-item"
        >
          <span
            class="legend-color"
            :style="{ background: item.color }"
          />
          <span class="legend-label">{{ item.label }}</span>
          <span class="legend-value">{{ item.value }}</span>
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
});

const total = computed(() => props.data.reduce((sum, d) => sum + d.value, 0));

const segments = computed(() => {
  const circumference = 2 * Math.PI * 40;
  let offset = 0;

  return props.data.map((item) => {
    const percent = total.value > 0 ? item.value / total.value : 0;
    const dash = `${percent * circumference} ${circumference}`;
    const currentOffset = offset;
    offset -= percent * circumference;

    return {
      color: item.color,
      dash,
      offset: currentOffset,
    };
  });
});
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
  display: flex;
  gap: var(--space-4);
  align-items: center;
}

.pie-chart {
  position: relative;
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.pie-svg {
  width: 100%;
  height: 100%;
}

.pie-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.pie-total {
  font-size: var(--text-lg);
  font-weight: 700;
  font-family: var(--mono);
}

.pie-label {
  font-size: var(--text-xs);
  color: var(--text-400);
}

.pie-legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  flex-shrink: 0;
}

.legend-label {
  flex: 1;
  font-size: var(--text-xs);
  color: var(--text-500);
}

.legend-value {
  font-size: var(--text-xs);
  font-family: var(--mono);
  font-weight: 600;
}
</style>
