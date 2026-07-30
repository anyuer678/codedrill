<template>
  <div class="train-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <button
          class="btn-back"
          @click="goBack"
        >
          ← 返回
        </button>
        <span class="sidebar-title">{{ modeLabel }}</span>
        <button
          class="btn-help"
          @click="showHelp = true"
        >
          ?
        </button>
      </div>
      <div class="progress-section">
        <div class="progress-info">
          <span class="progress-text">
            {{ trainingStore.currentIndex + 1 }} / {{ trainingStore.questions.length }}
          </span>
          <span class="progress-percent">{{ trainingStore.progress }}%</span>
        </div>
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: trainingStore.progress + '%' }"
          />
        </div>
      </div>
      <div class="question-grid">
        <button
          v-for="(q, i) in trainingStore.questions"
          :key="i"
          class="q-btn"
          :class="{
            active: i === trainingStore.currentIndex,
            correct: trainingStore.results[i]?.correct,
            wrong: trainingStore.results[i] && !trainingStore.results[i].correct,
          }"
          @click="goTo(i)"
        >
          {{ i + 1 }}
        </button>
      </div>
    </aside>

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
                @keydown.enter.prevent="submitLine"
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

      <!-- 结果栏 -->
      <div
        v-if="showResult"
        class="result-bar"
        :class="resultOk ? 'result-ok' : 'result-fail'"
      >
        <span class="result-icon">{{ resultOk ? '✓' : '✗' }}</span>
        <span class="result-text">{{ resultOk ? '正确' : '错误' }}</span>
        <span class="result-time">{{ lastResult?.timeSpent?.toFixed(1) }}s</span>
        <div class="result-actions">
          <button
            v-if="!resultOk"
            class="btn btn-sm"
            @click="showHint = !showHint"
          >
            提示
          </button>
          <button
            v-if="!resultOk"
            class="btn btn-sm"
            @click="showDiff = !showDiff"
          >
            {{ showDiff ? '隐藏' : '对比' }}
          </button>
          <button
            v-if="!resultOk"
            class="btn btn-sm"
            @click="retryQuestion"
          >
            重做
          </button>
          <button
            class="btn"
            @click="nextQ"
          >
            {{ isLast ? '完成' : '下一题' }}
          </button>
        </div>
      </div>

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

    <aside class="stats-panel">
      <div class="stats-header">
        统计
      </div>
      <div class="stats-list">
        <div class="stat-row">
          <span class="stat-label">正确</span>
          <span class="stat-value ok">{{ trainingStore.sessionCorrect }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">错误</span>
          <span class="stat-value fail">{{ trainingStore.sessionWrong }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">正确率</span>
          <span class="stat-value">{{ trainingStore.sessionAccuracy }}%</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">平均用时</span>
          <span class="stat-value">{{ trainingStore.avgTime }}s</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">打字速度</span>
          <span class="stat-value">{{ typingSpeed }} CPM</span>
        </div>
      </div>
    </aside>

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
import CompletionPopup from "@/components/CompletionPopup.vue";
import { getCompletions } from "@/lib/completionService";

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
const currentLine = ref("");
const submittedLines = ref([]);
const showResult = ref(false);
const lastResult = ref(null);
const resultOk = ref(false);
const currentTokens = ref([]);
const showHelp = ref(false);
const showDiff = ref(false);
const showHint = ref(false);
const completions = ref([]);
const completionPosition = ref({ top: 0, left: 0 });
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

// 打字速度（字符/分钟）
const totalChars = ref(0);
const typingSpeed = computed(() => {
  const elapsed = trainingStore.elapsedTime;
  if (elapsed <= 0) {return 0;}
  return Math.round((totalChars.value / elapsed) * 60);
});

/**
 * 将一行代码分割为 token（词法单元）
 */
function tokenizeLine(line) {
  if (!line) {return [{ text: " ", type: "empty" }];}

  const tokens = [];
  let current = "";
  let inString = false;
  let stringChar = "";

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    // 字符串内
    if (inString) {
      current += ch;
      if (ch === stringChar && line[i - 1] !== "\\") {
        tokens.push({ text: current, type: "string" });
        current = "";
        inString = false;
      }
      continue;
    }

    // 字符串开始
    if (ch === '"' || ch === "'") {
      if (current) {
        tokens.push({ text: current, type: classifyToken(current) });
        current = "";
      }
      inString = true;
      stringChar = ch;
      current = ch;
      continue;
    }

    // 空格
    if (/\s/.test(ch)) {
      if (current) {
        tokens.push({ text: current, type: classifyToken(current) });
        current = "";
      }
      tokens.push({ text: ch, type: "space" });
      continue;
    }

    // 分隔符
    if (/[{}()\\[\];,.]/.test(ch)) {
      if (current) {
        tokens.push({ text: current, type: classifyToken(current) });
        current = "";
      }
      tokens.push({ text: ch, type: "delimiter" });
      continue;
    }

    // 运算符
    if (/[+\-*/%=<>!&|^~?:]/.test(ch)) {
      if (current && /[+\-*/%=<>!&|^~?:]/.test(current[current.length - 1])) {
        current += ch;
      } else {
        if (current) {
          tokens.push({ text: current, type: classifyToken(current) });
          current = "";
        }
        current = ch;
      }
      continue;
    }

    // 普通字符
    current += ch;
  }

  if (current) {
    tokens.push({ text: current, type: classifyToken(current) });
  }

  return tokens.length > 0 ? tokens : [{ text: " ", type: "empty" }];
}

function classifyToken(token) {
  const keywordSets = {
    Java: ["for", "while", "if", "else", "do", "switch", "case", "break", "continue", "return", "int", "double", "float", "char", "String", "boolean", "void", "class", "public", "private", "static", "new", "true", "false", "null"],
    Python: ["for", "while", "if", "else", "elif", "def", "class", "return", "import", "from", "True", "False", "None", "and", "or", "not", "in", "is", "try", "except", "finally", "with", "as", "yield", "lambda", "pass", "break", "continue"],
    "C++": ["for", "while", "if", "else", "do", "switch", "case", "break", "continue", "return", "int", "double", "float", "char", "bool", "void", "class", "public", "private", "protected", "static", "const", "new", "delete", "true", "false", "nullptr", "auto", "virtual", "template", "typename"],
    JavaScript: ["for", "while", "if", "else", "do", "switch", "case", "break", "continue", "return", "const", "let", "var", "function", "class", "new", "true", "false", "null", "undefined", "typeof", "instanceof", "async", "await", "import", "export", "default", "from", "try", "catch", "finally", "throw", "of", "in", "yield", "this", "super", "extends"],
  };
  const keywords = keywordSets[lang.value] || keywordSets.Java;

  const builtinSets = {
    Java: ["System", "Math", "String", "Scanner", "ArrayList", "HashMap"],
    Python: ["print", "len", "range", "int", "str", "float", "list", "dict", "set", "type", "input", "sorted", "enumerate", "zip", "map", "filter", "sum", "max", "min"],
    "C++": ["cout", "cin", "endl", "vector", "string", "map", "set", "pair", "sort", "reverse", "find", "max", "min"],
    JavaScript: ["console", "Math", "Array", "Object", "Map", "Set", "Promise", "Date", "JSON", "parseInt", "parseFloat", "setTimeout", "setInterval", "fetch", "require"],
  };
  const builtins = builtinSets[lang.value] || builtinSets.Java;

  if (keywords.includes(token)) {return "keyword";}
  if (builtins.includes(token)) {return "builtin";}
  if (/^\d+$/.test(token)) {return "number";}
  if (/^[A-Z]/.test(token)) {return "type";}
  if (token === " ") {return "space";}
  return "identifier";
}

/**
 * 逐词对比当前输入行
 */
function compareLineTokens(inputLine, lineIndex) {
  const refLine = refLines.value[lineIndex] || "";
  const refTokens = tokenizeLine(refLine);
  const inputTokens = tokenizeLine(inputLine);

  const result = [];
  const maxLen = Math.max(refTokens.length, inputTokens.length);

  for (let i = 0; i < maxLen; i++) {
    const ref = refTokens[i];
    const inp = inputTokens[i];

    if (!inp) {
      result.push({ text: ref.text, type: ref.type, status: "pending" });
    } else if (!ref) {
      result.push({ text: inp.text, type: inp.type, status: "extra" });
    } else if (ref.text === inp.text) {
      result.push({ text: inp.text, type: inp.type, status: "correct" });
    } else {
      result.push({ text: inp.text, type: inp.type, status: "wrong" });
    }
  }

  return result;
}

/**
 * 实时计算当前输入的逐词状态
 */
function onInput() {
  // 更新打字字符数
  totalChars.value = submittedLines.value.join("").length + currentLine.value.length;

  // 获取补全建议
  updateCompletions();

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
      // 还没输入到这
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

function getLineStatus(lineIndex) {
  const ref = refLines.value[lineIndex];
  const input = submittedLines.value[lineIndex];
  if (!ref || !input) {return "";}
  return ref.trim() === input.trim() ? "✓" : "✗";
}

function addTab() {
  currentLine.value += "    ";
  onInput();
}

function handleBackspace() {
  if (currentLine.value === "" && submittedLines.value.length > 0) {
    currentLine.value = submittedLines.value.pop();
    onInput();
  }
  completions.value = [];
}

function updateCompletions() {
  const suggestions = getCompletions(
    currentLine.value,
    currentLine.value.length,
    lang.value,
    { expectedCode: refCode.value },
  );
  completions.value = suggestions;

  // 计算弹窗位置
  if (suggestions.length > 0 && inputRef.value) {
    const rect = inputRef.value.getBoundingClientRect();
    completionPosition.value = {
      top: rect.bottom + 4,
      left: rect.left,
    };
  }
}

function acceptCompletion(item) {
  const current = currentLine.value;
  const lastWord = current.match(/[a-zA-Z_]\w*$/);
  if (lastWord) {
    currentLine.value = current.slice(0, current.length - lastWord[0].length) + item.text;
  } else {
    currentLine.value += item.text;
  }
  completions.value = [];
  onInput();
}

function submitLine() {
  submittedLines.value.push(currentLine.value);
  currentLine.value = "";
  currentTokens.value = [];

  if (submittedLines.value.length >= refLines.value.length) {
    doSubmit();
  }
}

function doSubmit() {
  // 如果还有未提交的行，先提交当前行
  if (currentLine.value.trim()) {
    submittedLines.value.push(currentLine.value);
    currentLine.value = "";
    currentTokens.value = [];
  }
  const userCode = submittedLines.value.join("\n");
  const result = trainingStore.submitAnswer(userCode);
  if (result) {
    lastResult.value = result;
    resultOk.value = result.correct;
    showResult.value = true;
  }
}

function saveProgress() {
  // 保存当前输入状态
  const progress = {
    submittedLines: [...submittedLines.value],
    currentLine: currentLine.value,
    currentIndex: trainingStore.currentIndex,
  };
  localStorage.setItem("codedrill_train_progress", JSON.stringify(progress));
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
  submittedLines.value = [];
  currentLine.value = "";
  currentTokens.value = [];
  if (done) {
    router.push("/summary");
  }
  nextTick(() => inputRef.value?.focus());
}

function retryQuestion() {
  showResult.value = false;
  showDiff.value = false;
  lastResult.value = null;
  submittedLines.value = [];
  currentLine.value = "";
  currentTokens.value = [];
  nextTick(() => inputRef.value?.focus());
}

function goTo(i) {
  trainingStore.goToQuestion(i);
  submittedLines.value = [];
  currentLine.value = "";
  currentTokens.value = [];
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
  flex: 1;
}

.btn-help {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid var(--border);
  border-radius: 50%;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-400);
  cursor: pointer;
  padding: 0;
}

.btn-help:hover {
  background: var(--border-light);
  color: var(--text-700);
}

.progress-section {
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2);
}

.progress-text {
  font-size: var(--text-xs);
  color: var(--text-400);
  font-family: var(--mono);
}

.progress-percent {
  font-size: var(--text-xs);
  font-weight: 600;
  font-family: var(--mono);
  color: var(--accent-10);
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
  transition: width 300ms ease;
}

.question-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-2);
  padding: var(--space-3);
  overflow-y: auto;
  flex: 1;
}

.q-btn {
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

.q-btn:hover {
  border-color: var(--text-400);
}

.q-btn.active {
  background: var(--accent-10);
  border-color: var(--accent-10);
  color: white;
}

.q-btn.correct {
  background: var(--correct);
  border-color: var(--correct);
  color: white;
}

.q-btn.wrong {
  background: var(--incorrect);
  border-color: var(--incorrect);
  color: white;
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

.result-bar {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-top: 1px solid var(--border);
  flex-shrink: 0;
}

.result-ok {
  background: var(--correct-bg);
}

.result-fail {
  background: var(--incorrect-bg);
}

.result-icon {
  font-weight: 700;
  font-size: var(--text-lg);
}

.result-ok .result-icon { color: var(--correct); }
.result-fail .result-icon { color: var(--incorrect); }

.result-text {
  font-weight: 600;
  font-size: var(--text-sm);
}

.result-ok .result-text { color: var(--correct); }
.result-fail .result-text { color: var(--incorrect); }

.result-time {
  flex: 1;
  font-size: var(--text-xs);
  color: var(--text-400);
  font-family: var(--mono);
}

.result-actions {
  display: flex;
  gap: var(--space-2);
}

.btn-sm {
  padding: var(--space-1) var(--space-3);
  font-size: var(--text-xs);
}

/* 差异对比面板 */
.diff-panel {
  border-top: 1px solid var(--border);
  background: var(--bg-card);
}

.diff-header {
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-500);
  background: var(--border-light);
  border-bottom: 1px solid var(--border);
}

.diff-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: var(--border);
}

.diff-side {
  background: var(--bg-card);
}

.diff-label {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-xs);
  color: var(--text-400);
  background: var(--border-light);
  border-bottom: 1px solid var(--border);
}

.diff-code {
  padding: var(--space-3);
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.5;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 200px;
  overflow-y: auto;
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

.stats-panel {
  width: 160px;
  background: var(--bg-card);
  border-left: 1px solid var(--border);
  flex-shrink: 0;
}

.stats-header {
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-500);
  text-transform: uppercase;
}

.stats-list {
  padding: var(--space-3);
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3);
  border-bottom: 1px solid var(--border-light);
}

.stat-label {
  font-size: var(--text-xs);
  color: var(--text-400);
}

.stat-value {
  font-size: var(--text-base);
  font-weight: 700;
  font-family: var(--mono);
  color: var(--text-900);
}

.stat-value.ok { color: var(--correct); }
.stat-value.fail { color: var(--incorrect); }

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
