<template>
  <div
    v-if="suggestions.length > 0"
    class="completion-popup"
    :style="popupStyle"
  >
    <div
      v-for="(item, i) in suggestions"
      :key="i"
      class="completion-item"
      :class="{ selected: i === selectedIndex }"
      @click="selectItem(item)"
      @mouseenter="selectedIndex = i"
    >
      <span
        class="item-icon"
        :class="item.type"
      >{{ getIcon(item.type) }}</span>
      <span class="item-label">{{ item.label }}</span>
      <span class="item-desc">{{ item.description }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  suggestions: { type: Array, default: () => [] },
  position: { type: Object, default: () => ({ top: 0, left: 0 }) },
});

const emit = defineEmits(["select", "close"]);

const selectedIndex = ref(0);

const popupStyle = computed(() => ({
  top: `${props.position.top}px`,
  left: `${props.position.left}px`,
}));

function getIcon(type) {
  const icons = {
    keyword: "K",
    builtin: "F",
    expected: "E",
    variable: "V",
  };
  return icons[type] || "·";
}

function selectItem(item) {
  emit("select", item);
}

function handleKeydown(e) {
  if (props.suggestions.length === 0) {return;}

  if (e.key === "ArrowDown") {
    e.preventDefault();
    selectedIndex.value = (selectedIndex.value + 1) % props.suggestions.length;
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    selectedIndex.value = (selectedIndex.value - 1 + props.suggestions.length) % props.suggestions.length;
  } else if (e.key === "Tab" || e.key === "Enter") {
    if (props.suggestions[selectedIndex.value]) {
      e.preventDefault();
      selectItem(props.suggestions[selectedIndex.value]);
    }
  } else if (e.key === "Escape") {
    emit("close");
  }
}

watch(() => props.suggestions, () => {
  selectedIndex.value = 0;
});

defineExpose({ handleKeydown });
</script>

<style scoped>
.completion-popup {
  position: fixed;
  z-index: 200;
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 200px;
  overflow-y: auto;
  min-width: 200px;
}

.completion-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  cursor: pointer;
  transition: background 100ms;
}

.completion-item:hover,
.completion-item.selected {
  background: rgba(37, 99, 235, 0.1);
}

.item-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  font-family: monospace;
}

.item-icon.keyword {
  background: #dbeafe;
  color: #2563eb;
}

.item-icon.builtin {
  background: #d1fae5;
  color: #059669;
}

.item-icon.expected {
  background: #fef3c7;
  color: #d97706;
}

.item-icon.variable {
  background: #f3e8ff;
  color: #7c3aed;
}

.item-label {
  flex: 1;
  font-size: 13px;
  font-family: monospace;
  color: #111827;
}

.item-desc {
  font-size: 11px;
  color: #9ca3af;
}
</style>
