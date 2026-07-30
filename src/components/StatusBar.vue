<template>
  <header class="status-bar">
    <span class="status-item">CodeDrill v1.0</span>
    <span class="status-separator">|</span>
    <span class="status-item">{{ currentTime }}</span>
    <span class="status-spacer" />
    <span class="status-item">离线模式</span>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const currentTime = ref("");
let timer = null;

function updateTime() {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style scoped>
.status-bar {
  display: flex;
  align-items: center;
  height: 24px;
  padding: 0 12px;
  background: var(--accent-blue);
  color: #fff;
  font-size: 12px;
  user-select: none;
}

.status-item {
  white-space: nowrap;
}

.status-separator {
  margin: 0 8px;
  opacity: 0.5;
}

.status-spacer {
  flex: 1;
}
</style>
