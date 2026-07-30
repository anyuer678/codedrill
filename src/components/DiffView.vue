<template>
  <div class="diff-view">
    <div class="diff-side">
      <div class="side-header">
        你的代码
      </div>
      <div class="side-content">
        <div
          v-for="(line, i) in submittedLines"
          :key="i"
          class="diff-line"
          :class="getLineClass(i)"
        >
          <span class="line-no">{{ i + 1 }}</span>
          <span class="line-text">{{ line || ' ' }}</span>
        </div>
      </div>
    </div>
    <div class="diff-side">
      <div class="side-header">
        参考代码
      </div>
      <div class="side-content">
        <div
          v-for="(line, i) in expectedLines"
          :key="i"
          class="diff-line expected"
        >
          <span class="line-no">{{ i + 1 }}</span>
          <span class="line-text">{{ line }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  submitted: { type: String, default: "" },
  expected: { type: String, default: "" },
});

const submittedLines = computed(() => props.submitted.split("\n"));
const expectedLines = computed(() => props.expected.split("\n"));

function getLineClass(index) {
  const submitted = submittedLines.value[index] || "";
  const expected = expectedLines.value[index] || "";

  if (!submitted && expected) {return "missing";}
  if (submitted && !expected) {return "extra";}
  if (submitted.trim() === expected.trim()) {return "match";}
  return "diff";
}
</script>

<style scoped>
.diff-view {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  max-height: 300px;
}

.diff-side {
  background: var(--bg-card);
}

.side-header {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-500);
  background: var(--border-light);
  border-bottom: 1px solid var(--border);
}

.side-content {
  overflow-y: auto;
  max-height: 260px;
}

.diff-line {
  display: flex;
  padding: 0 var(--space-3);
  min-height: 22px;
  font-family: var(--mono);
  font-size: 13px;
  line-height: 22px;
}

.diff-line.match {
  background: var(--correct-bg);
}

.diff-line.diff {
  background: var(--incorrect-bg);
}

.diff-line.missing {
  background: rgba(217, 119, 6, 0.1);
}

.diff-line.extra {
  background: rgba(139, 92, 246, 0.1);
}

.line-no {
  width: 30px;
  text-align: right;
  padding-right: var(--space-2);
  color: var(--text-400);
  font-size: 11px;
  flex-shrink: 0;
}

.line-text {
  flex: 1;
  white-space: pre;
  overflow-x: auto;
}
</style>
