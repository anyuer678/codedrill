<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <button
        class="btn-back"
        @click="$emit('back')"
      >
        ← 返回
      </button>
      <span class="sidebar-title">{{ modeLabel }}</span>
      <button
        class="btn-help"
        @click="$emit('help')"
      >
        ?
      </button>
    </div>
    <div class="progress-section">
      <div class="progress-info">
        <span class="progress-text">
          {{ currentIndex + 1 }} / {{ total }}
        </span>
        <span class="progress-percent">{{ progress }}%</span>
      </div>
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: progress + '%' }"
        />
      </div>
    </div>
    <div class="question-grid">
      <button
        v-for="(q, i) in total"
        :key="i"
        class="q-btn"
        :class="{
          active: i === currentIndex,
          correct: results[i]?.correct,
          wrong: results[i] && !results[i].correct,
        }"
        @click="$emit('go-to', i)"
      >
        {{ i + 1 }}
      </button>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  currentIndex: { type: Number, required: true },
  total: { type: Number, required: true },
  progress: { type: Number, required: true },
  results: { type: Array, required: true },
  modeLabel: { type: String, default: "" },
});

defineEmits(["back", "help", "go-to"]);
</script>

<style scoped>
.sidebar {
  width: 200px;
  background: var(--bg-card);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border);
}

.btn-back {
  background: none;
  border: none;
  color: var(--accent-10);
  cursor: pointer;
  font-size: var(--text-sm);
  font-weight: 500;
  font-family: var(--font);
  padding: 0;
}

.sidebar-title {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-900);
  flex: 1;
}

.btn-help {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid var(--border);
  border-radius: 50%;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-400);
  cursor: pointer;
  padding: 0;
}

.btn-help:hover {
  background: var(--border-light);
  color: var(--text-700);
}

.progress-section {
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2);
}

.progress-text {
  font-size: var(--text-xs);
  color: var(--text-400);
  font-family: var(--mono);
}

.progress-percent {
  font-size: var(--text-xs);
  font-weight: 600;
  font-family: var(--mono);
  color: var(--accent-10);
}

.progress-bar {
  height: 4px;
  background: var(--border-light);
  border-radius: 2px;
}

.progress-fill {
  height: 100%;
  background: var(--accent-10);
  border-radius: 2px;
  transition: width 300ms ease;
}

.question-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-2);
  padding: var(--space-3);
  overflow-y: auto;
  flex: 1;
}

.q-btn {
  padding: var(--space-2);
  font-size: var(--text-xs);
  font-weight: 600;
  font-family: var(--mono);
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--text-700);
}

.q-btn:hover {
  border-color: var(--text-400);
}

.q-btn.active {
  background: var(--accent-10);
  border-color: var(--accent-10);
  color: white;
}

.q-btn.correct {
  background: var(--correct);
  border-color: var(--correct);
  color: white;
}

.q-btn.wrong {
  background: var(--incorrect);
  border-color: var(--incorrect);
  color: white;
}
</style>
