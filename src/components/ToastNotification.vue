<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="toast.type"
        >
          <span class="toast-icon">{{ icons[toast.type] }}</span>
          <span class="toast-message">{{ toast.message }}</span>
          <button
            class="toast-close"
            @click="remove(toast.id)"
          >
            ×
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from "vue";

const toasts = ref([]);
let nextId = 0;

const icons = {
  success: "✓",
  error: "✗",
  warning: "⚠",
  info: "ℹ",
};

function add(message, type = "info", duration = 3000) {
  const id = nextId++;
  toasts.value.push({ id, message, type });

  if (duration > 0) {
    setTimeout(() => remove(id), duration);
  }

  return id;
}

function remove(id) {
  const index = toasts.value.findIndex((t) => t.id === id);
  if (index > -1) {
    toasts.value.splice(index, 1);
  }
}

function success(message, duration) {
  return add(message, "success", duration);
}

function error(message, duration) {
  return add(message, "error", duration);
}

function warning(message, duration) {
  return add(message, "warning", duration);
}

function info(message, duration) {
  return add(message, "info", duration);
}

defineExpose({ add, remove, success, error, warning, info });
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 60px;
  right: 16px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  pointer-events: auto;
  min-width: 280px;
  max-width: 400px;
}

.toast.success {
  border-left: 3px solid var(--correct);
}

.toast.error {
  border-left: 3px solid var(--incorrect);
}

.toast.warning {
  border-left: 3px solid var(--warning);
}

.toast.info {
  border-left: 3px solid var(--accent-10);
}

.toast-icon {
  font-size: 16px;
  font-weight: 700;
  flex-shrink: 0;
}

.toast.success .toast-icon {
  color: var(--correct);
}

.toast.error .toast-icon {
  color: var(--incorrect);
}

.toast.warning .toast-icon {
  color: var(--warning);
}

.toast.info .toast-icon {
  color: var(--accent-10);
}

.toast-message {
  flex: 1;
  font-size: var(--text-sm);
  color: var(--text-700);
}

.toast-close {
  background: none;
  border: none;
  font-size: 16px;
  color: var(--text-400);
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.toast-close:hover {
  color: var(--text-700);
}

/* 过渡动画 */
.toast-enter-active {
  transition: all 0.3s ease;
}

.toast-leave-active {
  transition: all 0.2s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>
