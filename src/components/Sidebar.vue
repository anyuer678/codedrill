<template>
  <aside class="sidebar panel">
    <div class="panel-header">
      <slot name="header">
        {{ title }}
      </slot>
    </div>
    <div
      class="panel-body"
      :class="{ 'no-padding': noPadding }"
    >
      <slot />
    </div>
    <div
      v-if="$slots.footer"
      class="panel-footer"
    >
      <slot name="footer" />
    </div>
  </aside>
</template>

<script setup>
defineProps({
  title: { type: String, default: "" },
  noPadding: { type: Boolean, default: false },
});
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  background: var(--bg-secondary);
  border-radius: 0;
  overflow: hidden;
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.panel-body.no-padding {
  padding: 0;
}

.panel-footer {
  padding: 8px 12px;
  border-top: 1px solid var(--border-color);
}
</style>
