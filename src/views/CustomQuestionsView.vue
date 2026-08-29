<template>
  <div class="custom-layout">
    <div class="page-header">
      <h1 class="page-title">
        自定义题库
      </h1>
      <div class="header-actions">
        <button
          class="btn"
          @click="showAdd = true"
        >
          添加题目
        </button>
        <button
          class="btn"
          @click="exportQuestions"
        >
          导出
        </button>
        <label class="btn import-btn">
          导入
          <input
            type="file"
            accept=".json"
            hidden
            @change="importQuestions"
          >
        </label>
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
        <span class="stat-label">总题数</span>
      </div>
      <div
        v-for="(count, lang) in stats.byLang"
        :key="lang"
        class="stat-item"
      >
        <span class="stat-value">{{ count }}</span>
        <span class="stat-label">{{ lang }}</span>
      </div>
    </div>

    <!-- 筛选 -->
    <div class="filter-row">
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
      <select
        v-model="filterModule"
        class="select-sm"
      >
        <option value="">
          全部模块
        </option>
        <option
          v-for="mod in modules"
          :key="mod.id"
          :value="mod.id"
        >
          {{ mod.label }}
        </option>
      </select>
    </div>

    <!-- 题目列表 -->
    <div class="question-list">
      <div
        v-if="filteredQuestions.length === 0"
        class="empty-state"
      >
        <p>暂无自定义题目</p>
        <p class="empty-hint">
          点击「添加题目」创建你的专属题库
        </p>
      </div>
      <div
        v-for="(q, i) in filteredQuestions"
        :key="i"
        class="question-item"
      >
        <div class="q-header">
          <span class="q-lang">{{ q.language }}</span>
          <span class="q-module">{{ moduleLabels[q.module] || q.module }}</span>
          <span class="q-type">{{ typeLabels[q.type] || q.type }}</span>
          <button
            class="btn-remove"
            @click="removeQuestion(q.id)"
          >
            ×
          </button>
        </div>
        <div class="q-code">
          <pre><code>{{ q.code }}</code></pre>
        </div>
        <div class="q-footer">
          <span class="q-time">{{ formatDate(q.createdAt) }}</span>
        </div>
      </div>
    </div>

    <!-- 添加题目弹窗 -->
    <div
      v-if="showAdd"
      class="modal-overlay"
      @click="showAdd = false"
    >
      <div
        class="modal"
        @click.stop
      >
        <div class="modal-header">
          <h3>添加题目</h3>
          <button
            class="btn-close"
            @click="showAdd = false"
          >
            ×
          </button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <label class="form-label">语言</label>
            <select
              v-model="newQuestion.language"
              class="select"
            >
              <option
                v-for="lang in languages"
                :key="lang"
                :value="lang"
              >
                {{ lang }}
              </option>
            </select>
          </div>
          <div class="form-row">
            <label class="form-label">模块</label>
            <select
              v-model="newQuestion.module"
              class="select"
            >
              <option
                v-for="mod in modules"
                :key="mod.id"
                :value="mod.id"
              >
                {{ mod.label }}
              </option>
            </select>
          </div>
          <div class="form-row">
            <label class="form-label">类型</label>
            <select
              v-model="newQuestion.type"
              class="select"
            >
              <option value="copy">
                临摹
              </option>
              <option value="fill">
                填空
              </option>
              <option value="debug">
                改错
              </option>
            </select>
          </div>
          <div class="form-row">
            <label class="form-label">难度</label>
            <select
              v-model.number="newQuestion.difficulty"
              class="select"
            >
              <option :value="1">
                入门
              </option>
              <option :value="2">
                基础
              </option>
              <option :value="3">
                进阶
              </option>
            </select>
          </div>
          <div class="form-row">
            <label class="form-label">代码</label>
            <textarea
              v-model="newQuestion.code"
              class="textarea"
              rows="6"
              placeholder="输入代码..."
            />
          </div>
          <div
            v-if="newQuestion.type === 'debug'"
            class="form-row"
          >
            <label class="form-label">正确代码</label>
            <textarea
              v-model="newQuestion.correct_code"
              class="textarea"
              rows="6"
              placeholder="输入正确代码..."
            />
          </div>
          <div class="form-row">
            <label class="form-label">解释</label>
            <input
              v-model="newQuestion.explanation"
              class="input"
              placeholder="题目说明..."
            >
          </div>
        </div>
        <div class="modal-footer">
          <button
            class="btn"
            @click="showAdd = false"
          >
            取消
          </button>
          <button
            class="btn btn-primary"
            :disabled="!canAdd"
            @click="addQuestion"
          >
            添加
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getCustomQuestions, addCustomQuestion, deleteCustomQuestion, exportCustomQuestions, importCustomQuestions, getCustomStats } from "@/lib/customQuestionBank";

const router = useRouter();
const languages = ["Java", "Python", "C++", "JavaScript", "Bash", "SQL"];
const modules = [
  { id: "loop", label: "循环" },
  { id: "condition", label: "条件" },
  { id: "array", label: "数组" },
  { id: "string", label: "字符串" },
  { id: "function", label: "函数" },
];
const moduleLabels = { loop: "循环", condition: "条件", array: "数组", string: "字符串", function: "函数" };
const typeLabels = { copy: "临摹", fill: "填空", debug: "改错" };

const filterLang = ref("");
const filterModule = ref("");
const showAdd = ref(false);
const questionList = ref([]);
const stats = ref({ total: 0, byLang: {}, byModule: {} });

const newQuestion = ref({
  language: "Java",
  module: "loop",
  type: "copy",
  difficulty: 1,
  code: "",
  correct_code: "",
  explanation: "",
});

const canAdd = computed(() => {
  return newQuestion.value.code.trim().length > 0;
});

const filteredQuestions = computed(() => {
  return getCustomQuestions({
    language: filterLang.value || undefined,
    module: filterModule.value || undefined,
    limit: 100,
  });
});

function loadQuestions() {
  questionList.value = getCustomQuestions({ limit: 100 });
  stats.value = getCustomStats();
}

function addQuestion() {
  if (!canAdd.value) {return;}
  addCustomQuestion(newQuestion.value);
  showAdd.value = false;
  newQuestion.value = {
    language: "Java",
    module: "loop",
    type: "copy",
    difficulty: 1,
    code: "",
    correct_code: "",
    explanation: "",
  };
  loadQuestions();
}

function removeQuestion(id) {
  deleteCustomQuestion(id);
  loadQuestions();
}

function exportQuestions() {
  exportCustomQuestions();
}

function importQuestions(event) {
  const file = event.target.files[0];
  if (!file) {return;}
  const reader = new FileReader();
  reader.onload = (e) => {
    const result = importCustomQuestions(e.target.result);
    if (result.success) {
      loadQuestions();
    }
    alert(result.message);
  };
  reader.readAsText(file);
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
  loadQuestions();
});
</script>

<style scoped>
.custom-layout {
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
}

.import-btn {
  cursor: pointer;
}

.stats-row {
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.stat-item {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-4);
  text-align: center;
  min-width: 80px;
}

.stat-value {
  font-size: var(--text-lg);
  font-weight: 700;
  font-family: var(--mono);
  color: var(--accent-10);
}

.stat-label {
  font-size: var(--text-xs);
  color: var(--text-400);
}

.filter-row {
  display: flex;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
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

.question-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.empty-state {
  text-align: center;
  padding: var(--space-10);
  color: var(--text-400);
}

.empty-hint {
  font-size: var(--text-sm);
  margin-top: var(--space-2);
}

.question-item {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
}

.q-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}

.q-lang, .q-module, .q-type {
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

.q-code {
  background: var(--bg-60);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: var(--space-3);
  overflow-x: auto;
  max-height: 120px;
}

.q-code pre {
  margin: 0;
  font-family: var(--mono);
  font-size: 13px;
  line-height: 1.5;
}

.q-footer {
  margin-top: var(--space-3);
  display: flex;
  justify-content: flex-end;
}

.q-time {
  font-size: var(--text-xs);
  color: var(--text-400);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  width: 500px;
  max-width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4);
  border-bottom: 1px solid var(--border);
}

.modal-header h3 {
  font-size: var(--text-base);
  font-weight: 600;
}

.btn-close {
  background: none;
  border: none;
  font-size: 20px;
  color: var(--text-400);
  cursor: pointer;
}

.modal-body {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-700);
}

.textarea {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
  font-family: var(--mono);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg-card);
  resize: vertical;
  min-height: 100px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  padding: var(--space-4);
  border-top: 1px solid var(--border);
}

/* 移动端响应式 */
@media (max-width: 768px) {
  .custom-layout {
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

  .question-list {
    gap: var(--space-3);
  }

  .question-item {
    padding: var(--space-3);
  }

  .question-code {
    max-height: 100px;
    font-size: 12px;
  }

  .modal-content {
    width: 95%;
  }
}
</style>
