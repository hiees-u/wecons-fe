<template>
  <section class="story-section">
    <div class="content-shell story-grid">
      <figure class="story-image">
        <img
          :src="image"
          :alt="imageAlt"
          width="1000"
          height="760"
          loading="lazy"
          @error="onImageError"
        >
      </figure>
      <div class="story-copy">
        <h2>{{ t('product_detail.story_title') }}</h2>
        <p v-for="(paragraph, index) in paragraphs" :key="index">{{ paragraph }}</p>
        <NuxtLink class="text-link" :to="consultationLink">
          {{ t('product_detail.cta_consult_estimate') }} <span aria-hidden="true">›</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'

defineProps<{
  image: string
  imageAlt: string
  paragraphs: string[]
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
.story-section {
  padding: clamp(48px, 6vw, 84px) 0;
  background: rgba(255, 255, 255, .02);
}

.content-shell {
  width: min(1515px, calc(100% - var(--page-gutter, 24px) * 2));
  margin: 0 auto;
}

.story-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: center;
  gap: clamp(34px, 6vw, 78px);
}

.story-image {
  margin: 0;
  overflow: hidden;
  border-radius: 4px;
}

.story-image img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 1000 / 760;
  object-fit: cover;
}

.story-copy h2 {
  font-family: var(--font-serif);
  font-size: clamp(28px, 2.6vw, 40px);
  margin-bottom: 24px;
  line-height: 1.2;
}

.story-copy p {
  line-height: 1.8;
  color: rgba(245, 242, 235, .82);
  margin-bottom: 18px;
}

.text-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--color-gold);
  text-decoration: none;
  font-size: 16px;
  margin-top: 10px;
}

@media (max-width: 900px) {
  .story-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}
</style>
