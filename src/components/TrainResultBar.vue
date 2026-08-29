<template>
  <div
    v-if="visible"
    class="result-bar"
    :class="ok ? 'result-ok' : 'result-fail'"
  >
    <span class="result-icon">{{ ok ? '✓' : '✗' }}</span>
    <span class="result-text">{{ ok ? '正确' : '错误' }}</span>
    <span class="result-time">{{ lastResult?.timeSpent?.toFixed(1) }}s</span>
    <div class="result-actions">
      <button
        v-if="!ok"
        class="btn btn-sm"
        @click="$emit('toggle-hint')"
      >
        提示
      </button>
      <button
        v-if="!ok"
        class="btn btn-sm"
        @click="$emit('toggle-diff')"
      >
        {{ showDiff ? '隐藏' : '对比' }}
      </button>
      <button
        v-if="!ok"
        class="btn btn-sm"
        @click="$emit('retry')"
      >
        重做
      </button>
      <button
        class="btn"
        @click="$emit('next')"
      >
        {{ isLast ? '完成' : '下一题' }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  visible: { type: Boolean, default: false },
  ok: { type: Boolean, default: false },
  lastResult: { type: Object, default: null },
  isLast: { type: Boolean, default: false },
  showDiff: { type: Boolean, default: false },
});

defineEmits(["toggle-hint", "toggle-diff", "retry", "next"]);
</script>

<style scoped>
.result-bar {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-top: 1px solid var(--border);
  flex-shrink: 0;
}

.result-ok {
  background: var(--correct-bg);
}

.result-fail {
  background: var(--incorrect-bg);
}

.result-icon {
  font-weight: 700;
  font-size: var(--text-lg);
}

.result-ok .result-icon { color: var(--correct); }
.result-fail .result-icon { color: var(--incorrect); }

.result-text {
  font-weight: 600;
  font-size: var(--text-sm);
}

.result-ok .result-text { color: var(--correct); }
.result-fail .result-text { color: var(--incorrect); }

.result-time {
  flex: 1;
  font-size: var(--text-xs);
  color: var(--text-400);
  font-family: var(--mono);
}

.result-actions {
  display: flex;
  gap: var(--space-2);
}

.btn-sm {
  padding: var(--space-1) var(--space-3);
  font-size: var(--text-xs);
}
</style>
