<template>
  <section class="consultation-hero" aria-labelledby="consultation-hero-title">
    <picture>
      <source media="(max-width: 768px)" srcset="/images/pg-mobile.webp" type="image/webp">
      <source media="(min-width: 769px)" srcset="/images/pg.webp" type="image/webp">
      <img
        class="consultation-hero-image"
        src="/images/pg.webp"
        :alt="t('consultation_page.hero_title_1')"
        fetchpriority="high"
        width="1920"
        height="1080"
        decoding="async"
      >
    </picture>
    <div class="consultation-hero-shade" aria-hidden="true"></div>
    <div class="consultation-hero-content">
      <p class="consultation-eyebrow"><span></span> {{ t('consultation_page.hero_eyebrow') }}</p>
      <h1 id="consultation-hero-title">
        <span>{{ t('consultation_page.hero_title_1') }}</span>
        <em>{{ t('consultation_page.hero_title_2') }}</em>
      </h1>
      <p class="consultation-hero-description">
        {{ t('consultation_page.hero_desc') }}
      </p>
      <div class="consultation-hero-actions">
        <a class="button-gold" href="#consultation-form">
          {{ t('consultation_page.hero_cta_register') }}
          <span aria-hidden="true">↗</span>
        </a>
        <a class="button-line" href="#consultation-steps">
          {{ t('consultation_page.hero_cta_process') }}
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
    <p class="consultation-hero-caption">
      <span>{{ t('consultation_page.hero_caption_1') }}</span>
      <span>{{ t('consultation_page.hero_caption_2') }}</span>
    </p>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()
</script>

<style scoped>
.consultation-hero {
  position: relative;
  display: flex;
  min-height: clamp(620px, 82svh, 880px);
  align-items: flex-end;
  overflow: hidden;
  isolation: isolate;
  background: #090909;
}

.consultation-hero-image,
.consultation-hero-shade {
  position: absolute;
  z-index: -1;
  inset: 0;
  width: 100%;
  height: 100%;
}

.consultation-hero-image {
  object-fit: cover;
  object-position: center 52%;
}

.consultation-hero-shade {
  background:
    linear-gradient(90deg, rgba(7, 7, 7, 0.83), rgba(7, 7, 7, 0.34) 62%, rgba(7, 7, 7, 0.08)),
    linear-gradient(0deg, rgba(7, 7, 7, 0.9), transparent 78%);
}

.consultation-hero-content {
  width: min(1320px, 100%);
  margin: 0 auto;
  padding: 120px var(--consultation-gutter) clamp(65px, 8vw, 95px);
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

.consultation-hero-content h1 {
  display: grid;
  max-width: 900px;
  margin-top: 20px;
  color: var(--color-text);
  font-size: clamp(38px, 5.2vw, 76px);
  font-weight: 400;
  line-height: 1.08;
  letter-spacing: -1.8px;
}

.consultation-hero-content h1 em {
  color: var(--color-champagne);
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
}

.consultation-hero-description {
  max-width: 580px;
  margin-top: 22px;
  color: #c7c2b6;
  font-size: clamp(14px, 1.4vw, 17px);
  line-height: 1.8;
}

.consultation-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 34px;
}

.button-gold,
.button-line {
  display: inline-flex;
  min-height: 50px;
  align-items: center;
  gap: 12px;
  padding: 0 26px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1.4px;
  text-decoration: none;
  transition: transform 0.25s ease, background-color 0.25s ease, border-color 0.25s ease;
}

.button-gold {
  background: var(--color-gold);
  color: #0b0b0a;
}

.button-gold:hover {
  transform: translateY(-2px);
  background: var(--color-champagne);
}

.button-line {
  border: 1px solid rgba(255, 255, 255, 0.26);
  background: rgba(15, 15, 15, 0.45);
  color: var(--color-text);
  backdrop-filter: blur(8px);
}

.button-line:hover {
  transform: translateY(-2px);
  border-color: var(--color-gold);
  color: var(--color-gold);
}

.consultation-hero-caption {
  position: absolute;
  right: var(--consultation-gutter);
  bottom: 24px;
  display: flex;
  gap: 16px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 8px;
  letter-spacing: 1.4px;
}

@media (max-width: 768px) {
  .consultation-hero-caption {
    display: none;
  }
}
</style>
