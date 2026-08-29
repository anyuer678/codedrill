<template>
  <aside class="stats-panel">
    <div class="stats-header">
      统计
    </div>
    <div class="stats-list">
      <div class="stat-row">
        <span class="stat-label">正确</span>
        <span class="stat-value ok">{{ correct }}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">错误</span>
        <span class="stat-value fail">{{ wrong }}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">正确率</span>
        <span class="stat-value">{{ accuracy }}%</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">平均用时</span>
        <span class="stat-value">{{ avgTime }}s</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">打字速度</span>
        <span class="stat-value">{{ typingSpeed }} CPM</span>
      </div>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  correct: { type: Number, required: true },
  wrong: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  avgTime: { type: Number, required: true },
  typingSpeed: { type: Number, required: true },
});
</script>

<style scoped>
.stats-panel {
  width: 160px;
  background: var(--bg-card);
  border-left: 1px solid var(--border);
  flex-shrink: 0;
}

.stats-header {
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-500);
  text-transform: uppercase;
}

.stats-list {
  padding: var(--space-3);
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3);
  border-bottom: 1px solid var(--border-light);
}

.stat-label {
  font-size: var(--text-xs);
  color: var(--text-400);
}

.stat-value {
  font-size: var(--text-base);
  font-weight: 700;
  font-family: var(--mono);
  color: var(--text-900);
}

.stat-value.ok { color: var(--correct); }
.stat-value.fail { color: var(--incorrect); }
</style>
