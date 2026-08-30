<template>
  <div class="reflex-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <button
          class="btn-back"
          @click="goBack"
        >
          ← 返回
        </button>
        <span class="sidebar-title">限时速写</span>
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
          <span class="score-label">最高连击</span>
          <span class="score-value">{{ maxCombo }}</span>
        </div>
      </div>
      <div class="config-section">
        <div class="config-label">
          时长设置
        </div>
        <div class="config-options">
          <button
            v-for="t in timeOptions"
            :key="t"
            class="config-btn"
            :class="{ selected: selectedTime === t }"
            :disabled="isRunning"
            @click="selectedTime = t"
          >
            {{ t }}s
          </button>
        </div>
      </div>
      <button
        class="btn btn-primary btn-start"
        :disabled="isRunning"
        @click="startGame"
      >
        {{ isRunning ? '进行中...' : '开始挑战' }}
      </button>
    </aside>

    <main class="main-area">
      <div
        v-if="!isRunning && !isFinished"
        class="start-screen"
      >
        <h1>限时速写挑战</h1>
        <p>在限定时间内尽可能多地完成代码临摹</p>
        <p>连续正确可获得连击加成</p>
      </div>

      <template v-if="isRunning">
        <div class="code-panel">
          <div class="panel-header">
            <span class="panel-title">参考代码</span>
            <span class="question-num">第 {{ currentIndex + 1 }} 题</span>
          </div>
          <div class="code-block">
            <div
              v-for="(line, i) in refLines"
              :key="i"
              class="code-line"
            >
              <span class="line-no">{{ i + 1 }}</span>
              <span class="line-text">{{ line }}</span>
            </div>
          </div>
        </div>

        <div class="code-panel">
          <div class="panel-header">
            <span class="panel-title">你的输入</span>
          </div>
          <div class="code-block">
            <div
              v-for="(line, i) in submittedLines"
              :key="'s' + i"
              class="code-line"
              :class="getLineStatus(i)"
            >
              <span class="line-no">{{ i + 1 }}</span>
              <span class="line-text">{{ line }}</span>
              <span class="line-icon">{{ getLineIcon(i) }}</span>
            </div>
            <div class="code-line active-line">
              <span class="line-no">{{ submittedLines.length + 1 }}</span>
              <input
                ref="inputRef"
                v-model="currentLine"
                class="line-input"
                spellcheck="false"
                @keydown.enter.prevent="(e) => { if (!e.isComposing) submitLine() }"
                @keydown.tab.prevent="addTab"
                @keydown.backspace="handleBackspace"
              >
            </div>
          </div>
        </div>
      </template>

      <div
        v-if="isFinished"
        class="result-screen"
      >
        <h2>挑战结束</h2>
        <div class="result-grid">
          <div class="result-item">
            <div class="result-value">
              {{ score }}
            </div>
            <div class="result-label">
              总得分
            </div>
          </div>
          <div class="result-item">
            <div class="result-value">
              {{ completedQuestions }}
            </div>
            <div class="result-label">
              完成题数
            </div>
          </div>
          <div class="result-item">
            <div class="result-value">
              {{ correctCount }}
            </div>
            <div class="result-label">
              正确数
            </div>
          </div>
          <div class="result-item">
            <div class="result-value">
              {{ maxCombo }}
            </div>
            <div class="result-label">
              最高连击
            </div>
          </div>
        </div>
        <div class="result-actions">
          <button
            class="btn btn-primary"
            @click="startGame"
          >
            再来一次
          </button>
          <button
            class="btn"
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
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getQuestions } from "@/lib/questionService";
import { normalizeCode } from "@/lib/utils";
import { recordSession } from "@/lib/recordManager";
import { useAchievementStore } from "@/stores/achievement";
import { useSkillTreeStore } from "@/stores/skillTree";

const route = useRoute();
const router = useRouter();
const achievementStore = useAchievementStore();
const skillTree = useSkillTreeStore();

const inputRef = ref(null);
const timeOptions = [30, 60, 90, 120];
const selectedTime = ref(60);
const timeLeft = ref(0);
const isRunning = ref(false);
const isFinished = ref(false);
const score = ref(0);
const combo = ref(0);
const maxCombo = ref(0);
const questions = ref([]);
const currentIndex = ref(0);
const currentLine = ref("");
const submittedLines = ref([]);
const results = ref([]);
const correctCount = ref(0);
const completedQuestions = ref(0);
let timerInterval = null;

const language = computed(() => route.query.lang || "Java");
const module = computed(() => route.query.module || "loop");

const refCode = computed(() => {
  const q = questions.value[currentIndex.value];
  return q ? q.code : "";
});

const refLines = computed(() => refCode.value.split("\n"));

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function getLineStatus(i) {
  const ref = refLines.value[i];
  const input = submittedLines.value[i];
  if (!ref || !input) {return "";}
  return ref.trim() === input.trim() ? "line-ok" : "line-fail";
}

function getLineIcon(i) {
  const ref = refLines.value[i];
  const input = submittedLines.value[i];
  if (!ref || !input) {return "";}
  return ref.trim() === input.trim() ? "✓" : "✗";
}

function addTab() {
  currentLine.value += "    ";
}

function handleBackspace() {
  if (currentLine.value === "" && submittedLines.value.length > 0) {
    currentLine.value = submittedLines.value.pop();
  }
}

function submitLine() {
  submittedLines.value.push(currentLine.value);
  currentLine.value = "";
  if (submittedLines.value.length >= refLines.value.length) {
    checkAnswer();
  }
}

function checkAnswer() {
  const userCode = submittedLines.value.join("\n");
  const isCorrect = normalizeCode(userCode) === normalizeCode(refCode.value);

  completedQuestions.value++;

  if (isCorrect) {
    correctCount.value++;
    combo.value++;
    maxCombo.value = Math.max(maxCombo.value, combo.value);
    score.value += 10 + (combo.value - 1) * 5;
    results.value.push({ correct: true });
  } else {
    combo.value = 0;
    results.value.push({ correct: false });
  }

  setTimeout(() => {
    nextQuestion();
  }, 300);
}

function nextQuestion() {
  currentIndex.value = (currentIndex.value + 1) % questions.value.length;
  submittedLines.value = [];
  currentLine.value = "";
  nextTick(() => inputRef.value?.focus());
}

async function startGame() {
  const lang = language.value;
  const mod = module.value;
  questions.value = await getQuestions(lang, mod, 50);

  if (questions.value.length === 0) {return;}

  timeLeft.value = selectedTime.value;
  isRunning.value = true;
  isFinished.value = false;
  score.value = 0;
  combo.value = 0;
  maxCombo.value = 0;
  currentIndex.value = 0;
  submittedLines.value = [];
  currentLine.value = "";
  results.value = [];
  correctCount.value = 0;
  completedQuestions.value = 0;

  timerInterval = setInterval(() => {
    timeLeft.value--;
    if (timeLeft.value <= 0) {
      endGame();
    }
  }, 1000);

  nextTick(() => inputRef.value?.focus());
}

function endGame() {
  isRunning.value = false;
  isFinished.value = true;
  clearInterval(timerInterval);

  const accuracy = completedQuestions.value > 0 ? Math.round((correctCount.value / completedQuestions.value) * 100) : 0;

  recordSession({
    mode: "reflex",
    language: language.value,
    module: module.value,
    total: completedQuestions.value,
    correct: correctCount.value,
    accuracy,
    totalTime: selectedTime.value,
    avgTime: completedQuestions.value > 0 ? (selectedTime.value / completedQuestions.value).toFixed(1) : "0",
    score: score.value,
    maxCombo: maxCombo.value,
  });

  // 更新技能树
  skillTree.recordSessionReward("reflex", module.value, correctCount.value, completedQuestions.value, maxCombo.value);

  // 更新成就
  achievementStore.updateStats({
    totalSessions: (achievementStore.stats.totalSessions || 0) + 1,
    totalQuestions: (achievementStore.stats.totalQuestions || 0) + completedQuestions.value,
    accuracy,
    maxCombo: Math.max(achievementStore.stats.maxCombo || 0, maxCombo.value),
  });
}

function goBack() {
  clearInterval(timerInterval);
  router.push("/");
}

onMounted(() => {
  // 预加载题目
});

onUnmounted(() => {
  clearInterval(timerInterval);
});
</script>

<style scoped>
.reflex-layout {
  flex: 1;
  display: flex;
  overflow: hidden;
}

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

.btn-back:hover {
  text-decoration: underline;
}

.sidebar-title {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-900);
}

.timer-section {
  padding: var(--space-5);
  text-align: center;
  border-bottom: 1px solid var(--border);
}

.timer-display {
  font-size: var(--text-2xl);
  font-weight: 700;
  font-family: var(--mono);
  color: var(--accent-10);
}

.timer-display.urgent {
  color: var(--incorrect);
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.timer-label {
  font-size: var(--text-xs);
  color: var(--text-400);
  margin-top: var(--space-1);
}

.score-section {
  padding: var(--space-4);
  border-bottom: 1px solid var(--border);
}

.score-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2) 0;
}

.score-label {
  font-size: var(--text-xs);
  color: var(--text-400);
}

.score-value {
  font-size: var(--text-lg);
  font-weight: 700;
  font-family: var(--mono);
  color: var(--text-900);
}

.score-value.combo {
  color: var(--correct);
}

.config-section {
  padding: var(--space-4);
  border-bottom: 1px solid var(--border);
}

.config-label {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-400);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-2);
}

.config-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-2);
}

.config-btn {
  padding: var(--space-2);
  font-size: var(--text-xs);
  font-weight: 600;
  font-family: var(--mono);
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--text-700);
  transition: all 150ms ease;
}

.config-btn:hover:not(:disabled) {
  border-color: var(--text-400);
}

.config-btn.selected {
  background: var(--accent-10);
  border-color: var(--accent-10);
  color: white;
}

.config-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-start {
  width: calc(100% - var(--space-8));
  margin: var(--space-4);
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-image:
    linear-gradient(var(--grid-color) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
  background-size: 24px 24px;
}

.start-screen, .result-screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-8);
}

.start-screen h1, .result-screen h2 {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--text-900);
  margin-bottom: var(--space-4);
}

.start-screen p {
  font-size: var(--text-base);
  color: var(--text-500);
  margin-bottom: var(--space-2);
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
  margin-bottom: var(--space-8);
}

.result-item {
  text-align: center;
  padding: var(--space-5);
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}

.result-value {
  font-size: var(--text-xl);
  font-weight: 700;
  font-family: var(--mono);
  color: var(--accent-10);
}

.result-label {
  font-size: var(--text-xs);
  color: var(--text-400);
  margin-top: var(--space-1);
}

.result-actions {
  display: flex;
  gap: var(--space-3);
}

.code-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-bottom: 1px solid var(--border);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2) var(--space-4);
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
}

.panel-title {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.question-num {
  font-size: var(--text-xs);
  color: var(--text-400);
  font-family: var(--mono);
}

.code-block {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-3) 0;
  background: var(--bg-card);
  font-family: var(--mono);
  font-size: var(--text-sm);
  line-height: 1.7;
}

.code-line {
  display: flex;
  padding: 0 var(--space-4);
  min-height: 24px;
}

.line-no {
  width: 36px;
  text-align: right;
  padding-right: var(--space-3);
  color: var(--text-400);
  user-select: none;
  flex-shrink: 0;
  font-size: var(--text-xs);
}

.line-text {
  flex: 1;
  white-space: pre;
  overflow-x: auto;
}

.line-icon {
  width: 24px;
  text-align: center;
  flex-shrink: 0;
  font-weight: 700;
}

.line-ok {
  background: var(--correct-bg);
}

.line-ok .line-icon {
  color: var(--correct);
}

.line-fail {
  background: var(--incorrect-bg);
}

.line-fail .line-icon {
  color: var(--incorrect);
}

.active-line {
  background: rgba(37, 99, 235, 0.04);
  border-left: 3px solid var(--accent-10);
}

.line-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-family: var(--mono);
  font-size: var(--text-sm);
  color: var(--text-900);
  line-height: 1.7;
}

/* 移动端响应式 */
@media (max-width: 768px) {
  .reflex-layout {
    padding: var(--space-4);
  }

  .config-section {
    padding: var(--space-4);
  }

  .config-grid {
    grid-template-columns: 1fr;
    gap: var(--space-3);
  }

  .timer-display {
    font-size: 48px;
  }

  .code-area {
    padding: var(--space-3);
  }

  .code-line {
    font-size: 12px;
  }

  .result-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
