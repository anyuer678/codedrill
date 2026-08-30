<template>
  <div class="challenge-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <button
          class="btn-back"
          @click="goBack"
        >
          ← 返回
        </button>
        <span class="sidebar-title">限时挑战</span>
      </div>

      <div class="timer-section">
        <div
          class="timer-display"
          :class="{ urgent: timeLeft <= 10 }"
        >
          {{ formatTime(timeLeft) }}
        </div>
        <div class="timer-label">
          剩余时间
        </div>
      </div>

      <div class="score-section">
        <div class="score-row">
          <span class="score-label">得分</span>
          <span class="score-value">{{ score }}</span>
        </div>
        <div class="score-row">
          <span class="score-label">连击</span>
          <span class="score-value combo">{{ combo }}</span>
        </div>
        <div class="score-row">
          <span class="score-label">正确率</span>
          <span class="score-value">{{ accuracy }}%</span>
        </div>
      </div>

      <div class="config-section">
        <div class="config-label">
          挑战设置
        </div>
        <div class="config-group">
          <div class="config-sublabel">
            时长
          </div>
          <div class="config-options">
            <button
              v-for="t in timeOptions"
              :key="t"
              class="config-btn"
              :class="{ selected: config.time === t }"
              :disabled="isRunning"
              @click="config.time = t"
            >
              {{ t }}s
            </button>
          </div>
        </div>
        <div class="config-group">
          <div class="config-sublabel">
            语言
          </div>
          <div class="config-options">
            <button
              v-for="l in languages"
              :key="l"
              class="config-btn"
              :class="{ selected: config.language === l }"
              :disabled="isRunning"
              @click="config.language = l"
            >
              {{ l }}
            </button>
          </div>
        </div>
        <div class="config-group">
          <div class="config-sublabel">
            题型
          </div>
          <div class="config-options">
            <button
              v-for="m in modeOptions"
              :key="m.id"
              class="config-btn"
              :class="{ selected: config.mode === m.id }"
              :disabled="isRunning"
              @click="config.mode = m.id"
            >
              {{ m.label }}
            </button>
          </div>
        </div>
      </div>

      <button
        class="btn btn-primary btn-start"
        :disabled="isRunning"
        @click="startChallenge"
      >
        {{ isRunning ? '进行中...' : '开始挑战' }}
      </button>
    </aside>

    <main class="main-area">
      <div
        v-if="!isRunning && !isFinished"
        class="start-screen"
      >
        <h1>限时挑战</h1>
        <p>在限定时间内完成尽可能多的题目</p>
        <p>支持临摹、填空、改错三种题型</p>
        <p>连续正确可获得连击加成</p>
      </div>

      <template v-if="isRunning">
        <div class="question-panel">
          <div class="panel-header">
            <span class="panel-title">{{ questionTypeLabel }}</span>
            <span class="question-num">第 {{ currentIndex + 1 }} 题</span>
          </div>

          <div
            v-if="currentQuestion"
            class="code-block"
          >
            <div
              v-for="(line, i) in displayLines"
              :key="i"
              class="code-line"
            >
              <span class="line-no">{{ i + 1 }}</span>
              <span class="line-text">{{ line }}</span>
            </div>
          </div>
        </div>

        <div class="input-panel">
          <div class="panel-header">
            <span class="panel-title">你的输入</span>
            <span
              v-if="showHint && hint"
              class="hint-text"
            >💡 {{ hint }}</span>
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
      </template>

      <div
        v-if="isFinished"
        class="result-screen"
      >
        <h1>挑战结束</h1>
        <div class="result-stats">
          <div class="stat-item">
            <div class="stat-value">
              {{ score }}
            </div>
            <div class="stat-label">
              总得分
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-value">
              {{ totalCorrect }}/{{ totalQuestions }}
            </div>
            <div class="stat-label">
              正确/总题数
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-value">
              {{ accuracy }}%
            </div>
            <div class="stat-label">
              正确率
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-value">
              {{ maxCombo }}
            </div>
            <div class="stat-label">
              最高连击
            </div>
          </div>
        </div>
        <div class="result-actions">
          <button
            class="btn btn-primary"
            @click="startChallenge"
          >
            再来一次
          </button>
          <button
            class="btn btn-secondary"
            @click="goBack"
          >
            返回首页
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useTrainingStore } from "@/stores/training";
import { formatTime } from "@/lib/timer";
import { useShortcuts } from "@/lib/shortcuts";
import { getQuestions, generateFillQuestions, generateDebugQuestions } from "@/lib/questionService";
import { tokenizeLine } from "@/lib/trainTyping";

const router = useRouter();
const store = useTrainingStore();
const inputRef = ref(null);

const timeOptions = [30, 60, 120, 180];
const languages = ["Java", "Python", "C++", "JavaScript"];
const modeOptions = [
  { id: "mixed", label: "混合" },
  { id: "copy", label: "临摹" },
  { id: "fill", label: "填空" },
  { id: "debug", label: "改错" },
];

const config = ref({ time: 60, language: "Java", mode: "mixed" });
const isRunning = ref(false);
const isFinished = ref(false);
const timeLeft = ref(60);
const score = ref(0);
const combo = ref(0);
const maxCombo = ref(0);
const currentIndex = ref(0);
const totalCorrect = ref(0);
const totalQuestions = ref(0);
const questions = ref([]);
const currentQuestion = ref(null);
const currentLine = ref("");
const submittedLines = ref([]);
const currentTokens = ref([]);
const showHint = ref(false);
const hint = ref("");
let timerInterval = null;

const accuracy = computed(() => {
  if (totalQuestions.value === 0) {return 0;}
  return Math.round((totalCorrect.value / totalQuestions.value) * 100);
});

const questionTypeLabel = computed(() => {
  if (!currentQuestion.value) {return "";}
  const type = currentQuestion.value.type;
  if (type === "fill_blank") {return "填空题";}
  if (type === "debug") {return "改错题";}
  return "临摹题";
});

const displayLines = computed(() => {
  if (!currentQuestion.value) {return [];}
  const code = currentQuestion.value.code_with_bug || currentQuestion.value.code;
  return code.split("\n");
});

const refLines = computed(() => {
  if (!currentQuestion.value) {return [];}
  return (currentQuestion.value.correct_code || currentQuestion.value.code).split("\n");
});

useShortcuts({ "ctrl+Enter": () => submitLine(), "ctrl+N": () => {}, "ctrl+R": () => {} });

function goBack() { router.push("/"); }

async function loadQuestions() {
  const lang = config.value.language;
  const mode = config.value.mode;
  const count = 50;

  if (mode === "mixed") {
    const [copyQ, fillQ, debugQ] = await Promise.all([
      getQuestions(lang, "loop", 17),
      generateFillQuestions(lang, "loop", 17),
      generateDebugQuestions(lang, 16),
    ]);
    questions.value = [...copyQ, ...fillQ, ...debugQ];
  } else if (mode === "copy") {
    questions.value = await getQuestions(lang, "loop", count);
  } else if (mode === "fill") {
    questions.value = await generateFillQuestions(lang, "loop", count);
  } else if (mode === "debug") {
    questions.value = await generateDebugQuestions(lang, count);
  }

  shuffleArray(questions.value);
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

async function startChallenge() {
  await loadQuestions();
  if (questions.value.length === 0) {return;}

  isRunning.value = true;
  isFinished.value = false;
  timeLeft.value = config.value.time;
  score.value = 0;
  combo.value = 0;
  maxCombo.value = 0;
  currentIndex.value = 0;
  totalCorrect.value = 0;
  totalQuestions.value = 0;
  currentLine.value = "";
  submittedLines.value = [];
  currentTokens.value = [];

  loadCurrentQuestion();
  startTimer();
  nextTick(() => inputRef.value?.focus());
}

function loadCurrentQuestion() {
  if (currentIndex.value >= questions.value.length) {
    shuffleArray(questions.value);
    currentIndex.value = 0;
  }
  currentQuestion.value = questions.value[currentIndex.value];
  currentLine.value = "";
  submittedLines.value = [];
  currentTokens.value = [];
  showHint.value = false;
  hint.value = currentQuestion.value.explanation || "";
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft.value--;
    if (timeLeft.value <= 0) {
      finishChallenge();
    }
  }, 1000);
}

function finishChallenge() {
  clearInterval(timerInterval);
  isRunning.value = false;
  isFinished.value = true;

  store.addRecord({
    mode: "challenge",
    language: config.value.language,
    score: score.value,
    accuracy: accuracy.value,
    totalQuestions: totalQuestions.value,
    correct: totalCorrect.value,
    maxCombo: maxCombo.value,
    time: config.value.time,
  });
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
  if (e.isComposing) return; // IME 输入法组合中，不处理按键
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
    checkAnswer();
  }
}

function checkAnswer() {
  const submitted = submittedLines.value.join("\n").trim();
  const expected = refLines.value.join("\n").trim();
  const isCorrect = submitted === expected;

  totalQuestions.value++;

  if (isCorrect) {
    totalCorrect.value++;
    combo.value++;
    if (combo.value > maxCombo.value) {maxCombo.value = combo.value;}
    score.value += 10 + combo.value * 2;
  } else {
    combo.value = 0;
  }

  currentIndex.value++;
  loadCurrentQuestion();
  nextTick(() => inputRef.value?.focus());
}

onUnmounted(() => clearInterval(timerInterval));
</script>

<style scoped>
.challenge-layout { display: flex; height: 100vh; background: var(--bg-main, #F9FAFB); }
.sidebar { width: 260px; background: var(--bg-card, #fff); border-right: 1px solid var(--border, #e5e7eb); display: flex; flex-direction: column; padding: 20px; }
.sidebar-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
.btn-back { background: none; border: none; cursor: pointer; font-size: 14px; color: var(--text-secondary, #6b7280); }
.sidebar-title { font-size: 16px; font-weight: 600; color: var(--text-primary, #111827); }
.timer-section { text-align: center; margin-bottom: 20px; }
.timer-display { font-size: 36px; font-weight: 700; font-family: monospace; color: var(--primary, #2563EB); }
.timer-display.urgent { color: #ef4444; animation: pulse 1s infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
.timer-label { font-size: 12px; color: var(--text-secondary, #6b7280); margin-top: 4px; }
.score-section { margin-bottom: 20px; }
.score-row { display: flex; justify-content: space-between; padding: 6px 0; }
.score-label { font-size: 13px; color: var(--text-secondary, #6b7280); }
.score-value { font-size: 14px; font-weight: 600; color: var(--text-primary, #111827); }
.score-value.combo { color: #f59e0b; }
.config-section { flex: 1; }
.config-label { font-size: 13px; font-weight: 600; color: var(--text-primary, #111827); margin-bottom: 8px; }
.config-group { margin-bottom: 12px; }
.config-sublabel { font-size: 11px; color: var(--text-secondary, #6b7280); margin-bottom: 4px; }
.config-options { display: flex; flex-wrap: wrap; gap: 4px; }
.config-btn { padding: 4px 8px; border: 1px solid var(--border, #e5e7eb); border-radius: 6px; background: var(--bg-main, #F9FAFB); cursor: pointer; font-size: 12px; color: var(--text-primary, #111827); }
.config-btn.selected { background: var(--primary, #2563EB); color: #fff; border-color: var(--primary, #2563EB); }
.config-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-start { width: 100%; padding: 10px; margin-top: 12px; }
.btn { padding: 8px 16px; border-radius: 8px; font-size: 14px; cursor: pointer; border: 1px solid var(--border, #e5e7eb); }
.btn-primary { background: var(--primary, #2563EB); color: #fff; border: none; }
.btn-secondary { background: var(--bg-card, #fff); color: var(--text-primary, #111827); }
.main-area { flex: 1; display: flex; flex-direction: column; padding: 20px; overflow: hidden; }
.start-screen { display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; }
.start-screen h1 { font-size: 24px; margin-bottom: 12px; color: var(--text-primary, #111827); }
.start-screen p { color: var(--text-secondary, #6b7280); margin-bottom: 4px; }
.question-panel { margin-bottom: 12px; }
.input-panel { flex: 1; display: flex; flex-direction: column; }
.panel-header { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: var(--bg-card, #fff); border: 1px solid var(--border, #e5e7eb); border-bottom: none; border-radius: 8px 8px 0 0; }
.panel-title { font-size: 13px; font-weight: 600; color: var(--text-primary, #111827); }
.question-num { font-size: 12px; color: var(--text-secondary, #6b7280); }
.hint-text { font-size: 12px; color: #f59e0b; }
.code-block { background: var(--bg-code, #1e1e1e); border: 1px solid var(--border, #e5e7eb); border-radius: 0 0 8px 8px; padding: 12px; font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 1.6; overflow: auto; flex: 1; }
.code-line { display: flex; }
.code-line.active { background: rgba(37, 99, 235, 0.1); }
.line-no { width: 30px; color: #6b7280; text-align: right; margin-right: 12px; user-select: none; }
.line-text { flex: 1; color: #d4d4d4; white-space: pre; }
.line-text.correct { color: #4ade80; }
.line-text.wrong { color: #f87171; }
.token.keyword { color: #569cd6; }
.token.builtin { color: #4ec9b0; }
.token.string { color: #ce9178; }
.token.number { color: #b5cea8; }
.token.type { color: #4ec9b0; }
.token.delimiter { color: #d4d4d4; }
.token.identifier { color: #d4d4d4; }
.token.correct { color: #4ade80; }
.token.wrong { color: #f87171; text-decoration: underline wavy; }
.token.extra { color: #f59e0b; }
.cursor { display: inline-block; width: 2px; height: 14px; background: var(--primary, #2563EB); animation: blink 1s infinite; vertical-align: text-bottom; }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
.hidden-input { position: absolute; opacity: 0; width: 0; height: 0; }
.result-screen { display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; }
.result-screen h1 { font-size: 24px; margin-bottom: 24px; color: var(--text-primary, #111827); }
.result-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px; }
.stat-item { text-align: center; padding: 16px; background: var(--bg-card, #fff); border: 1px solid var(--border, #e5e7eb); border-radius: 8px; }
.stat-value { font-size: 28px; font-weight: 700; color: var(--primary, #2563EB); }
.stat-label { font-size: 12px; color: var(--text-secondary, #6b7280); margin-top: 4px; }
.result-actions { display: flex; gap: 12px; }

/* 移动端响应式 */
@media (max-width: 768px) {
  .challenge-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    max-height: 150px;
    padding: 12px;
  }

  .timer-display {
    font-size: 28px;
  }

  .code-area {
    padding: 12px;
  }

  .code-line {
    font-size: 12px;
  }

  .result-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .stat-value {
    font-size: 24px;
  }
}
</style>
