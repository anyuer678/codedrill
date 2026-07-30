<template>
  <div
    class="stat-card"
    :class="{ highlight }"
  >
    <div
      class="stat-value"
      :class="valueClass"
    >
      {{ displayValue }}
    </div>
    <div class="stat-label">
      {{ label }}
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  value: { type: [Number, String], default: 0 },
  label: { type: String, default: "" },
  suffix: { type: String, default: "" },
  type: { type: String, default: "default" },
  highlight: { type: Boolean, default: false },
});

const displayValue = computed(() => `${props.value}${props.suffix}`);

const valueClass = computed(() => {
  if (props.type === "correct") {return "correct";}
  if (props.type === "incorrect") {return "incorrect";}
  return "";
});
</script>

<style scoped>
.stat-card {
  text-align: center;
  padding: 12px 8px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
}

.stat-card.highlight {
  border-color: var(--accent-blue);
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--text-primary);
  font-family: var(--font-mono);
}

.stat-value.correct {
  color: var(--accent-green);
}

.stat-value.incorrect {
  color: var(--accent-red);
}

.stat-label {
  font-size: 11px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 4px;
}
</style>
