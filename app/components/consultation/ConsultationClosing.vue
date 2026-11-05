<template>
  <section class="consultation-closing" aria-labelledby="consultation-closing-title">
    <div>
      <p class="consultation-eyebrow"><span></span> {{ t('consultation_page.closing_eyebrow') }}</p>
      <h2 id="consultation-closing-title">
        {{ t('consultation_page.closing_title_1') }}<br>
        <em>{{ t('consultation_page.closing_title_2') }}</em>
      </h2>
      <p>{{ t('consultation_page.closing_desc') }}</p>
    </div>
    <a class="button-gold" href="#consultation-form">
      {{ t('consultation_page.closing_btn') }}
      <span aria-hidden="true">↗</span>
    </a>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()
</script>

<style scoped>
.consultation-closing {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 30px;
  width: min(1320px, calc(100% - var(--consultation-gutter) * 2));
  margin: 0 auto;
  padding: clamp(75px, 9vw, 125px) 0;
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

.consultation-closing h2 {
  margin-top: 18px;
  color: var(--color-text);
  font-size: clamp(34px, 4.2vw, 56px);
  font-weight: 400;
  line-height: 1.14;
  letter-spacing: -1.4px;
}

.consultation-closing h2 em {
  color: var(--color-champagne);
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
}

.consultation-closing > div > p:last-child {
  max-width: 520px;
  margin-top: 16px;
  color: var(--color-muted);
  font-size: clamp(14px, 1.2vw, 16px);
  line-height: 1.8;
}

.button-gold {
  display: inline-flex;
  min-height: 50px;
  align-items: center;
  gap: 12px;
  padding: 0 28px;
  background: var(--color-gold);
  color: #0b0b0a;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1.4px;
  text-decoration: none;
  flex-shrink: 0;
  transition: transform 0.25s ease, background-color 0.25s ease;
}

.button-gold:hover {
  transform: translateY(-2px);
  background: var(--color-champagne);
}

@media (max-width: 820px) {
  .consultation-closing {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
