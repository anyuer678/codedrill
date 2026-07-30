<template>
  <div class="radar-panel">
    <div class="panel-header">
      <span class="panel-title">{{ title }}</span>
    </div>
    <div class="radar-container">
      <svg
        :viewBox="`0 0 ${size} ${size}`"
        class="radar-svg"
      >
        <!-- 背景网格 -->
        <polygon
          v-for="(level, i) in levels"
          :key="'bg-' + i"
          :points="getPolygonPoints(level)"
          fill="none"
          stroke="#e5e7eb"
          stroke-width="1"
        />
        <!-- 轴线 -->
        <line
          v-for="(axis, i) in axes"
          :key="'axis-' + i"
          :x1="center"
          :y1="center"
          :x2="axis.x"
          :y2="axis.y"
          stroke="#e5e7eb"
          stroke-width="1"
        />
        <!-- 数据区域 -->
        <polygon
          :points="dataPolygonPoints"
          fill="rgba(37, 99, 235, 0.2)"
          stroke="#2563EB"
          stroke-width="2"
        />
        <!-- 数据点 -->
        <circle
          v-for="(point, i) in dataPoints"
          :key="'point-' + i"
          :cx="point.x"
          :cy="point.y"
          r="4"
          fill="#2563EB"
        />
        <!-- 标签 -->
        <text
          v-for="(axis, i) in axes"
          :key="'label-' + i"
          :x="axis.labelX"
          :y="axis.labelY"
          text-anchor="middle"
          dominant-baseline="middle"
          font-size="11"
          fill="#6b7280"
        >
          {{ data[i]?.label || '' }}
        </text>
      </svg>
      <!-- 数值显示 -->
      <div class="radar-values">
        <div
          v-for="(item, i) in data"
          :key="i"
          class="value-item"
        >
          <span class="value-label">{{ item.label }}</span>
          <span class="value-num">{{ item.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  title: { type: String, default: "能力雷达图" },
  data: {
    type: Array,
    default: () => [],
    // [{ label: "循环", value: 80, max: 100 }]
  },
  size: { type: Number, default: 200 },
});

const center = computed(() => props.size / 2);
const radius = computed(() => (props.size / 2) - 30);
const levels = computed(() => [0.2, 0.4, 0.6, 0.8, 1.0]);

const axes = computed(() => {
  const count = props.data.length;
  if (count === 0) {return [];}

  return props.data.map((_, i) => {
    const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
    const x = center.value + radius.value * Math.cos(angle);
    const y = center.value + radius.value * Math.sin(angle);
    const labelX = center.value + (radius.value + 20) * Math.cos(angle);
    const labelY = center.value + (radius.value + 20) * Math.sin(angle);
    return { x, y, labelX, labelY };
  });
});

const dataPoints = computed(() => {
  return props.data.map((item, i) => {
    const axis = axes.value[i];
    if (!axis) {return { x: 0, y: 0 };}
    const ratio = item.value / (item.max || 100);
    return {
      x: center.value + (axis.x - center.value) * ratio,
      y: center.value + (axis.y - center.value) * ratio,
    };
  });
});

const dataPolygonPoints = computed(() => {
  return dataPoints.value.map((p) => `${p.x},${p.y}`).join(" ");
});

function getPolygonPoints(level) {
  return axes.value
    .map((axis) => {
      const x = center.value + (axis.x - center.value) * level;
      const y = center.value + (axis.y - center.value) * level;
      return `${x},${y}`;
    })
    .join(" ");
}
</script>

<style scoped>
.radar-panel {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
}

.panel-header {
  margin-bottom: var(--space-4);
}

.panel-title {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-700);
}

.radar-container {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.radar-svg {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
}

.radar-values {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.value-item {
  display: flex;
  justify-content: space-between;
  padding: var(--space-1) 0;
  border-bottom: 1px solid var(--border-light);
}

.value-label {
  font-size: var(--text-xs);
  color: var(--text-500);
}

.value-num {
  font-size: var(--text-xs);
  font-weight: 600;
  font-family: var(--mono);
  color: var(--accent-10);
}
</style>
