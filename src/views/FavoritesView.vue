<template>
  <div class="favorites-layout">
    <div class="page-header">
      <h1 class="page-title">
        收藏夹
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
          class="btn"
          @click="goHome"
        >
          返回首页
        </button>
      </div>
    </div>

    <div class="fav-list">
      <div
        v-if="filteredFav.length === 0"
        class="empty-state"
      >
        <p>暂无收藏</p>
      </div>
      <div
        v-for="(item, i) in filteredFav"
        :key="i"
        class="fav-item"
      >
        <div class="fav-header">
          <span class="fav-lang">{{ item.language }}</span>
          <span class="fav-module">{{ moduleLabels[item.module] || item.module }}</span>
          <button
            class="btn-remove"
            @click="removeFav(item.questionId)"
          >
            ×
          </button>
        </div>
        <div class="fav-code">
          <pre><code>{{ item.code }}</code></pre>
        </div>
        <div class="fav-footer">
          <span class="fav-time">{{ formatDate(item.addedTime) }}</span>
          <button
            class="btn btn-sm btn-primary"
            @click="practiceFav(item)"
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
import { getFavorites, removeFavorite } from "@/lib/questionBank";

const router = useRouter();
const languages = ["Java", "Python", "C++", "JavaScript", "Bash", "SQL"];
const moduleLabels = { loop: "循环", condition: "条件", array: "数组", string: "字符串", function: "函数" };

const filterLang = ref("");
const favList = ref([]);

const filteredFav = computed(() => {
  if (!filterLang.value) {return favList.value;}
  return favList.value.filter((f) => f.language === filterLang.value);
});

function loadFav() {
  favList.value = getFavorites({ limit: 100 });
}

function removeFav(id) {
  removeFavorite(id);
  loadFav();
}

function practiceFav(item) {
  router.push({
    name: "Train",
    params: { mode: "copy" },
    query: { lang: item.language, module: item.module, count: 5 },
  });
}

function formatDate(ts) {
  if (!ts) {return "";}
  const d = new Date(ts);
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function goHome() {
  router.push("/");
}

onMounted(() => {
  loadFav();
});
</script>

<style scoped>
.favorites-layout {
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

.fav-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.empty-state {
  text-align: center;
  padding: var(--space-10);
  color: var(--text-400);
}

.fav-item {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  transition: all 150ms ease;
}

.fav-item:hover {
  border-color: var(--accent-10);
}

.fav-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}

.fav-lang, .fav-module {
  padding: var(--space-1) var(--space-2);
  font-size: var(--text-xs);
  border-radius: var(--radius-sm);
  background: var(--border-light);
  color: var(--text-500);
}

.btn-remove {
  margin-left: auto;
  background: none;
  border: none;
  font-size: 18px;
  color: var(--text-400);
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.btn-remove:hover {
  color: var(--incorrect);
}

.fav-code {
  background: var(--bg-60);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: var(--space-3);
  margin-bottom: var(--space-3);
  overflow-x: auto;
  max-height: 150px;
}

.fav-code pre {
  margin: 0;
  font-family: var(--mono);
  font-size: 13px;
  line-height: 1.5;
}

.fav-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.fav-time {
  font-size: var(--text-xs);
  color: var(--text-400);
}

.btn-sm {
  padding: var(--space-1) var(--space-3);
  font-size: var(--text-xs);
}

/* 移动端响应式 */
@media (max-width: 768px) {
  .favorites-layout {
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

  .fav-list {
    gap: var(--space-3);
  }

  .fav-item {
    padding: var(--space-3);
  }

  .fav-code {
    max-height: 100px;
    font-size: 12px;
  }

  .fav-footer {
    flex-wrap: wrap;
    gap: var(--space-2);
  }
}
</style>
