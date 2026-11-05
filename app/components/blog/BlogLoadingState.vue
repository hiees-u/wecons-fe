<template>
  <div class="blog-loading" role="status" aria-live="polite">
    <span class="loading-mark" aria-hidden="true">
      <span></span>
      <span></span>
      <span></span>
    </span>
    <span>{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<style scoped>
.blog-loading {
  display: flex;
  min-height: 126px;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-top: 8px;
  border-top: 1px solid var(--color-border);
  color: var(--color-muted);
  font-size: 12px;
  letter-spacing: 0.3px;
}

.loading-mark {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 18px;
}

.loading-mark span {
  width: 4px;
  height: 7px;
  border-radius: 4px;
  background: var(--color-gold);
  animation: loading-pulse 900ms ease-in-out infinite;
}

.loading-mark span:nth-child(2) {
  animation-delay: 140ms;
}

.loading-mark span:nth-child(3) {
  animation-delay: 280ms;
}

@keyframes loading-pulse {
  0%,
  60%,
  100% {
    height: 7px;
    opacity: 0.55;
  }

  30% {
    height: 17px;
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .loading-mark span {
    animation: none;
  }
}
</style>
