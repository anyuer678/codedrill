<template>
  <div class="code-editor">
    <div class="editor-header">
      <span class="editor-title">{{ title }}</span>
      <span
        v-if="language"
        class="editor-lang"
      >{{ language }}</span>
    </div>
    <div class="editor-body">
      <textarea
        ref="textareaRef"
        class="editor-textarea"
        :value="modelValue"
        :placeholder="placeholder"
        :readonly="readonly"
        :disabled="disabled"
        spellcheck="false"
        autocomplete="off"
        autocapitalize="off"
        @input="$emit('update:modelValue', $event.target.value)"
        @keydown.tab.prevent="insertTab"
        @keydown.ctrl.enter="$emit('submit')"
      />
    </div>
    <div
      v-if="$slots.footer"
      class="editor-footer"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  modelValue: { type: String, default: "" },
  title: { type: String, default: "" },
  language: { type: String, default: "" },
  placeholder: { type: String, default: "在此输入代码..." },
  readonly: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  tabSize: { type: Number, default: 4 },
});

defineEmits(["update:modelValue", "submit"]);

const textareaRef = ref(null);

function insertTab(e) {
  const textarea = e.target;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const spaces = " ".repeat(props.tabSize);
  const newValue = textarea.value.substring(0, start) + spaces + textarea.value.substring(end);
  textarea.value = newValue;
  textarea.selectionStart = textarea.selectionEnd = start + props.tabSize;
  // Trigger input event for v-model
  textarea.dispatchEvent(new Event("input"));
}

function focus() {
  textareaRef.value?.focus();
}

defineExpose({ focus });
</script>

<style scoped>
.code-editor {
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  overflow: hidden;
}

.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background: var(--bg-tertiary);
  border-bottom: 1px solid var(--border-color);
  font-size: 12px;
}

.editor-title {
  color: var(--text-secondary);
}

.editor-lang {
  color: var(--accent-blue);
  font-size: 11px;
}

.editor-body {
  flex: 1;
}

.editor-textarea {
  width: 100%;
  height: 100%;
  min-height: 200px;
  padding: 12px;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 14px;
  line-height: 1.6;
  tab-size: 4;
  resize: none;
  outline: none;
}

.editor-textarea::placeholder {
  color: var(--text-muted);
}

.editor-textarea:read-only {
  opacity: 0.8;
  cursor: default;
}

.editor-footer {
  padding: 6px 12px;
  border-top: 1px solid var(--border-color);
  font-size: 12px;
}
</style>
