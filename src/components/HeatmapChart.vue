<template>
  <div class="heatmap-panel">
    <div class="panel-header">
      <span class="panel-title">{{ title }}</span>
      <span class="panel-period">近{{ days }}天</span>
    </div>
    <div class="heatmap-grid">
      <div
        v-for="(day, i) in heatmapData"
        :key="i"
        class="heatmap-cell"
        :class="getHeatClass(day.value)"
        :title="`${day.date}: ${day.value}题`"
      >
        <span class="cell-date">{{ day.label }}</span>
      </div>
    </div>
    <div class="heatmap-legend">
      <span class="legend-label">少</span>
      <div class="legend-cell level-0" />
      <div class="legend-cell level-1" />
      <div class="legend-cell level-2" />
      <div class="legend-cell level-3" />
      <div class="legend-cell level-4" />
      <span class="legend-label">多</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  title: { type: String, default: "训练热力图" },
  days: { type: Number, default: 28 },
  data: { type: Array, default: () => [] },
});

const heatmapData = computed(() => {
  const today = new Date();
  const result = [];

  for (let i = props.days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const record = props.data.find((r) => r.date === dateStr);

    result.push({
      date: dateStr,
      label: d.getDate(),
      value: record?.value || 0,
    });
  }

  return result;
});

function getHeatClass(value) {
  if (value === 0) {return "level-0";}
  if (value < 10) {return "level-1";}
  if (value < 20) {return "level-2";}
  if (value < 30) {return "level-3";}
  return "level-4";
}
</script>

<style scoped>
.heatmap-panel {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.panel-title {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-700);
}

.panel-period {
  font-size: var(--text-xs);
  color: var(--text-400);
}

.heatmap-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 3px;
}

.heatmap-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  cursor: default;
  transition: transform 100ms ease;
}

.heatmap-cell:hover {
  transform: scale(1.2);
}

.cell-date {
  font-size: 10px;
  font-weight: 500;
}

.level-0 {
  background: #ebedf0;
  color: #9ca3af;
}

.level-1 {
  background: #9be9a8;
  color: #166534;
}

.level-2 {
  background: #40c463;
  color: white;
}

.level-3 {
  background: #30a14e;
  color: white;
}

.level-4 {
  background: #216e39;
  color: white;
}

.heatmap-legend {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 3px;
  margin-top: var(--space-3);
}

.legend-label {
  font-size: 10px;
  color: var(--text-400);
  margin: 0 var(--space-1);
}

.legend-cell {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}
</style>
