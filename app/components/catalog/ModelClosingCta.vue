<template>
  <section class="closing-cta content-shell">
    <img
      class="cta-image"
      :src="image"
      alt=""
      loading="lazy"
      @error="onImageError"
    >
    <div class="cta-overlay"></div>
    <div class="cta-copy">
      <p class="eyebrow"><span></span>{{ t('product_detail.cta_eyebrow') }}</p>
      <h2>{{ t('product_detail.cta_title') }} <em>{{ t('product_detail.cta_title_accent') }}</em></h2>
      <p>{{ description || t('product_detail.cta_desc') }}</p>
    </div>
    <div class="cta-actions">
      <NuxtLink class="button-gold" :to="consultationLink">
        {{ t('product_detail.cta_contact') }} <span aria-hidden="true">↗</span>
      </NuxtLink>
      <NuxtLink class="button-outline" to="/bao-gia">{{ t('product_detail.cta_estimate') }}</NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'

defineProps<{
  image: string
  description?: string
  consultationLink: { path: string; hash?: string; query?: Record<string, string> }
}>()

const { t } = useI18n()

function onImageError(event: Event): void {
  const image = event.target as HTMLImageElement
  if (image.dataset.fallbackApplied) return
  image.dataset.fallbackApplied = 'true'
  image.src = '/images/pg.webp'
}
</script>

<style scoped>
.closing-cta {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  padding: clamp(48px, 6vw, 84px) clamp(28px, 4vw, 64px);
  margin-top: clamp(48px, 6vw, 84px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
}

.content-shell {
  width: min(1515px, calc(100% - var(--page-gutter, 24px) * 2));
  margin: 0 auto;
}

.cta-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

.cta-overlay {
  position: absolute;
  inset: 0;
  background: rgba(18, 18, 18, .86);
  z-index: 2;
}

.cta-copy,
.cta-actions {
  position: relative;
  z-index: 3;
}

.cta-copy {
  max-width: 680px;
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--color-gold);
  font-size: 13px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.eyebrow span {
  width: 28px;
  height: 1px;
  background: var(--color-gold);
}

.cta-copy h2 {
  font-family: var(--font-serif);
  font-size: clamp(30px, 3vw, 46px);
  font-weight: 400;
  line-height: 1.2;
  margin-bottom: 14px;
}

.cta-copy em {
  font-style: italic;
  color: var(--color-gold);
}

.cta-copy p {
  color: rgba(245, 242, 235, .82);
  line-height: 1.7;
}

.cta-actions {
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex-shrink: 0;
}

.button-gold {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 28px;
  background: var(--color-gold);
  color: #1a1a1a;
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  border-radius: 2px;
  transition: opacity .2s;
}

.button-gold:hover {
  opacity: .9;
}

.button-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 13px 28px;
  border: 1px solid rgba(245, 242, 235, .3);
  color: #fff;
  text-decoration: none;
  font-size: 15px;
  border-radius: 2px;
  transition: all .2s;
}

.button-outline:hover {
  border-color: var(--color-gold);
  color: var(--color-gold);
}

@media (max-width: 900px) {
  .closing-cta {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
