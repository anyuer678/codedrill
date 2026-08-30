<template>
  <div class="train-layout">
    <TrainSidebar
      :current-index="trainingStore.currentIndex"
      :total="trainingStore.questions.length"
      :progress="trainingStore.progress"
      :results="trainingStore.results"
      :mode-label="modeLabel"
      @back="goBack"
      @help="showHelp = true"
      @go-to="goTo"
    />

    <main class="main-area">
      <div class="code-panels">
        <!-- 参考代码 -->
        <div class="code-panel">
          <div class="panel-header">
            <span class="panel-title">参考代码</span>
          </div>
          <div class="code-block ref-block">
            <CodeDisplay
              :code="refCode"
              :language="lang"
            />
          </div>
        </div>

        <!-- 输入区 -->
        <div class="code-panel">
          <div class="panel-header">
            <span class="panel-title">你的输入</span>
            <span class="timer">{{ formatTime(trainingStore.elapsedTime) }}</span>
          </div>
          <div class="code-block input-block">
            <!-- 已提交的行 -->
            <div
              v-for="(line, i) in submittedLines"
              :key="'s' + i"
              class="code-line"
            >
              <span class="line-no">{{ i + 1 }}</span>
              <span class="line-content">
                <span
                  v-for="(token, j) in compareLineTokens(line, i)"
                  :key="j"
                  class="token"
                  :class="token.status"
                >{{ token.text }}</span>
              </span>
              <span class="line-status">{{ getLineStatus(i) }}</span>
            </div>
            <!-- 当前输入行 - 逐词实时对比 -->
            <div
              class="code-line active-line"
              @click="focusInput"
            >
              <span class="line-no">{{ submittedLines.length + 1 }}</span>
              <span class="line-content">
                <span
                  v-for="(token, j) in currentTokens"
                  :key="j"
                  class="token"
                  :class="token.status"
                >{{ token.text }}</span>
                <span class="cursor" />
              </span>
              <input
                ref="inputRef"
                v-model="currentLine"
                class="hidden-input"
                spellcheck="false"
                autocomplete="off"
                autocapitalize="off"
                @keydown.enter.prevent="(e) => { if (!e.isComposing) submitLine() }"
                @keydown.tab.prevent="addTab"
                @keydown.backspace="handleBackspace"
                @input="onInput"
              >
            </div>
          </div>
          <!-- 操作按钮栏 -->
          <div class="action-bar">
            <button class="btn-save" @click="saveProgress" title="保存当前进度">
              💾 保存
            </button>
            <div class="action-hint">
              <span v-if="submittedLines.length < refLines.length">已输入 {{ submittedLines.length }}/{{ refLines.length }} 行</span>
              <span v-else class="ready-hint">可以提交了</span>
            </div>
            <button class="btn-submit" @click="doSubmit" title="提交答案">
              {{ submittedLines.length >= refLines.length ? '提交答案' : '提交当前' }}
            </button>
          </div>
        </div>
      </div>

      <TrainResultBar
        :visible="showResult"
        :ok="resultOk"
        :last-result="lastResult"
        :is-last="isLast"
        :show-diff="showDiff"
        @toggle-hint="showHint = !showHint"
        @toggle-diff="showDiff = !showDiff"
        @retry="retryQuestion"
        @next="nextQ"
      />

      <!-- 差异对比 -->
      <div
        v-if="showDiff && !resultOk"
        class="diff-section"
      >
        <DiffView
          :submitted="submittedLines.join('\n')"
          :expected="refCode"
        />
      </div>

      <!-- 提示 -->
      <div
        v-if="showHint && !resultOk && hint"
        class="hint-section"
      >
        <span class="hint-icon">💡</span>
        <span class="hint-text">{{ hint }}</span>
      </div>

      <!-- 代码补全 -->
      <CompletionPopup
        ref="completionRef"
        :suggestions="completions"
        :position="completionPosition"
        @select="acceptCompletion"
        @close="completions = []"
      />
    </main>

    <TrainStatsPanel
      :correct="trainingStore.sessionCorrect"
      :wrong="trainingStore.sessionWrong"
      :accuracy="trainingStore.sessionAccuracy"
      :avg-time="trainingStore.avgTime"
      :typing-speed="typingSpeed"
    />

    <!-- 快捷键帮助弹窗 -->
    <div
      v-if="showHelp"
      class="modal-overlay"
      @click="showHelp = false"
    >
      <div
        class="modal"
        @click.stop
      >
        <div class="modal-header">
          <span>快捷键</span>
          <button
            class="btn btn-sm"
            @click="showHelp = false"
          >
            ×
          </button>
        </div>
        <div class="modal-body">
          <div class="shortcut-list">
            <div class="shortcut-item">
              <span class="shortcut-key">Ctrl+Enter</span>
              <span class="shortcut-desc">提交答案</span>
            </div>
            <div class="shortcut-item">
              <span class="shortcut-key">Ctrl+N</span>
              <span class="shortcut-desc">下一题</span>
            </div>
            <div class="shortcut-item">
              <span class="shortcut-key">Ctrl+R</span>
              <span class="shortcut-desc">重新开始</span>
            </div>
            <div class="shortcut-item">
              <span class="shortcut-key">Esc</span>
              <span class="shortcut-desc">返回首页</span>
            </div>
            <div class="shortcut-item">
              <span class="shortcut-key">Tab</span>
              <span class="shortcut-desc">插入制表符</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTrainingStore } from "@/stores/training";
import { formatTime } from "@/lib/timer";
import { useShortcuts } from "@/lib/shortcuts";
import CodeDisplay from "@/components/CodeDisplay.vue";
import DiffView from "@/components/DiffView.vue";
import TrainSidebar from "@/components/TrainSidebar.vue";
import TrainStatsPanel from "@/components/TrainStatsPanel.vue";
import TrainResultBar from "@/components/TrainResultBar.vue";
import CompletionPopup from "@/components/CompletionPopup.vue";
import { getCompletions } from "@/lib/completionService";
import { tokenizeLine, diffLineTokens, lineEqualsTrimmed } from "@/lib/trainTyping";
import { useTypingSession } from "@/lib/useTypingSession";

const route = useRoute();
const router = useRouter();
const trainingStore = useTrainingStore();

// 页面关闭前自动保存进度
function handleBeforeUnload() {
  if (trainingStore.isRunning) {
    trainingStore.saveProgress();
  }
}

onMounted(() => {
  window.addEventListener("beforeunload", handleBeforeUnload);
});

onUnmounted(() => {
  window.removeEventListener("beforeunload", handleBeforeUnload);
});

const inputRef = ref(null);
const showResult = ref(false);
const lastResult = ref(null);
const resultOk = ref(false);
const showHelp = ref(false);
const showDiff = ref(false);
const showHint = ref(false);
const completionRef = ref(null);

const mode = computed(() => route.params.mode || "copy");
const lang = computed(() => route.query.lang || "Java");
const modeLabel = computed(() => {
  const map = { copy: "代码临摹", fill: "代码填空", debug: "改错练习" };
  return map[mode.value] || "";
});

// 提示信息
const hint = computed(() => {
  const q = trainingStore.currentQuestion;
  if (!q) {return "";}
  return q.explanation || q.hint || "";
});

const refCode = computed(() => {
  const q = trainingStore.currentQuestion;
  if (!q) {return "";}
  return mode.value === "debug" ? q.code_with_bug : q.code;
});

const refLines = computed(() => refCode.value.split("\n"));
const isLast = computed(() => trainingStore.currentIndex >= trainingStore.questions.length - 1);

// 输入行状态机（抽到 lib/useTypingSession.js）
const {
  currentLine, submittedLines, currentTokens, typingSpeed,
  completions, completionPosition,
  onInput, addTab, handleBackspace, acceptCompletion,
  submitLine, resetInput, flushCurrentLine,
} = useTypingSession({
  lang, refLines, refCode, inputRef,
  onSubmitAll: () => doSubmit(),
  getElapsedSeconds: () => trainingStore.elapsedTime,
});

// 已提交行的逐词对比展示
function compareLineTokens(inputLine, lineIndex) {
  const refTokens = tokenizeLine(refLines.value[lineIndex] || "", lang.value);
  const inputTokens = tokenizeLine(inputLine, lang.value);
  return diffLineTokens(refTokens, inputTokens, { includePending: true });
}

function doSubmit() {
  // 如果还有未提交的行，先提交当前行
  flushCurrentLine();
  const userCode = submittedLines.value.join("\n");
  const result = trainingStore.submitAnswer(userCode);
  if (result) {
    lastResult.value = result;
    resultOk.value = result.correct;
    showResult.value = true;
  }
}

function saveProgress() {
  // 保存到 store 的 training_progress（会话恢复的唯一数据源，
  // 原先另写一份无人读取的 codedrill_train_progress 死键已清理）
  trainingStore.saveProgress();
  // 显示保存提示
  alert("进度已保存");
}

function focusInput() {
  inputRef.value?.focus();
}

function nextQ() {
  const done = trainingStore.nextQuestion();
  showResult.value = false;
  showDiff.value = false;
  lastResult.value = null;
  resetInput();
  if (done) {
    router.push("/summary");
  }
  nextTick(() => inputRef.value?.focus());
}

function retryQuestion() {
  showResult.value = false;
  showDiff.value = false;
  lastResult.value = null;
  resetInput();
  nextTick(() => inputRef.value?.focus());
}

function goTo(i) {
  trainingStore.goToQuestion(i);
  resetInput();
  showResult.value = false;
  showDiff.value = false;
}

function goBack() {
  // 退出前保存进度
  if (trainingStore.isRunning) {
    trainingStore.saveProgress();
  }
  trainingStore.reset();
  router.push("/");
}

// 快捷键
useShortcuts({
  submit: doSubmit,
  next: nextQ,
  back: goBack,
  restart: () => {
    trainingStore.reset();
    router.push(`/train/${mode.value}`);
  },
});

onMounted(async () => {
  // 检查是否有保存的进度
  const savedProgress = trainingStore.loadProgress();
  
  if (savedProgress && savedProgress.mode === mode.value && savedProgress.language === (route.query.lang || "Java")) {
    // 恢复保存的进度
    trainingStore.resumeSession(savedProgress);
    // 如果恢复后题目为空，重新加载
    if (trainingStore.questions.length === 0) {
      await trainingStore.startSession({
        mode: mode.value,
        language: route.query.lang || "Java",
        module: route.query.module || "loop",
        count: parseInt(route.query.count) || 10,
      });
    }
  } else {
    await trainingStore.startSession({
      mode: mode.value,
      language: route.query.lang || "Java",
      module: route.query.module || "loop",
      count: parseInt(route.query.count) || 10,
    });
  }
  nextTick(() => inputRef.value?.focus());
});
</script>

<style scoped>
.train-layout {
  flex: 1;
  display: flex;
  overflow: hidden;
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

.code-panels {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.code-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-bottom: 2px solid var(--border);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3) var(--space-4);
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border);
}

.panel-title {
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--text-500);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.timer {
  font-size: var(--text-base);
  font-weight: 700;
  font-family: var(--mono);
  color: var(--accent-10);
  background: rgba(59, 130, 246, 0.1);
  padding: 4px 12px;
  border-radius: var(--radius-sm);
}

.code-block {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-3) 0;
  background: var(--bg-card);
  font-family: var(--mono);
  font-size: 14px;
  line-height: 1.8;
}

.code-line {
  display: flex;
  padding: 0 var(--space-4);
  min-height: 32px;
  align-items: center;
  transition: background 0.1s ease;
}

.code-line:hover {
  background: var(--bg-secondary);
}

.line-no {
  width: 40px;
  text-align: right;
  padding-right: var(--space-3);
  color: var(--text-400);
  user-select: none;
  flex-shrink: 0;
  font-size: var(--text-xs);
  font-family: var(--mono);
}

.line-content {
  flex: 1;
  white-space: pre;
  overflow-x: auto;
  display: flex;
  flex-wrap: nowrap;
}

.line-status {
  width: 24px;
  text-align: center;
  flex-shrink: 0;
  font-weight: 700;
  font-size: var(--text-sm);
}

/* Token 样式 */
.token {
  display: inline;
  transition: background 100ms ease, color 100ms ease;
}

/* 参考代码 token 颜色 */
.ref-block .token.keyword { color: #8B5CF6; }
.ref-block .token.builtin { color: #2563EB; }
.ref-block .token.string { color: #059669; }
.ref-block .token.number { color: #D97706; }
.ref-block .token.type { color: #0891B2; }
.ref-block .token.delimiter { color: var(--text-500); }
.ref-block .token.identifier { color: var(--text-900); }

/* 输入区 token 状态 */
.input-block .token.correct {
  color: var(--correct);
  background: rgba(34, 197, 94, 0.12);
  border-radius: 3px;
  padding: 0 1px;
}

.input-block .token.wrong {
  color: var(--incorrect);
  background: rgba(239, 68, 68, 0.15);
  border-radius: 3px;
  text-decoration: underline;
  text-decoration-style: wavy;
  text-decoration-color: var(--incorrect);
  padding: 0 1px;
}

.input-block .token.extra {
  color: var(--warning);
  background: rgba(249, 115, 22, 0.12);
  border-radius: 3px;
  padding: 0 1px;
}

.input-block .token.pending {
  color: var(--text-400);
}

.active-line {
  background: rgba(59, 130, 246, 0.06);
  border-left: 3px solid var(--accent-10);
  cursor: text;
}

.hidden-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.cursor {
  display: inline-block;
  width: 2px;
  height: 18px;
  background: var(--accent-10);
  animation: blink 1s step-end infinite;
  vertical-align: middle;
  margin-left: 1px;
  border-radius: 1px;
}

@keyframes blink {
  50% { opacity: 0; }
}

/* 操作按钮栏 */
.action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border);
}

.btn-save {
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

.btn-save:hover {
  background: rgba(59, 130, 246, 0.1);
  border-color: var(--accent-10);
  color: var(--accent-10);
}

.action-hint {
  font-size: 12px;
  color: var(--text-muted);
}

.ready-hint {
  color: var(--correct);
  font-weight: 600;
}

.btn-submit {
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 600;
  background: linear-gradient(135deg, var(--accent-10), #2563EB);
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-submit:active {
  transform: translateY(0);
}


.btn-sm {
  padding: var(--space-1) var(--space-3);
  font-size: var(--text-xs);
}

/* 提示 */
.hint-section {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: rgba(217, 119, 6, 0.1);
  border-top: 1px solid var(--warning);
}

.hint-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.hint-text {
  font-size: var(--text-sm);
  color: var(--text-700);
  line-height: 1.5;
}


/* 快捷键帮助弹窗 */
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
  width: 350px;
  max-width: 90%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border);
  font-weight: 600;
}

.modal-body {
  padding: var(--space-4);
}

.shortcut-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.shortcut-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2) 0;
}

.shortcut-key {
  padding: var(--space-1) var(--space-2);
  background: var(--border-light);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-family: var(--mono);
  font-size: var(--text-xs);
  font-weight: 600;
}

.shortcut-desc {
  font-size: var(--text-sm);
  color: var(--text-500);
}

.btn-sm {
  padding: var(--space-1) var(--space-3);
  font-size: var(--text-xs);
}

/* 移动端响应式 */
@media (max-width: 768px) {
  .train-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--border);
    max-height: 120px;
  }

  .sidebar-header {
    padding: 8px 12px;
  }

  .progress-section {
    padding: 8px 12px;
  }

  .question-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    padding: 8px;
    max-height: 60px;
    overflow-y: auto;
  }

  .q-btn {
    width: 32px;
    height: 32px;
    padding: 4px;
    font-size: 11px;
  }

  .main-area {
    flex: 1;
    overflow: hidden;
  }

  .code-block {
    font-size: 12px;
    line-height: 1.6;
  }

  .line-no {
    width: 28px;
    font-size: 10px;
    padding-right: 8px;
  }

  .action-bar {
    padding: 8px 12px;
    flex-wrap: wrap;
    gap: 8px;
  }

  .btn-save, .btn-submit {
    padding: 8px 16px;
    font-size: 12px;
  }

  .stats-panel {
    display: none;
  }

  .stats-header, .stats-list {
    display: none;
  }
}
</style>
