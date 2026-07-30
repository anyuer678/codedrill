<template>
  <div class="wrongbook-layout">
    <div class="page-header">
      <h1 class="page-title">
        错题本
      </h1>
      <div class="header-actions">
        <select
          v-model="filterLang"
          class="select-sm"
        >
          <option value="">
            全部语言
          </option>
          <option
            v-for="lang in languages"
            :key="lang"
            :value="lang"
          >
            {{ lang }}
          </option>
        </select>
        <button
          class="btn btn-primary"
          :disabled="stats.unmastered === 0"
          @click="batchPractice"
        >
          批量重练 ({{ stats.unmastered }})
        </button>
        <button
          class="btn"
          @click="goHome"
        >
          返回首页
        </button>
      </div>
    </div>

    <!-- 统计 -->
    <div class="stats-row">
      <div class="stat-item">
        <span class="stat-value">{{ stats.total }}</span>
        <span class="stat-label">总错题</span>
      </div>
      <div class="stat-item">
        <span class="stat-value ok">{{ stats.mastered }}</span>
        <span class="stat-label">已掌握</span>
      </div>
      <div class="stat-item">
        <span class="stat-value warn">{{ stats.unmastered }}</span>
        <span class="stat-label">待复习</span>
      </div>
    </div>

    <!-- 错题列表 -->
    <div class="wrong-list">
      <div
        v-if="filteredWrong.length === 0"
        class="empty-state"
      >
        <p>暂无错题</p>
      </div>
      <div
        v-for="(item, i) in filteredWrong"
        :key="i"
        class="wrong-item"
        :class="{ mastered: item.mastered }"
      >
        <div class="wrong-header">
          <span class="wrong-lang">{{ item.language }}</span>
          <span class="wrong-module">{{ moduleLabels[item.module] || item.module }}</span>
          <span class="wrong-count">错{{ item.wrongCount }}次</span>
          <span class="wrong-type">{{ errorLabels[item.errorType] || item.errorType }}</span>
        </div>
        <div class="wrong-code">
          <pre><code>{{ item.code }}</code></pre>
        </div>
        <div class="wrong-actions">
          <button
            v-if="!item.mastered"
            class="btn btn-sm"
            @click="markMastered(item.questionId)"
          >
            标记已掌握
          </button>
          <button
            class="btn btn-sm"
            @click="removeWrong(item.questionId)"
          >
            删除
          </button>
          <button
            class="btn btn-sm btn-primary"
            @click="practiceWrong(item)"
          >
            练习
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getWrongQuestions, getWrongStats, markWrongMastered, removeWrongQuestion } from "@/lib/questionBank";

const router = useRouter();
const languages = ["Java", "Python", "C++", "JavaScript", "Linux", "SQL"];
const moduleLabels = { loop: "循环", condition: "条件", array: "数组", string: "字符串", function: "函数" };
const errorLabels = { syntax: "语法", structure: "结构", api: "API", logic: "逻辑", typo: "手速" };

const filterLang = ref("");
const wrongList = ref([]);
const stats = ref({ total: 0, mastered: 0, unmastered: 0, byType: {} });

const filteredWrong = computed(() => {
  if (!filterLang.value) {return wrongList.value;}
  return wrongList.value.filter((w) => w.language === filterLang.value);
});

function loadWrong() {
  wrongList.value = getWrongQuestions({ limit: 100 });
  stats.value = getWrongStats();
}

function markMastered(id) {
  markWrongMastered(id);
  loadWrong();
}

function removeWrong(id) {
  removeWrongQuestion(id);
  loadWrong();
}

function practiceWrong(item) {
  router.push({
    name: "Train",
    params: { mode: "copy" },
    query: { lang: item.language, module: item.module, count: 5 },
  });
}

function batchPractice() {
  const unmastered = wrongList.value.filter((w) => !w.mastered);
  if (unmastered.length === 0) {return;}

  const lang = filterLang.value || unmastered[0].language;
  router.push({
    name: "Train",
    params: { mode: "copy" },
    query: { lang, module: "loop", count: Math.min(unmastered.length, 20) },
  });
}

function goHome() {
  router.push("/");
}

onMounted(() => {
  loadWrong();
});
</script>

<style scoped>
.wrongbook-layout {
  height: 100%;
  padding: var(--space-6);
  overflow-y: auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-5);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--border);
}

.page-title {
  font-size: var(--text-xl);
  font-weight: 700;
}

.header-actions {
  display: flex;
  gap: var(--space-3);
  align-items: center;
}

.select-sm {
  width: 120px;
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
  font-family: var(--font);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg-card);
}

.stats-row {
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-5);
}

.stat-item {
  flex: 1;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  text-align: center;
}

.stat-value {
  font-size: var(--text-xl);
  font-weight: 700;
  font-family: var(--mono);
}

.stat-value.ok { color: var(--correct); }
.stat-value.warn { color: var(--warning); }

.stat-label {
  font-size: var(--text-xs);
  color: var(--text-400);
  margin-top: var(--space-1);
}

.wrong-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.empty-state {
  text-align: center;
  padding: var(--space-10);
  color: var(--text-400);
}

.wrong-item {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  transition: all 150ms ease;
}

.wrong-item.mastered {
  opacity: 0.6;
  border-color: var(--correct);
}

.wrong-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}

.wrong-lang, .wrong-module, .wrong-type {
  padding: var(--space-1) var(--space-2);
  font-size: var(--text-xs);
  border-radius: var(--radius-sm);
  background: var(--border-light);
  color: var(--text-500);
}

.wrong-count {
  font-size: var(--text-xs);
  color: var(--warning);
  font-weight: 600;
  margin-left: auto;
}

.wrong-code {
  background: var(--bg-60);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: var(--space-3);
  margin-bottom: var(--space-3);
  overflow-x: auto;
}

.wrong-code pre {
  margin: 0;
  font-family: var(--mono);
  font-size: 13px;
  line-height: 1.5;
}

.wrong-actions {
  display: flex;
  gap: var(--space-2);
  justify-content: flex-end;
}

.btn-sm {
  padding: var(--space-1) var(--space-3);
  font-size: var(--text-xs);
}

/* 移动端响应式 */
@media (max-width: 768px) {
  .wrongbook-layout {
    padding: var(--space-4);
  }

  .page-header {
    flex-direction: column;
    gap: var(--space-3);
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    flex-wrap: wrap;
  }

  .stats-row {
    flex-wrap: wrap;
  }

  .stat-item {
    flex: 1 1 30%;
    min-width: 0;
    padding: var(--space-3);
  }

  .wrong-item {
    padding: var(--space-3);
  }

  .wrong-header {
    flex-wrap: wrap;
    gap: var(--space-1);
  }

  .wrong-code {
    max-height: 100px;
    font-size: 12px;
  }

  .wrong-actions {
    flex-wrap: wrap;
  }
}
</style>
