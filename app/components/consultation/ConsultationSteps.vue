<template>
  <section id="consultation-steps" class="consultation-process" aria-labelledby="consultation-process-title">
    <div class="consultation-section-heading">
      <p class="consultation-eyebrow"><span></span> {{ t('consultation_page.process_eyebrow') }}</p>
      <h2 id="consultation-process-title">
        {{ t('consultation_page.process_title_1') }}<br>
        <em>{{ t('consultation_page.process_title_2') }}</em>
      </h2>
    </div>
    <ol class="consultation-steps">
      <li v-for="step in steps" :key="step.number">
        <span>{{ step.number }}</span>
        <h3>{{ step.title }}</h3>
        <p>{{ step.desc }}</p>
      </li>
    </ol>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()

const steps = computed(() => [
  {
    number: '01',
    title: t('consultation_page.step_1_title'),
    desc: t('consultation_page.step_1_desc'),
  },
  {
    number: '02',
    title: t('consultation_page.step_2_title'),
    desc: t('consultation_page.step_2_desc'),
  },
  {
    number: '03',
    title: t('consultation_page.step_3_title'),
    desc: t('consultation_page.step_3_desc'),
  },
])
</script>

<style scoped>
.consultation-process {
  width: min(1320px, calc(100% - var(--consultation-gutter) * 2));
  margin: 0 auto;
  padding: clamp(75px, 9vw, 125px) 0;
  border-bottom: 1px solid var(--color-border);
}

.consultation-eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--color-gold);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 1.8px;
}

.consultation-eyebrow > span {
  width: 32px;
  height: 1px;
  background: currentColor;
}

.consultation-section-heading h2 {
  margin-top: 18px;
  color: var(--color-text);
  font-size: clamp(34px, 4.2vw, 56px);
  font-weight: 400;
  line-height: 1.14;
  letter-spacing: -1.4px;
}

.consultation-section-heading h2 em {
  color: var(--color-champagne);
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
}

.consultation-steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 30px;
  margin-top: 48px;
  list-style: none;
  padding: 0;
}

.consultation-steps li {
  padding: 32px 28px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}

.consultation-steps span {
  display: block;
  color: var(--color-gold);
  font-family: var(--font-serif);
  font-size: 24px;
}

.consultation-steps h3 {
  margin-top: 20px;
  color: var(--color-text);
  font-size: 17px;
  font-weight: 500;
}

.consultation-steps p {
  margin-top: 10px;
  color: var(--color-muted);
  font-size: 13px;
  line-height: 1.75;
}

@media (max-width: 820px) {
  .consultation-steps {
    grid-template-columns: 1fr;
  }
}
</style>
