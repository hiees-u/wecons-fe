<template>
  <section class="product-hero">
    <div class="content-shell">
      <div class="hero-grid">
        <div class="hero-copy">
          <AppBreadcrumb :items="breadcrumbItems" />
          <h1>{{ model.title }}</h1>
          <div v-if="heroFacts.length" class="hero-facts">
            <div v-for="fact in heroFacts" :key="fact.label" class="hero-fact">
              <span>{{ fact.label }}</span>
              <strong>{{ fact.value }}</strong>
            </div>
          </div>
          <NuxtLink class="text-link" :to="consultationLink">
            {{ t('product_detail.cta_consult_estimate') }} <span aria-hidden="true">›</span>
          </NuxtLink>
        </div>
        <figure class="model-hero-visual">
          <img
            :src="model.image"
            :alt="model.imageAlt"
            width="1200"
            height="820"
            fetchpriority="high"
            @error="onImageError"
          >
        </figure>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import AppBreadcrumb from '~/components/common/AppBreadcrumb.vue'
import type { DetailModel } from '~/utils/catalogHelper'
import { useI18n } from '~/composables/useI18n'

defineProps<{
  model: DetailModel
  breadcrumbItems: Array<{ label: string; to?: string }>
  heroFacts: Array<{ label: string; value: string }>
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
.product-hero {
  padding: clamp(112px, 8vw, 140px) 0 clamp(56px, 7vw, 92px);
}

.content-shell {
  width: min(1515px, calc(100% - var(--page-gutter, 24px) * 2));
  margin: 0 auto;
}

.product-hero :deep(.app-breadcrumb) {
  margin-bottom: clamp(20px, 3vw, 36px);
}

.product-hero :deep(.app-breadcrumb .breadcrumb-list) {
  font-size: 18px;
  text-transform: none;
}

.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, .92fr) minmax(0, 1.08fr);
  align-items: center;
  gap: clamp(34px, 6vw, 78px);
}

.hero-copy h1 {
  font-family: var(--font-serif);
  font-size: clamp(36px, 3.4vw, 56px);
  font-weight: 400;
  line-height: 1.14;
}

.hero-facts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin: 32px 0 28px;
  padding: 20px 0;
  border-top: 1px solid rgba(245, 242, 235, .16);
  border-bottom: 1px solid rgba(245, 242, 235, .16);
}

.hero-fact span {
  display: block;
  font-size: 13px;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: var(--color-gold);
  margin-bottom: 6px;
}

.hero-fact strong {
  font-size: 18px;
  font-weight: 500;
  color: #fff;
}

.text-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--color-gold);
  text-decoration: none;
  font-size: 16px;
  transition: opacity .2s;
}

.text-link:hover {
  opacity: .8;
}

.model-hero-visual {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  margin: 0;
}

.model-hero-visual img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 1200 / 820;
  object-fit: cover;
}

@media (max-width: 900px) {
  .hero-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}
</style>
