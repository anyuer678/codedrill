<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="visible"
        class="shortcuts-overlay"
        @click="visible = false"
      >
        <div
          class="shortcuts-modal"
          @click.stop
        >
          <div class="shortcuts-header">
            <h3>快捷键</h3>
            <button
              class="close-btn"
              @click="visible = false"
            >
              ×
            </button>
          </div>
          <div class="shortcuts-body">
            <div class="shortcut-group">
              <div class="group-title">
                训练
              </div>
              <div class="shortcut-item">
                <kbd>Ctrl</kbd> + <kbd>Enter</kbd>
                <span>提交答案</span>
              </div>
              <div class="shortcut-item">
                <kbd>Ctrl</kbd> + <kbd>N</kbd>
                <span>下一题</span>
              </div>
              <div class="shortcut-item">
                <kbd>Ctrl</kbd> + <kbd>R</kbd>
                <span>重新开始</span>
              </div>
              <div class="shortcut-item">
                <kbd>Tab</kbd>
                <span>插入制表符</span>
              </div>
            </div>
            <div class="shortcut-group">
              <div class="group-title">
                导航
              </div>
              <div class="shortcut-item">
                <kbd>Esc</kbd>
                <span>返回</span>
              </div>
              <div class="shortcut-item">
                <kbd>?</kbd>
                <span>显示快捷键</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const visible = ref(false);

function handleKeydown(e) {
  if (e.key === "?" && !e.ctrlKey && !e.altKey && !e.metaKey) {
    const tag = e.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {return;}
    e.preventDefault();
    visible.value = !visible.value;
  }
  if (e.key === "Escape" && visible.value) {
    visible.value = false;
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<style scoped>
.shortcuts-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.shortcuts-modal {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  width: 400px;
  max-width: 90%;
  box-shadow: var(--shadow-lg);
}

.shortcuts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--border);
}

.shortcuts-header h3 {
  font-size: var(--text-base);
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  color: var(--text-400);
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.close-btn:hover {
  color: var(--text-700);
}

.shortcuts-body {
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.shortcut-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.group-title {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-400);
  text-transform: uppercase;
  margin-bottom: var(--space-1);
}

.shortcut-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-1) 0;
  font-size: var(--text-sm);
  color: var(--text-700);
}

kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 var(--space-2);
  background: var(--bg-60);
  border: 1px solid var(--border);
  border-radius: 4px;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-700);
  box-shadow: 0 1px 0 var(--border);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
