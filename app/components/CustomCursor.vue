<template>
  <div
    ref="cursor"
    class="custom-cursor"
    :class="{
      'is-visible': isVisible,
      'is-journal-hover': isJournalHover,
    }"
    aria-hidden="true"
  >
    <svg class="custom-cursor-arrow" viewBox="0 0 24 24">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const cursor = ref<HTMLDivElement | null>(null)
const isVisible = ref(false)
const isJournalHover = ref(false)
const pointerQuery = '(hover: hover) and (pointer: fine)'
const reduceMotionQuery = '(prefers-reduced-motion: reduce)'

let pointerMediaQuery: MediaQueryList | null = null
let reduceMotionMediaQuery: MediaQueryList | null = null
let animationFrame = 0
let active = false
let initialized = false
let currentX = 0
let currentY = 0
let targetX = 0
let targetY = 0

function shouldEnableCustomCursor(): boolean {
  return window.matchMedia(pointerQuery).matches && !window.matchMedia(reduceMotionQuery).matches
}

function renderCursor(): void {
  const element = cursor.value

  if (!element || !active || document.hidden) {
    animationFrame = 0
    return
  }

  currentX += (targetX - currentX) * 0.12
  currentY += (targetY - currentY) * 0.12
  element.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`

  if (Math.abs(targetX - currentX) < 0.1 && Math.abs(targetY - currentY) < 0.1) {
    currentX = targetX
    currentY = targetY
    element.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`
    animationFrame = 0
    return
  }

  animationFrame = window.requestAnimationFrame(renderCursor)
}

function startAnimation(): void {
  if (!animationFrame && active && !document.hidden) {
    animationFrame = window.requestAnimationFrame(renderCursor)
  }
}

function handleMouseMove(event: MouseEvent): void {
  targetX = event.clientX
  targetY = event.clientY

  const element = cursor.value
  if (!element) return

  if (!initialized) {
    currentX = targetX
    currentY = targetY
    element.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`
    isVisible.value = true
    initialized = true
    return
  }

  startAnimation()
}

function handleMouseOver(event: MouseEvent): void {
  const target = event.target
  const overCard = target instanceof Element && target.closest('.journal-card') !== null
  if (isJournalHover.value !== overCard) {
    isJournalHover.value = overCard
  }
}

function stopAnimation(): void {
  if (animationFrame) {
    window.cancelAnimationFrame(animationFrame)
    animationFrame = 0
  }
}

function hideCursor(): void {
  stopAnimation()
  isVisible.value = false
  isJournalHover.value = false
  initialized = false
}

function handleMouseLeave(): void {
  hideCursor()
}

function handleVisibilityChange(): void {
  if (document.hidden) hideCursor()
}

function activate(): void {
  if (active) return

  active = true
  window.addEventListener('mousemove', handleMouseMove, { passive: true })
  window.addEventListener('mouseover', handleMouseOver, { passive: true })
  window.addEventListener('mouseleave', handleMouseLeave)
  document.addEventListener('visibilitychange', handleVisibilityChange)
}

function deactivate(): void {
  if (!active) return

  active = false
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseover', handleMouseOver)
  window.removeEventListener('mouseleave', handleMouseLeave)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  hideCursor()
}

function handlePointerMediaChange(event: MediaQueryListEvent): void {
  if (event.matches && shouldEnableCustomCursor()) activate()
  else deactivate()
}

function handleMotionMediaChange(): void {
  if (shouldEnableCustomCursor()) activate()
  else deactivate()
}

onMounted(() => {
  pointerMediaQuery = window.matchMedia(pointerQuery)
  reduceMotionMediaQuery = window.matchMedia(reduceMotionQuery)

  if (shouldEnableCustomCursor()) activate()

  pointerMediaQuery.addEventListener('change', handlePointerMediaChange)
  reduceMotionMediaQuery.addEventListener('change', handleMotionMediaChange)
})

onBeforeUnmount(() => {
  pointerMediaQuery?.removeEventListener('change', handlePointerMediaChange)
  reduceMotionMediaQuery?.removeEventListener('change', handleMotionMediaChange)
  deactivate()
})
</script>

<style scoped>
.custom-cursor {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #b38e4f;
  opacity: 0;
  pointer-events: none;
  will-change: transform;
  transition:
    width 180ms ease,
    height 180ms ease,
    opacity 100ms ease;
}

.custom-cursor.is-visible {
  opacity: 1;
}

.custom-cursor.is-journal-hover {
  width: 48px;
  height: 48px;
}

.custom-cursor-arrow {
  position: absolute;
  inset: 0;
  width: 22px;
  height: 22px;
  margin: auto;
  fill: none;
  stroke: #171614;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity 140ms ease, transform 180ms ease;
}

.custom-cursor.is-journal-hover .custom-cursor-arrow {
  opacity: 1;
  transform: translateX(0);
}

@media (prefers-reduced-motion: reduce) {
  .custom-cursor,
  .custom-cursor-arrow {
    transition: none;
  }
}
</style>
