<template>
  <div
    class="loading-spinner"
    :class="size"
  >
    <div class="spinner" />
    <span
      v-if="text"
      class="loading-text"
    >{{ text }}</span>
  </div>
</template>

<script setup>
defineProps({
  text: { type: String, default: "" },
  size: { type: String, default: "md" },
});
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid var(--border);
  border-top-color: var(--accent-10);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-spinner.sm .spinner {
  width: 16px;
  height: 16px;
  border-width: 2px;
}

.loading-spinner.lg .spinner {
  width: 36px;
  height: 36px;
  border-width: 4px;
}

.loading-text {
  font-size: var(--text-sm);
  color: var(--text-500);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
