/**
 * 训练页输入行状态机：当前行/已提交行/实时对比/补全。
 * 从 TrainView.vue 抽出的 composable（沿用 lib/shortcuts.js 的 useXxx 先例）。
 */
import { ref, computed } from "vue";
import { getCompletions } from "@/lib/completionService";
import { tokenizeLine, diffLineTokens } from "@/lib/trainTyping";

/**
 * @param {object} opts
 * @param {import('vue').ComputedRef<string>} opts.lang 语言（route 派生）
 * @param {import('vue').ComputedRef<string[]>} opts.refLines 参考代码行
 * @param {import('vue').ComputedRef<string>} opts.refCode 参考代码全文
 * @param {import('vue').Ref<HTMLInputElement|null>} opts.inputRef 隐藏输入框
 * @param {() => void} opts.onSubmitAll 全部行提交后的回调（判定入口）
 * @param {() => number} opts.getElapsedSeconds 会话已用秒数（打字速度用）
 */
export function useTypingSession({ lang, refLines, refCode, inputRef, onSubmitAll, getElapsedSeconds }) {
  const currentLine = ref("");
  const submittedLines = ref([]);
  const currentTokens = ref([]);
  const completions = ref([]);
  const completionPosition = ref({ top: 0, left: 0 });

  const totalChars = ref(0);
  const typingSpeed = computed(() => {
    const elapsed = getElapsedSeconds();
    if (elapsed <= 0) {return 0;}
    return Math.round((totalChars.value / elapsed) * 60);
  });

  /** 更新打字字符数 + 补全建议 + 当前行逐词对比 */
  function onInput() {
    totalChars.value = submittedLines.value.join("").length + currentLine.value.length;
    updateCompletions();

    const lineIndex = submittedLines.value.length;
    const refLine = refLines.value[lineIndex] || "";
    currentTokens.value = diffLineTokens(
      tokenizeLine(refLine, lang.value),
      tokenizeLine(currentLine.value, lang.value),
    );
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
      onSubmitAll();
    }
  }

  /** 清空输入状态（下一题/重做/跳转时调用） */
  function resetInput() {
    currentLine.value = "";
    submittedLines.value = [];
    currentTokens.value = [];
    totalChars.value = 0;
  }

  /** 全部行已提交时同步当前行（提交前兜底） */
  function flushCurrentLine() {
    if (currentLine.value.trim()) {
      submittedLines.value.push(currentLine.value);
      currentLine.value = "";
      currentTokens.value = [];
    }
  }

  return {
    currentLine, submittedLines, currentTokens, totalChars, typingSpeed,
    completions, completionPosition,
    onInput, addTab, handleBackspace, updateCompletions, acceptCompletion,
    submitLine, resetInput, flushCurrentLine,
  };
}
