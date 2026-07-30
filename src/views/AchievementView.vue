<template>
  <div class="achievement-layout">
    <div class="page-header">
      <h1 class="page-title">
        成就系统
      </h1>
      <span class="progress-info">{{ store.unlockedCount }}/{{ store.totalCount }} 已解锁 ({{ store.progress }}%)</span>
    </div>

    <div class="progress-bar">
      <div
        class="progress-fill"
        :style="{ width: store.progress + '%' }"
      />
    </div>

    <div class="achievement-grid">
      <div
        v-for="a in store.allAchievements"
        :key="a.id"
        class="achievement-card"
        :class="{ unlocked: a.unlocked }"
      >
        <div class="achievement-icon">
          {{ a.icon }}
        </div>
        <div class="achievement-info">
          <div class="achievement-name">
            {{ a.name }}
          </div>
          <div class="achievement-desc">
            {{ a.desc }}
          </div>
        </div>
        <div class="achievement-status">
          {{ a.unlocked ? '✓' : '🔒' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAchievementStore } from "@/stores/achievement";

const store = useAchievementStore();
</script>

<style scoped>
.achievement-layout {
  padding: var(--space-6);
  overflow-y: auto;
  height: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.page-title {
  font-size: var(--text-xl);
  font-weight: 700;
}

.progress-info {
  font-size: var(--text-sm);
  color: var(--text-500);
  font-family: var(--mono);
}

.progress-bar {
  height: 6px;
  background: var(--border-light);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: var(--space-6);
}

.progress-fill {
  height: 100%;
  background: var(--accent-10);
  border-radius: 3px;
}

.achievement-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-4);
}

.achievement-card {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  transition: all 150ms ease;
}

.achievement-card.locked {
  opacity: 0.5;
}

.achievement-card.unlocked {
  border-color: var(--accent-10);
}

.achievement-card.unlocked:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.achievement-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.achievement-info {
  flex: 1;
  min-width: 0;
}

.achievement-name {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-900);
}

.achievement-desc {
  font-size: var(--text-xs);
  color: var(--text-500);
  margin-top: 2px;
}

.achievement-status {
  font-size: 18px;
  flex-shrink: 0;
}

/* 移动端响应式 */
@media (max-width: 768px) {
  .achievement-layout {
    padding: var(--space-4);
  }

  .achievement-grid {
    gap: var(--space-3);
  }

  .achievement-card {
    padding: var(--space-3);
  }

  .achievement-icon {
    font-size: 24px;
  }

  .achievement-name {
    font-size: var(--text-xs);
  }

  .achievement-desc {
    font-size: 11px;
  }
}
</style>
