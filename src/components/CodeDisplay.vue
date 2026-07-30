<template>
  <div class="code-display">
    <div
      v-for="(line, i) in lines"
      :key="i"
      class="code-line"
    >
      <span class="line-no">{{ i + 1 }}</span>
      <span class="line-content">
        <span
          v-for="(token, j) in lineTokens[i]"
          :key="j"
          :class="token.class"
        >{{ token.value }}</span>
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { tokenize, getTokenClass, detectLanguage } from "@/lib/syntaxHighlight";

const props = defineProps({
  code: { type: String, default: "" },
  language: { type: String, default: "" },
});

const lang = computed(() => props.language || detectLanguage(props.code));
const lines = computed(() => props.code.split("\n"));

const lineTokens = computed(() => {
  return lines.value.map((line) => {
    const tokens = tokenize(line, lang.value);
    return tokens.map((t) => ({
      value: t.value,
      class: getTokenClass(t.type),
    }));
  });
});
</script>

<style scoped>
.code-display {
  background: var(--bg-primary, #1e1e1e);
  padding: var(--space-3, 12px) 0;
  font-family: var(--font-mono, Consolas, monospace);
  font-size: 14px;
  line-height: 1.6;
  overflow-x: auto;
}

.code-line {
  display: flex;
  padding: 0 var(--space-4, 16px);
  min-height: 22px;
}

.code-line:hover {
  background: rgba(255, 255, 255, 0.02);
}

.line-no {
  width: 36px;
  text-align: right;
  padding-right: var(--space-3, 12px);
  color: #858585;
  user-select: none;
  flex-shrink: 0;
  font-size: 12px;
}

.line-content {
  flex: 1;
  white-space: pre;
}

/* 语法着色 - VSCode 风格 */
:deep(.token-keyword) {
  color: #569cd6;
}

:deep(.token-builtin) {
  color: #4ec9b0;
}

:deep(.token-string) {
  color: #ce9178;
}

:deep(.token-number) {
  color: #b5cea8;
}

:deep(.token-comment) {
  color: #6a9955;
  font-style: italic;
}

:deep(.token-function) {
  color: #dcdcaa;
}

:deep(.token-type) {
  color: #4ec9b0;
}

:deep(.token-operator) {
  color: #d4d4d4;
}

:deep(.token-delimiter) {
  color: #d4d4d4;
}

:deep(.token-identifier) {
  color: #9cdcfe;
}
</style>
