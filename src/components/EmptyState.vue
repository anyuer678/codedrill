<template>
  <div class="empty-state">
    <div class="empty-icon">
      {{ icon }}
    </div>
    <div class="empty-title">
      {{ title }}
    </div>
    <div
      v-if="description"
      class="empty-desc"
    >
      {{ description }}
    </div>
    <button
      v-if="actionText"
      class="btn btn-primary"
      @click="$emit('action')"
    >
      {{ actionText }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  icon: { type: String, default: "📭" },
  title: { type: String, default: "暂无数据" },
  description: { type: String, default: "" },
  actionText: { type: String, default: "" },
});

defineEmits(["action"]);
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-12) var(--space-6);
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: var(--space-4);
  opacity: 0.6;
}

.empty-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-700);
  margin-bottom: var(--space-2);
}

.empty-desc {
  font-size: var(--text-sm);
  color: var(--text-500);
  margin-bottom: var(--space-6);
  max-width: 320px;
}
</style>
