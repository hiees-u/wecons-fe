<template>
  <ol class="process-timeline">
    <li v-for="(step, index) in steps" :key="step.title">
      <span class="process-number">{{ formatIndex(index) }}</span>
      <div>
        <h3>{{ step.title }}</h3>
        <p>{{ step.description }}</p>
      </div>
    </li>
  </ol>
</template>

<script setup lang="ts">
import type { ProcessDetail } from '~/types/content'

defineProps<{
  steps: ProcessDetail[]
}>()

function formatIndex(index: number): string {
  const num = index + 1
  return num < 10 ? `0${num}` : `${num}`
}
</script>

<style scoped>
.process-timeline {
  list-style: none;
  border-top: 1px solid var(--color-border);
  padding: 0;
  margin: 0;
}
.process-timeline li {
  display: grid;
  grid-template-columns: 62px minmax(0, 1fr);
  gap: 20px;
  padding: 24px 0;
  border-bottom: 1px solid var(--color-border);
}
.process-number {
  color: var(--color-gold);
  font-family: var(--font-serif);
  font-size: 27px;
  line-height: 1;
}
.process-timeline h3 {
  color: var(--color-text);
  font-size: 16px;
  font-weight: 500;
  margin: 0;
}
.process-timeline p {
  max-width: 560px;
  margin-top: 9px;
  color: var(--color-muted);
  font-size: 12px;
  line-height: 1.8;
  margin-bottom: 0;
}
@media (max-width: 600px) {
  .process-timeline li {
    grid-template-columns: 45px minmax(0, 1fr);
    gap: 12px;
    padding: 19px 0;
  }
}
</style>
