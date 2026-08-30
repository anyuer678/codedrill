<template>
  <div class="arena-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <button
          class="btn-back"
          @click="goBack"
        >
          ← 返回
        </button>
        <span class="sidebar-title">竞技场</span>
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
        <div class="score-main">
          <div class="score-value">
            {{ score }}
          </div>
          <div class="score-label">
            得分
          </div>
        </div>
        <div
          class="combo-display"
          :class="{ active: combo > 0 }"
        >
          <div class="combo-value">
            {{ combo }}x
          </div>
          <div class="combo-label">
            连击
          </div>
        </div>
      </div>

      <div class="stats-section">
        <div class="stat-row">
          <span class="stat-label">正确</span>
          <span class="stat-value ok">{{ correctCount }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">错误</span>
          <span class="stat-value fail">{{ wrongCount }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">最高连击</span>
          <span class="stat-value">{{ maxCombo }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">完成</span>
          <span class="stat-value">{{ completedCount }}</span>
        </div>
      </div>

      <div class="config-section">
        <div class="config-label">
          时长
        </div>
        <div class="config-options">
          <button
            v-for="t in [30, 60, 90, 120]"
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
        @click="startArena"
      >
        {{ isRunning ? '进行中...' : '开始挑战' }}
      </button>
    </aside>

    <main class="main-area">
      <div
        v-if="!isRunning && !isFinished"
        class="start-screen"
      >
        <div class="arena-icon">
          ⚔️
        </div>
        <h1>竞技场挑战</h1>
        <p>在限定时间内完成尽可能多的题目</p>
        <p>连续正确获得连击加成</p>
        <div class="combo-info">
          <div class="combo-item">
            <span class="combo-mult">2x</span>
            <span>5连击</span>
          </div>
          <div class="combo-item">
            <span class="combo-mult">3x</span>
            <span>10连击</span>
          </div>
          <div class="combo-item">
            <span class="combo-mult">5x</span>
            <span>20连击</span>
          </div>
        </div>
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
              <span class="line-content">{{ line }}</span>
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
            >
              <span class="line-no">{{ i + 1 }}</span>
              <span class="line-content">{{ line }}</span>
              <span class="line-status">{{ getLineStatus(i) }}</span>
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
        <div class="result-icon">
          🏆
        </div>
        <h2>挑战结束</h2>
        <div class="result-grid">
          <div class="result-item main-score">
            <div class="result-value">
              {{ score }}
            </div>
            <div class="result-label">
              总得分
            </div>
          </div>
          <div class="result-item">
            <div class="result-value">
              {{ completedCount }}
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
              {{ maxCombo }}x
            </div>
            <div class="result-label">
              最高连击
            </div>
          </div>
          <div class="result-item">
            <div class="result-value">
              {{ accuracy }}%
            </div>
            <div class="result-label">
              正确率
            </div>
          </div>
        </div>
        <div class="result-actions">
          <button
            class="btn btn-primary"
            @click="startArena"
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
import { ref, computed, onUnmounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getQuestions } from "@/lib/questionService";
import { normalizeCode } from "@/lib/utils";
import { recordSession } from "@/lib/recordManager";
import { useSkillTreeStore } from "@/stores/skillTree";
import { useAchievementStore } from "@/stores/achievement";

const route = useRoute();
const router = useRouter();
const skillStore = useSkillTreeStore();
const achievementStore = useAchievementStore();

const inputRef = ref(null);
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
const correctCount = ref(0);
const wrongCount = ref(0);
const completedCount = ref(0);
let timerInterval = null;

const language = computed(() => route.query.lang || "Java");
const module = computed(() => route.query.module || "loop");

const refCode = computed(() => {
  const q = questions.value[currentIndex.value];
  return q ? q.code : "";
});

const refLines = computed(() => refCode.value.split("\n"));

const accuracy = computed(() => {
  if (completedCount.value === 0) {return 0;}
  return Math.round((correctCount.value / completedCount.value) * 100);
});

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function getLineStatus(i) {
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

  completedCount.value++;

  if (isCorrect) {
    correctCount.value++;
    combo.value++;
    maxCombo.value = Math.max(maxCombo.value, combo.value);

    // 连击加成
    let multiplier = 1;
    if (combo.value >= 20) {multiplier = 5;}
    else if (combo.value >= 10) {multiplier = 3;}
    else if (combo.value >= 5) {multiplier = 2;}

    score.value += 10 * multiplier;
  } else {
    wrongCount.value++;
    combo.value = 0;
  }

  setTimeout(() => {
    nextQuestion();
  }, 200);
}

function nextQuestion() {
  currentIndex.value = (currentIndex.value + 1) % questions.value.length;
  submittedLines.value = [];
  currentLine.value = "";
  nextTick(() => inputRef.value?.focus());
}

async function startArena() {
  questions.value = await getQuestions(language.value, module.value, 100);
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
  correctCount.value = 0;
  wrongCount.value = 0;
  completedCount.value = 0;

  timerInterval = setInterval(() => {
    timeLeft.value--;
    if (timeLeft.value <= 0) {
      endArena();
    }
  }, 1000);

  nextTick(() => inputRef.value?.focus());
}

function endArena() {
  isRunning.value = false;
  isFinished.value = true;
  clearInterval(timerInterval);

  // 记录训练
  recordSession({
    mode: "arena",
    language: language.value,
    module: module.value,
    total: completedCount.value,
    correct: correctCount.value,
    accuracy: accuracy.value,
    totalTime: selectedTime.value,
    avgTime: completedCount.value > 0 ? (selectedTime.value / completedCount.value).toFixed(1) : "0",
    score: score.value,
    maxCombo: maxCombo.value,
  });

  // 奖励技能树经验
  skillStore.recordSessionReward("arena", module.value, correctCount.value, completedCount.value, maxCombo.value);

  // 更新成就
  achievementStore.updateStats({
    totalSessions: (achievementStore.stats.totalSessions || 0) + 1,
    totalQuestions: (achievementStore.stats.totalQuestions || 0) + completedCount.value,
    accuracy: accuracy.value,
    maxCombo: Math.max(achievementStore.stats.maxCombo || 0, maxCombo.value),
  });
}

function goBack() {
  clearInterval(timerInterval);
  router.push("/");
}

onUnmounted(() => {
  clearInterval(timerInterval);
});
</script>

<style scoped>
.arena-layout {
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
}

.score-section {
  display: flex;
  border-bottom: 1px solid var(--border);
}

.score-main, .combo-display {
  flex: 1;
  padding: var(--space-4);
  text-align: center;
}

.score-main {
  border-right: 1px solid var(--border);
}

.score-value, .combo-value {
  font-size: var(--text-xl);
  font-weight: 700;
  font-family: var(--mono);
  color: var(--accent-10);
}

.combo-display.active .combo-value {
  color: var(--correct);
}

.score-label, .combo-label {
  font-size: var(--text-xs);
  color: var(--text-400);
}

.stats-section {
  padding: var(--space-3);
  border-bottom: 1px solid var(--border);
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2);
}

.stat-label {
  font-size: var(--text-xs);
  color: var(--text-400);
}

.stat-value {
  font-size: var(--text-sm);
  font-weight: 600;
  font-family: var(--mono);
}

.stat-value.ok { color: var(--correct); }
.stat-value.fail { color: var(--incorrect); }

.config-section {
  padding: var(--space-4);
  border-bottom: 1px solid var(--border);
}

.config-label {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-400);
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
}

.config-btn.selected {
  background: var(--accent-10);
  border-color: var(--accent-10);
  color: white;
}

.config-btn:disabled {
  opacity: 0.5;
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

.arena-icon, .result-icon {
  font-size: 64px;
  margin-bottom: var(--space-4);
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

.combo-info {
  display: flex;
  gap: var(--space-6);
  margin-top: var(--space-6);
}

.combo-item {
  text-align: center;
}

.combo-mult {
  display: block;
  font-size: var(--text-xl);
  font-weight: 700;
  font-family: var(--mono);
  color: var(--accent-10);
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.result-item {
  text-align: center;
  padding: var(--space-4);
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}

.result-item.main-score {
  background: rgba(37, 99, 235, 0.06);
  border-color: var(--accent-10);
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
  font-size: var(--text-xs);
}

.line-content {
  flex: 1;
  white-space: pre;
}

.line-status {
  width: 24px;
  text-align: center;
  font-weight: 700;
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
}

/* 移动端响应式 */
@media (max-width: 768px) {
  .arena-layout {
    padding: var(--space-3);
  }

  .arena-header {
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  .timer-bar {
    font-size: 36px;
  }

  .combo-display {
    font-size: 14px;
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
