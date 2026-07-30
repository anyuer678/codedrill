<template>
  <div class="skill-layout">
    <div class="page-header">
      <h1 class="page-title">
        技能树
      </h1>
      <button
        class="btn"
        @click="goHome"
      >
        返回首页
      </button>
    </div>

    <div class="skill-overview">
      <div class="overview-stat">
        <div class="stat-value">
          {{ skillStore.overallLevel }}
        </div>
        <div class="stat-label">
          平均等级
        </div>
      </div>
      <div class="overview-stat">
        <div class="stat-value">
          {{ skillStore.totalExp }}
        </div>
        <div class="stat-label">
          总经验值
        </div>
      </div>
    </div>

    <div class="skill-grid">
      <div
        v-for="(skill, key) in skillStore.SKILL_TREE"
        :key="key"
        class="skill-card"
        :class="{ locked: !skillStore.isUnlocked(key) }"
      >
        <div class="skill-header">
          <div class="skill-color" :style="{ background: skill.bg }"></div>
          <span class="skill-name">{{ skill.label }}</span>
          <span class="skill-level">Lv.{{ skillStore.getSkillLevel(key) }}</span>
        </div>

        <div class="skill-title">
          {{ skillStore.getLevelTitle(key) }}
        </div>

        <div class="skill-progress">
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: skillStore.getProgress(key) + '%' }"
            />
          </div>
          <div class="progress-text">
            {{ skillStore.getSkillExp(key) }} / {{ skillStore.getNextLevelExp(key) }} EXP
          </div>
        </div>

        <div class="skill-sub">
          <span
            v-for="sub in skill.subSkills"
            :key="sub.id"
            class="sub-tag"
          >
            {{ sub.label }}
          </span>
        </div>

        <div
          v-if="skill.prerequisites.length > 0"
          class="skill-prereq"
        >
          <span class="prereq-label">前置：</span>
          <span
            v-for="pre in skill.prerequisites"
            :key="pre"
            class="prereq-tag"
          >
            {{ skillStore.SKILL_TREE[pre]?.label || pre }}
          </span>
        </div>

        <div
          v-if="!skillStore.isUnlocked(key)"
          class="skill-lock"
        >
          需要前置技能达到 Lv.3
        </div>

        <button
          class="btn btn-sm btn-train"
          :disabled="!skillStore.isUnlocked(key)"
          @click="trainSkill(key)"
        >
          训练
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useSkillTreeStore } from "@/stores/skillTree";

const router = useRouter();
const skillStore = useSkillTreeStore();

function trainSkill(module) {
  router.push({
    name: "Train",
    params: { mode: "copy" },
    query: { lang: "Java", module, count: 10 },
  });
}

function goHome() {
  router.push("/");
}
</script>

<style scoped>
.skill-layout {
  height: 100%;
  padding: var(--space-6);
  overflow-y: auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-4);
  border-bottom: 2px solid var(--border);
}

.page-title {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--text-900);
}

.skill-overview {
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.overview-stat {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-4) var(--space-6);
  text-align: center;
  flex: 1;
  transition: all 0.2s ease;
}

.overview-stat:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.stat-value {
  font-size: var(--text-2xl);
  font-weight: 700;
  font-family: var(--mono);
  color: var(--accent-10);
}

.stat-label {
  font-size: var(--text-xs);
  color: var(--text-400);
  margin-top: var(--space-1);
}

.skill-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-4);
}

.skill-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.skill-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--accent-10);
  transform: scaleX(0);
  transition: transform 0.2s ease;
}

.skill-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.skill-card:hover::before {
  transform: scaleX(1);
}

.skill-card.locked {
  opacity: 0.5;
  background: var(--border-light);
}

.skill-card.locked:hover {
  transform: none;
  box-shadow: none;
}

.skill-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}

.skill-color {
  width: 16px;
  height: 16px;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}

.skill-name {
  flex: 1;
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--text-900);
}

.skill-level {
  font-size: var(--text-sm);
  font-weight: 700;
  font-family: var(--mono);
  color: var(--accent-10);
}

.skill-title {
  font-size: var(--text-xs);
  color: var(--text-500);
  margin-bottom: var(--space-3);
  padding: 2px 8px;
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  display: inline-block;
}

.skill-progress {
  margin-bottom: var(--space-3);
}

.progress-bar {
  height: 8px;
  background: var(--border-light);
  border-radius: var(--radius-sm);
  overflow: hidden;
  margin-bottom: var(--space-2);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-10), #60a5fa);
  border-radius: var(--radius-sm);
  transition: width 300ms ease;
}

.progress-text {
  font-size: var(--text-xs);
  color: var(--text-400);
  font-family: var(--mono);
}

.skill-sub {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
  flex: 1;
}

.sub-tag {
  padding: 4px 10px;
  font-size: 11px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--text-500);
  transition: all 0.15s ease;
}

.sub-tag:hover {
  background: rgba(59, 130, 246, 0.1);
  border-color: var(--accent-10);
  color: var(--accent-10);
}

.skill-prereq {
  font-size: var(--text-xs);
  color: var(--text-400);
  margin-bottom: var(--space-2);
}

.prereq-label {
  margin-right: var(--space-1);
}

.prereq-tag {
  padding: 3px 8px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: var(--radius-sm);
  color: var(--accent-10);
  font-weight: 500;
}

.skill-lock {
  font-size: var(--text-xs);
  color: var(--warning);
  margin-bottom: var(--space-2);
}

.skill-sub {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
  margin-bottom: var(--space-3);
  flex: 1;
}

.btn-train {
  width: 100%;
  margin-top: auto;
}

.btn-sm {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-xs);
}

/* 移动端响应式 */
@media (max-width: 768px) {
  .skill-layout {
    padding: var(--space-4);
  }

  .page-header {
    margin-bottom: var(--space-4);
  }

  .skill-overview {
    flex-direction: row;
    gap: var(--space-3);
  }

  .overview-stat {
    flex: 1;
    padding: var(--space-3);
  }

  .stat-value {
    font-size: var(--text-xl);
  }

  .skill-grid {
    grid-template-columns: 1fr;
    gap: var(--space-3);
  }

  .skill-card {
    padding: var(--space-4);
  }

  .skill-name {
    font-size: var(--text-sm);
  }

  .skill-level {
    font-size: var(--text-xs);
  }

  .progress-bar {
    height: 6px;
  }

  .sub-tag {
    padding: 3px 8px;
    font-size: 10px;
  }
}
</style>
