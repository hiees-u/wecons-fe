<template>
  <section class="about-cta">
    <div>
      <p class="eyebrow"><span></span> {{ t('about_page.cta_eyebrow') }}</p>
      <h2>
        {{ t('about_page.cta_title') }}<br>
        <em>{{ t('about_page.cta_title_accent') }}</em>
      </h2>
    </div>
    <NuxtLink class="button-gold" to="/lien-he#consultation-form">
      {{ t('about_page.cta_btn') }} <span aria-hidden="true">↗</span>
    </NuxtLink>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()
</script>

<style scoped>
.about-cta {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 30px;
  padding: 75px max(0px, calc((100vw - var(--about-content-width, 1515px)) / 2));
  border-top: 1px solid var(--color-border);
  background: #141414;
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--color-gold);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 1.7px;
}

.eyebrow > span {
  width: 30px;
  height: 1px;
  background: var(--color-gold);
}

.about-cta h2 {
  margin-top: 18px;
  color: var(--color-text);
  font-size: clamp(36px, 4.4vw, 58px);
  font-weight: 500;
  letter-spacing: -1.8px;
  line-height: 1.13;
  text-wrap: balance;
}

.about-cta h2 em {
  color: var(--color-champagne);
  font-family: var(--font-serif);
  font-weight: 400;
}

.about-cta .button-gold {
  display: inline-flex;
  min-height: 48px;
  align-items: center;
  gap: 20px;
  padding: 0 24px;
  background: var(--color-gold);
  color: #100f0d;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 1.2px;
  text-decoration: none;
  transition: background-color 0.25s ease, transform 0.25s ease;
}

.about-cta .button-gold:hover {
  background: var(--color-champagne);
  transform: translateY(-2px);
}

.about-cta .button-gold span {
  font-size: 15px;
}

@media (max-width: 600px) {
  .about-cta {
    align-items: flex-start;
    flex-direction: column;
    padding-top: 65px;
    padding-right: var(--page-gutter);
    padding-bottom: 65px;
    padding-left: var(--page-gutter);
  }
}
</style>
