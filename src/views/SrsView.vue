<template>
  <div class="srs-layout">
    <div class="page-header">
      <h1 class="page-title">
        间隔重复
      </h1>
      <div class="header-actions">
        <button
          class="btn"
          @click="importWrong"
        >
          从错题本导入
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
        <span class="stat-label">总卡片</span>
      </div>
      <div class="stat-item">
        <span class="stat-value due">{{ stats.due }}</span>
        <span class="stat-label">待复习</span>
      </div>
      <div class="stat-item">
        <span class="stat-value learning">{{ stats.learning }}</span>
        <span class="stat-label">学习中</span>
      </div>
      <div class="stat-item">
        <span class="stat-value mature">{{ stats.mature }}</span>
        <span class="stat-label">已掌握</span>
      </div>
    </div>

    <!-- 复习区域 -->
    <div
      v-if="currentCard"
      class="review-section"
    >
      <div class="card-info">
        <span class="card-lang">{{ currentCard.language }}</span>
        <span class="card-module">{{ moduleLabels[currentCard.module] || currentCard.module }}</span>
      </div>

      <div class="code-block">
        <div
          v-for="(line, i) in displayLines"
          :key="i"
          class="code-line"
        >
          <span class="line-no">{{ i + 1 }}</span>
          <span class="line-text">{{ line }}</span>
        </div>
      </div>

      <div
        v-if="showAnswer"
        class="answer-section"
      >
        <div class="answer-label">
          你的输入
        </div>
        <div class="code-block">
          <div
            v-for="(line, i) in submittedLines"
            :key="'s' + i"
            class="code-line"
          >
            <span class="line-no">{{ i + 1 }}</span>
            <span :class="['line-text', getLineStatus(i)]">{{ line }}</span>
          </div>
          <div class="code-line active">
            <span class="line-no">{{ submittedLines.length + 1 }}</span>
            <span class="line-text">
              <span
                v-for="(token, ti) in currentTokens"
                :key="ti"
                :class="['token', token.status]"
              >{{ token.text }}</span>
              <span class="cursor" />
            </span>
          </div>
        </div>
        <input
          ref="inputRef"
          v-model="currentLine"
          class="hidden-input"
          spellcheck="false"
          autocomplete="off"
          @keydown="handleKeydown"
          @input="onInput"
        >
      </div>

      <div
        v-if="showResult"
        class="result-section"
      >
        <div class="result-label">
          评价
        </div>
        <div class="result-buttons">
          <button
            class="btn btn-danger"
            @click="rateCard(1)"
          >
            重来
          </button>
          <button
            class="btn btn-warning"
            @click="rateCard(3)"
          >
            困难
          </button>
          <button
            class="btn btn-success"
            @click="rateCard(5)"
          >
            简单
          </button>
        </div>
      </div>

      <div
        v-if="!showAnswer"
        class="action-section"
      >
        <button
          class="btn btn-primary"
          @click="showAnswer = true"
        >
          显示答案
        </button>
      </div>
    </div>

    <div
      v-else
      class="empty-state"
    >
      <p v-if="stats.due > 0">
        没有待复习的卡片
      </p>
      <p v-else>
        暂无卡片，点击上方"从错题本导入"添加
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { getDueCards, reviewCard, getSrsStats, importFromWrongBook } from "@/lib/spacedRepetition";
import { getWrongQuestions } from "@/lib/questionBank";

const router = useRouter();
const inputRef = ref(null);

const moduleLabels = { loop: "循环", condition: "条件", array: "数组", string: "字符串", function: "函数" };

const stats = ref({ total: 0, due: 0, learning: 0, mature: 0, totalReviews: 0 });
const dueCards = ref([]);
const currentIndex = ref(0);
const showAnswer = ref(false);
const showResult = ref(false);
const currentLine = ref("");
const submittedLines = ref([]);
const currentTokens = ref([]);

const currentCard = computed(() => dueCards.value[currentIndex.value] || null);

const displayLines = computed(() => {
  if (!currentCard.value) {return [];}
  return currentCard.value.code.split("\n");
});

const refLines = computed(() => {
  if (!currentCard.value) {return [];}
  return currentCard.value.code.split("\n");
});

function loadStats() {
  stats.value = getSrsStats();
}

function loadDueCards() {
  dueCards.value = getDueCards(20);
  currentIndex.value = 0;
  resetInput();
}

function resetInput() {
  showAnswer.value = false;
  showResult.value = false;
  currentLine.value = "";
  submittedLines.value = [];
  currentTokens.value = [];
}

function importWrong() {
  const wrongQuestions = getWrongQuestions({ mastered: false, limit: 100 });
  importFromWrongBook(wrongQuestions);
  loadStats();
  loadDueCards();
}

function tokenizeLine(line) {
  const tokens = [];
  let current = "";
  for (const ch of line) {
    if (/[a-zA-Z0-9_]/.test(ch)) {
      current += ch;
    } else {
      if (current) { tokens.push({ text: current, type: "identifier" }); current = ""; }
      tokens.push({ text: ch, type: "punctuation" });
    }
  }
  if (current) {tokens.push({ text: current, type: "identifier" });}
  return tokens.length > 0 ? tokens : [{ text: " ", type: "empty" }];
}

function onInput() {
  const lineIndex = submittedLines.value.length;
  const refLine = refLines.value[lineIndex] || "";
  const refTokens = tokenizeLine(refLine);
  const inputTokens = tokenizeLine(currentLine.value);

  const result = [];
  const maxLen = Math.max(refTokens.length, inputTokens.length);
  for (let i = 0; i < maxLen; i++) {
    const ref = refTokens[i];
    const inp = inputTokens[i];
    if (!inp) {
      // pending
    } else if (!ref) {
      result.push({ text: inp.text, type: inp.type, status: "extra" });
    } else if (ref.text === inp.text) {
      result.push({ text: inp.text, type: inp.type, status: "correct" });
    } else {
      result.push({ text: inp.text, type: inp.type, status: "wrong" });
    }
  }
  currentTokens.value = result;
}

function handleKeydown(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    submitLine();
  } else if (e.key === "Backspace" && currentLine.value === "" && submittedLines.value.length > 0) {
    currentLine.value = submittedLines.value.pop();
    onInput();
  }
}

function getLineStatus(lineIndex) {
  const refLine = refLines.value[lineIndex];
  const subLine = submittedLines.value[lineIndex];
  if (!refLine || !subLine) {return "";}
  return refLine.trim() === subLine.trim() ? "correct" : "wrong";
}

function submitLine() {
  submittedLines.value.push(currentLine.value);
  currentLine.value = "";
  currentTokens.value = [];

  if (submittedLines.value.length >= refLines.value.length) {
    showResult.value = true;
  }
}

function rateCard(quality) {
  if (!currentCard.value) {return;}

  reviewCard(currentCard.value.questionId, quality);
  loadStats();

  currentIndex.value++;
  if (currentIndex.value >= dueCards.value.length) {
    loadDueCards();
  } else {
    resetInput();
    nextTick(() => inputRef.value?.focus());
  }
}

function goHome() {
  router.push("/");
}

onMounted(() => {
  loadStats();
  loadDueCards();
});
</script>

<style scoped>
.srs-layout { height: 100%; padding: var(--space-6); overflow-y: auto; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-5); }
.page-title { font-size: var(--text-xl); font-weight: 700; color: var(--text-900); }
.header-actions { display: flex; gap: var(--space-2); }
.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-3); margin-bottom: var(--space-5); }
.stat-item { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); padding: var(--space-3); text-align: center; }
.stat-value { display: block; font-size: var(--text-xl); font-weight: 700; font-family: var(--mono); color: var(--accent-10); }
.stat-value.due { color: var(--incorrect); }
.stat-value.learning { color: var(--warning); }
.stat-value.mature { color: var(--correct); }
.stat-label { font-size: var(--text-xs); color: var(--text-500); }
.review-section { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); padding: var(--space-4); }
.card-info { display: flex; gap: var(--space-2); margin-bottom: var(--space-3); }
.card-lang, .card-module { font-size: var(--text-xs); padding: 2px 8px; border-radius: var(--radius-sm); background: var(--border-light); color: var(--text-500); }
.code-block { background: #1e1e1e; border-radius: var(--radius-sm); padding: var(--space-3); font-family: var(--mono); font-size: var(--text-sm); line-height: 1.6; overflow: auto; margin-bottom: var(--space-3); }
.code-line { display: flex; }
.code-line.active { background: rgba(37, 99, 235, 0.1); }
.line-no { width: 30px; color: #6b7280; text-align: right; margin-right: 12px; user-select: none; }
.line-text { flex: 1; color: #d4d4d4; white-space: pre; }
.line-text.correct { color: #4ade80; }
.line-text.wrong { color: #f87171; }
.token.correct { color: #4ade80; }
.token.wrong { color: #f87171; text-decoration: underline wavy; }
.token.extra { color: #f59e0b; }
.cursor { display: inline-block; width: 2px; height: 14px; background: var(--accent-10); animation: blink 1s infinite; vertical-align: text-bottom; }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
.hidden-input { position: absolute; opacity: 0; width: 0; height: 0; }
.answer-section { margin-top: var(--space-3); }
.answer-label, .result-label { font-size: var(--text-sm); font-weight: 600; color: var(--text-700); margin-bottom: var(--space-2); }
.result-section { margin-top: var(--space-3); }
.result-buttons { display: flex; gap: var(--space-2); }
.btn { padding: var(--space-2) var(--space-4); border-radius: var(--radius-md); font-size: var(--text-sm); cursor: pointer; border: 1px solid var(--border); background: var(--bg-card); color: var(--text-700); }
.btn-primary { background: var(--accent-10); color: white; border: none; }
.btn-danger { background: #ef4444; color: white; border: none; }
.btn-warning { background: #f59e0b; color: white; border: none; }
.btn-success { background: #22c55e; color: white; border: none; }
.action-section { margin-top: var(--space-3); text-align: center; }
.empty-state { text-align: center; padding: var(--space-10); color: var(--text-500); }

/* 移动端响应式 */
@media (max-width: 768px) {
  .srs-layout {
    padding: var(--space-4);
  }

  .srs-grid {
    grid-template-columns: 1fr;
    gap: var(--space-3);
  }

  .srs-card {
    padding: var(--space-4);
  }

  .code-block {
    font-size: 12px;
  }

  .result-buttons {
    flex-wrap: wrap;
  }
}
</style>
