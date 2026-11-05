<template>
  <section class="description-section content-shell" :class="{ 'has-feature-details': detailFallback?.feature_images?.length }">
    <div class="description-copy">
      <template v-if="detailFallback?.feature_images?.length">
        <template v-for="(featureImage, index) in detailFallback.feature_images" :key="featureImage.src">
          <figure class="detail-feature-image">
            <img :src="featureImage.src" :alt="imageAlt" loading="lazy" @error="onImageError">
            <figcaption v-if="featureImage.caption || featureImage.caption_en">
              {{ localized(featureImage.caption, featureImage.caption_en) }}
            </figcaption>
          </figure>
          <p v-if="descriptionParagraphs[index]">{{ descriptionParagraphs[index] }}</p>
        </template>
      </template>
      <template v-else>
        <p class="eyebrow"><span></span>{{ t('product_detail.description_title') }}</p>
        <template v-for="(block, index) in descriptionBlocks" :key="`${block.kind}-${index}`">
          <h3 v-if="block.kind === 'heading'">{{ block.text }}</h3>
          <blockquote v-else-if="block.kind === 'quote'">{{ block.text }}</blockquote>
          <p v-else-if="block.kind === 'paragraph' || block.kind === 'list-item'">{{ block.text }}</p>
        </template>
      </template>
    </div>

    <!-- <div class="documents">
      <h2>{{ localized(detailFallback?.documents_title, detailFallback?.documents_title_en) || t('product_detail.documents_title') }}</h2>
      <ul>
        <li v-for="document in architectureDocuments" :key="document">{{ document }}</li>
      </ul>
      <p class="documents-note">{{ localized(detailFallback?.documents_note, detailFallback?.documents_note_en) || t('product_detail.documents_note') }}</p>
      <p v-for="(paragraph, index) in closingParagraphs" :key="index" class="closing-paragraph">{{ paragraph }}</p>
    </div> -->
  </section>
</template>

<script setup lang="ts">
import type { ProductDetailFallback } from '~/utils/catalogHelper'
import { localizedFallback } from '~/utils/catalogHelper'
import { useI18n } from '~/composables/useI18n'

const props = defineProps<{
  detailFallback: ProductDetailFallback | null
  imageAlt: string
  descriptionParagraphs: string[]
  descriptionBlocks: Array<{ kind: string; text: string }>
  architectureDocuments: string[]
  closingParagraphs: string[]
}>()

const { t, locale } = useI18n()

function localized(vi?: string, en?: string): string {
  return localizedFallback(locale.value, vi, en)
}

function onImageError(event: Event): void {
  const image = event.target as HTMLImageElement
  if (image.dataset.fallbackApplied) return
  image.dataset.fallbackApplied = 'true'
  image.src = '/images/pg.webp'
}
</script>

<style scoped>
.description-section {
  /* display: grid; */
  /* grid-template-columns: minmax(0, 1.2fr) minmax(0, .8fr); */
  gap: clamp(34px, 5vw, 64px);
  padding: clamp(36px, 5vw, 64px) 0;
  border-top: 1px solid rgba(245, 242, 235, .1);
}

.content-shell {
  width: min(1515px, calc(100% - var(--page-gutter, 24px) * 2));
  margin: 0 auto;
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--color-gold);
  font-size: 13px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-bottom: 18px;
}

.eyebrow span {
  width: 24px;
  height: 1px;
  background: var(--color-gold);
}

.detail-feature-image {
  margin: 0 0 20px;
  overflow: hidden;
  border-radius: 4px;
}

.detail-feature-image img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 10;
  object-fit: cover;
}

.detail-feature-image figcaption {
  font-size: 14px;
  color: rgba(245, 242, 235, .6);
  padding: 8px 0;
  font-style: italic;
  text-align: center;
}

.description-copy p {
  line-height: 1.8;
  color: rgba(245, 242, 235, .82);
  margin-bottom: 18px;
}

.documents {
  background: rgba(255, 255, 255, .03);
  padding: clamp(24px, 3.5vw, 44px);
  border-radius: 4px;
  height: fit-content;
}

.documents h2 {
  font-family: var(--font-serif);
  font-size: clamp(22px, 2vw, 28px);
  margin-bottom: 20px;
  color: var(--color-gold);
}

.documents ul {
  list-style: none;
  padding: 0;
  margin: 0 0 20px;
}

.documents li {
  position: relative;
  padding-left: 20px;
  margin-bottom: 12px;
  color: rgba(245, 242, 235, .9);
  line-height: 1.6;
}

.documents li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--color-gold);
}

.documents-note {
  font-size: 14px;
  color: rgba(245, 242, 235, .55);
  font-style: italic;
  margin-bottom: 16px;
}

.closing-paragraph {
  line-height: 1.7;
  color: rgba(245, 242, 235, .75);
}

@media (max-width: 900px) {
  .description-section {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}
</style>
