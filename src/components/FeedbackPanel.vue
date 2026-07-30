<template>
  <div
    class="feedback-panel"
    :class="type"
  >
    <div class="feedback-header">
      <span class="feedback-icon">{{ type === "correct" ? "✓" : "✗" }}</span>
      <span class="feedback-title">{{ type === "correct" ? "正确!" : "不正确" }}</span>
      <span
        v-if="time"
        class="feedback-time"
      >{{ time }}s</span>
    </div>
    <div
      v-if="!isCorrect && expected"
      class="feedback-body"
    >
      <div class="expected-label">
        参考答案：
      </div>
      <pre class="expected-code"><code>{{ expected }}</code></pre>
    </div>
    <div
      v-if="explanation"
      class="feedback-explanation"
    >
      {{ explanation }}
    </div>
    <div class="feedback-actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  type: { type: String, default: "correct" },
  time: { type: [Number, String], default: null },
  expected: { type: String, default: "" },
  explanation: { type: String, default: "" },
});

const isCorrect = computed(() => props.type === "correct");
</script>

<style scoped>
.feedback-panel {
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  margin-top: 12px;
}

.feedback-panel.correct {
  border-color: var(--accent-green);
  background: rgba(78, 201, 176, 0.08);
}

.feedback-panel.incorrect {
  border-color: var(--accent-red);
  background: rgba(244, 71, 71, 0.08);
}

.feedback-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.feedback-icon {
  font-size: 16px;
  font-weight: bold;
}

.feedback-panel.correct .feedback-icon {
  color: var(--accent-green);
}

.feedback-panel.incorrect .feedback-icon {
  color: var(--accent-red);
}

.feedback-title {
  font-weight: bold;
}

.feedback-panel.correct .feedback-title {
  color: var(--accent-green);
}

.feedback-panel.incorrect .feedback-title {
  color: var(--accent-red);
}

.feedback-time {
  margin-left: auto;
  font-size: 12px;
  color: var(--text-secondary);
}

.expected-label {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.expected-code {
  background: var(--bg-primary);
  padding: 8px;
  border-radius: var(--radius);
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.5;
  overflow-x: auto;
  margin: 0;
}

.feedback-explanation {
  margin-top: 8px;
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.feedback-actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
</style>
