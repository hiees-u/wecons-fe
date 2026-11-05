<template>
  <Transition name="scroll-top">
    <button
      v-if="isVisible"
      class="scroll-top-button"
      type="button"
      :aria-label="t('common.scroll_to_top')"
      :title="t('common.scroll_to_top_title')"
      @click="scrollToTop"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 19V5m-7 7 7-7 7 7" />
      </svg>
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()
const visibilityThreshold = 400
const isVisible = ref(false)
let ticking = false

function updateVisibility(): void {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      isVisible.value = window.scrollY > visibilityThreshold
      ticking = false
    })
    ticking = true
  }
}

function scrollToTop(): void {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  window.scrollTo({
    top: 0,
    behavior: reduceMotion ? 'auto' : 'smooth',
  })
}

onMounted(() => {
  updateVisibility()
  window.addEventListener('scroll', updateVisibility, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateVisibility)
})
</script>

<style scoped>
.scroll-top-button {
  position: fixed;
  left: clamp(16px, 3vw, 36px);
  bottom: clamp(16px, 3vw, 36px);
  z-index: 40;
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border: 1px solid var(--color-border);
  background: var(--color-bg-soft);
  color: var(--color-champagne);
  cursor: pointer;
  transition: background-color 180ms ease, color 180ms ease, border-color 180ms ease;
}

.scroll-top-button:hover {
  border-color: var(--color-gold);
  background: var(--color-gold);
  color: var(--color-bg);
}

.scroll-top-button:focus-visible {
  outline: 2px solid var(--color-champagne);
  outline-offset: 3px;
}

.scroll-top-button svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.5;
}

.scroll-top-enter-active,
.scroll-top-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.scroll-top-enter-from,
.scroll-top-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (prefers-reduced-motion: reduce) {
  .scroll-top-button,
  .scroll-top-enter-active,
  .scroll-top-leave-active {
    transition: none;
  }
}
</style>
