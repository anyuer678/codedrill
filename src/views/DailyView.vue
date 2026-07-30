<template>
  <div class="daily-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <button
          class="btn-back"
          @click="goBack"
        >
          ← 返回
        </button>
        <span class="sidebar-title">每日挑战</span>
      </div>

      <div class="timer-section">
        <div
          class="timer-display"
          :class="{ urgent: timeLeft <= 30 }"
        >
          {{ formatTime(timeLeft) }}
        </div>
        <div class="timer-label">
          剩余时间
        </div>
      </div>

      <div class="challenge-info">
        <div class="info-row">
          <span class="info-label">语言</span>
          <span class="info-value">{{ challenge.language }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">模块</span>
          <span class="info-value">{{ moduleLabel }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">题目</span>
          <span class="info-value">{{ challenge.questionCount }} 题</span>
        </div>
      </div>

      <div class="streak-section">
        <div class="streak-value">
          {{ streak }}
        </div>
        <div class="streak-label">
          连续天数
        </div>
      </div>

      <div class="progress-section">
        <div class="progress-text">
          {{ currentIndex + 1 }} / {{ questions.length }}
        </div>
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: progressPercent + '%' }"
          />
        </div>
      </div>
    </aside>

    <main class="main-area">
      <div
        v-if="!started"
        class="start-screen"
      >
        <div class="challenge-icon">
          📅
        </div>
        <h1>每日挑战</h1>
        <p>每天固定题目，坚持训练</p>
        <div class="challenge-preview">
          <div class="preview-item">
            <span class="preview-label">语言</span>
            <span class="preview-value">{{ challenge.language }}</span>
          </div>
          <div class="preview-item">
            <span class="preview-label">模块</span>
            <span class="preview-value">{{ moduleLabel }}</span>
          </div>
          <div class="preview-item">
            <span class="preview-label">时间</span>
            <span class="preview-value">5 分钟</span>
          </div>
        </div>
        <button
          class="btn btn-primary btn-start"
          @click="startChallenge"
        >
          {{ challenge.completed ? '再次挑战' : '开始挑战' }}
        </button>
        <div
          v-if="challenge.completed"
          class="best-score"
        >
          最佳成绩：{{ challenge.score }} 分 / {{ challenge.accuracy }}%
        </div>
      </div>

      <template v-if="started && !finished">
        <div class="code-panel">
          <div class="panel-header">
            <span class="panel-title">参考代码</span>
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
            <span class="score-display">得分: {{ score }}</span>
          </div>
          <div class="code-block">
            <div
              v-for="(line, i) in submittedLines"
              :key="'s' + i"
              class="code-line"
            >
              <span class="line-no">{{ i + 1 }}</span>
              <span class="line-text">{{ line }}</span>
              <span class="line-status">{{ getLineStatus(i) }}</span>
            </div>
            <div class="code-line active-line">
              <span class="line-no">{{ submittedLines.length + 1 }}</span>
              <input
                ref="inputRef"
                v-model="currentLine"
                class="line-input"
                spellcheck="false"
                @keydown.enter.prevent="submitLine"
                @keydown.tab.prevent="addTab"
                @keydown.backspace="handleBackspace"
              >
            </div>
          </div>
        </div>
      </template>

      <div
        v-if="finished"
        class="result-screen"
      >
        <div class="result-icon">
          {{ resultEmoji }}
        </div>
        <h2>{{ resultTitle }}</h2>
        <div class="result-grid">
          <div class="result-item main-score">
            <div class="result-value">
              {{ score }}
            </div>
            <div class="result-label">
              得分
            </div>
          </div>
          <div class="result-item">
            <div class="result-value">
              {{ correctCount }}/{{ questions.length }}
            </div>
            <div class="result-label">
              正确/总数
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
          <div class="result-item">
            <div class="result-value">
              {{ streak }}
            </div>
            <div class="result-label">
              连续天数
            </div>
          </div>
        </div>
        <div class="result-actions">
          <button
            class="btn btn-primary"
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
import { useRouter } from "vue-router";
import { getDailyChallenge, loadDailyQuestions, saveChallengeResult, getStreak } from "@/lib/dailyChallenge";
import { normalizeCode } from "@/lib/utils";
import { recordSession } from "@/lib/recordManager";
import { useAchievementStore } from "@/stores/achievement";
import { useSkillTreeStore } from "@/stores/skillTree";

const router = useRouter();
const achievementStore = useAchievementStore();
const skillTree = useSkillTreeStore();

const moduleLabels = {
  loop: "循环",
  condition: "条件",
  array: "数组",
  string: "字符串",
  function: "函数",
};

const challenge = ref(getDailyChallenge());
const questions = ref([]);
const streak = ref(getStreak());
const started = ref(false);
const finished = ref(false);
const currentIndex = ref(0);
const currentLine = ref("");
const submittedLines = ref([]);
const results = ref([]);
const score = ref(0);
const correctCount = ref(0);
const timeLeft = ref(300);
const inputRef = ref(null);
let timerInterval = null;

const moduleLabel = computed(() => moduleLabels[challenge.value.module] || challenge.value.module);

const refCode = computed(() => {
  const q = questions.value[currentIndex.value];
  return q ? q.code : "";
});

const refLines = computed(() => refCode.value.split("\n"));

const progressPercent = computed(() => {
  if (questions.value.length === 0) {return 0;}
  return Math.round(((currentIndex.value + 1) / questions.value.length) * 100);
});

const accuracy = computed(() => {
  if (questions.value.length === 0) {return 0;}
  return Math.round((correctCount.value / questions.value.length) * 100);
});

const resultEmoji = computed(() => {
  if (accuracy.value >= 90) {return "🏆";}
  if (accuracy.value >= 70) {return "⭐";}
  if (accuracy.value >= 50) {return "👍";}
  return "💪";
});

const resultTitle = computed(() => {
  if (accuracy.value >= 90) {return "完美通关！";}
  if (accuracy.value >= 70) {return "表现不错！";}
  if (accuracy.value >= 50) {return "继续努力！";}
  return "再接再厉！";
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

  results.value[currentIndex.value] = { correct: isCorrect };

  if (isCorrect) {
    correctCount.value++;
    score.value += 10;
  }

  setTimeout(() => {
    if (currentIndex.value < questions.value.length - 1) {
      currentIndex.value++;
      submittedLines.value = [];
      currentLine.value = "";
      nextTick(() => inputRef.value?.focus());
    } else {
      endChallenge();
    }
  }, 300);
}

async function startChallenge() {
  questions.value = await loadDailyQuestions();
  timeLeft.value = challenge.value.timeLimit;
  started.value = true;
  finished.value = false;
  currentIndex.value = 0;
  submittedLines.value = [];
  currentLine.value = "";
  results.value = [];
  score.value = 0;
  correctCount.value = 0;

  timerInterval = setInterval(() => {
    timeLeft.value--;
    if (timeLeft.value <= 0) {
      endChallenge();
    }
  }, 1000);

  nextTick(() => inputRef.value?.focus());
}

function endChallenge() {
  finished.value = true;
  started.value = false;
  clearInterval(timerInterval);

  saveChallengeResult(results.value, score.value);
  streak.value = getStreak();

  const accuracy = questions.value.length > 0 ? Math.round((correctCount.value / questions.value.length) * 100) : 0;

  // 记录训练
  recordSession({
    mode: "daily",
    language: challenge.value.language,
    module: challenge.value.module,
    total: questions.value.length,
    correct: correctCount.value,
    accuracy,
    totalTime: challenge.value.timeLimit,
    avgTime: questions.value.length > 0 ? (challenge.value.timeLimit / questions.value.length).toFixed(1) : "0",
    score: score.value,
  });

  // 更新技能树
  skillTree.recordSessionReward("daily", challenge.value.module, correctCount.value, questions.value.length, 0);

  // 更新成就
  achievementStore.updateStats({
    totalSessions: (achievementStore.stats.totalSessions || 0) + 1,
    totalQuestions: (achievementStore.stats.totalQuestions || 0) + questions.value.length,
    accuracy,
  });
}

function goBack() {
  clearInterval(timerInterval);
  router.push("/");
}

onMounted(async () => {
  if (!challenge.value.completed) {
    questions.value = await loadDailyQuestions();
  }
});

onUnmounted(() => {
  clearInterval(timerInterval);
});
</script>

<style scoped>
.daily-layout {
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
}

.timer-section {
  padding: var(--space-4);
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

.challenge-info {
  padding: var(--space-3);
  border-bottom: 1px solid var(--border);
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: var(--space-1) 0;
}

.info-label {
  font-size: var(--text-xs);
  color: var(--text-400);
}

.info-value {
  font-size: var(--text-xs);
  font-weight: 600;
}

.streak-section {
  padding: var(--space-4);
  text-align: center;
  border-bottom: 1px solid var(--border);
}

.streak-value {
  font-size: var(--text-2xl);
  font-weight: 700;
  font-family: var(--mono);
  color: var(--warning);
}

.streak-label {
  font-size: var(--text-xs);
  color: var(--text-400);
}

.progress-section {
  padding: var(--space-3);
}

.progress-text {
  font-size: var(--text-xs);
  color: var(--text-400);
  text-align: center;
  margin-bottom: var(--space-2);
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

.challenge-icon, .result-icon {
  font-size: 64px;
  margin-bottom: var(--space-4);
}

.start-screen h1, .result-screen h2 {
  font-size: var(--text-xl);
  font-weight: 700;
  margin-bottom: var(--space-4);
}

.start-screen p {
  font-size: var(--text-base);
  color: var(--text-500);
  margin-bottom: var(--space-6);
}

.challenge-preview {
  display: flex;
  gap: var(--space-6);
  margin-bottom: var(--space-6);
}

.preview-item {
  text-align: center;
}

.preview-label {
  display: block;
  font-size: var(--text-xs);
  color: var(--text-400);
  margin-bottom: var(--space-1);
}

.preview-value {
  font-size: var(--text-base);
  font-weight: 600;
}

.btn-start {
  padding: var(--space-3) var(--space-8);
}

.best-score {
  margin-top: var(--space-4);
  font-size: var(--text-sm);
  color: var(--text-400);
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
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
  background: rgba(37, 99, 235, 0.1);
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

.score-display {
  font-size: var(--text-sm);
  font-weight: 700;
  font-family: var(--mono);
  color: var(--accent-10);
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

.line-text {
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
  .daily-layout {
    padding: var(--space-4);
  }

  .daily-header {
    flex-direction: column;
    gap: var(--space-3);
    align-items: flex-start;
  }

  .streak-info {
    flex-wrap: wrap;
    gap: var(--space-2);
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
