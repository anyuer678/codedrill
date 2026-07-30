<template>
  <div
    class="progress-ring"
    :style="{ width: size + 'px', height: size + 'px' }"
  >
    <svg
      :width="size"
      :height="size"
      viewBox="0 0 100 100"
    >
      <!-- 背景圆环 -->
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        :stroke="bgColor"
        :stroke-width="strokeWidth"
      />
      <!-- 进度圆环 -->
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        :stroke="color"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="offset"
        stroke-linecap="round"
        transform="rotate(-90 50 50)"
        class="progress-circle"
      />
    </svg>
    <div class="progress-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  percentage: { type: Number, default: 0 },
  size: { type: Number, default: 80 },
  strokeWidth: { type: Number, default: 8 },
  color: { type: String, default: "#2563EB" },
  bgColor: { type: String, default: "#E5E7EB" },
});

const circumference = computed(() => 2 * Math.PI * 40);
const offset = computed(() => {
  const p = Math.min(100, Math.max(0, props.percentage));
  return circumference.value - (p / 100) * circumference.value;
});
</script>

<style scoped>
.progress-ring {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.progress-circle {
  transition: stroke-dashoffset 0.5s ease;
}

.progress-content {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
