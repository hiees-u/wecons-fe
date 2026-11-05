<template>
  <article class="model-card">
    <NuxtLink
      class="model-image"
      :to="model.slug
        ? `/danh-muc-san-pham/${model.slug}`
        : '/lien-he#consultation-form'"
      :aria-label="model.slug ? model.title : t('house_models_page.aria_discuss', { name: model.title })"
    >
      <img
        :src="normalizeImageUrl(model.image)"
        :alt="model.alt"
        loading="lazy"
        width="900"
        height="620"
        @error="onImgError"
      >
      <span class="model-index">{{ formattedIndex }}</span>
      <span class="model-overlay"></span>
      <span class="model-copy">
        <span class="model-category">{{ model.category }}</span>
        <strong>{{ model.title }}</strong>
        <span class="model-detail">{{ model.detail }} <span aria-hidden="true">↗</span></span>
      </span>
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { normalizeImageUrl } from '~/utils/imageHelper'
import type { HomeImageItem } from '~/types/content'
import { useI18n } from '~/composables/useI18n'

const props = defineProps<{
  model: HomeImageItem
  index: number
}>()

const { t } = useI18n()

const formattedIndex = computed(() => {
  const num = props.index + 1
  return num < 10 ? `0${num}` : `${num}`
})

function onImgError(e: Event) {
  const target = e.target as HTMLImageElement
  if (target && !target.dataset.fallbackApplied) {
    target.dataset.fallbackApplied = 'true'
    target.src = '/images/pg.webp'
  }
}
</script>

<style scoped>
.model-card {
  min-width: 0;
}
.model-image {
  position: relative;
  display: block;
  aspect-ratio: 1.28;
  overflow: hidden;
  background: var(--color-surface);
  color: var(--color-text);
  text-decoration: none;
}
.model-image img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .55s cubic-bezier(.22, 1, .36, 1);
}
.model-card:hover .model-image img {
  transform: scale(1.045);
}
.model-index {
  position: absolute;
  top: 14px;
  left: 14px;
  padding: 6px 9px;
  background: rgba(9, 9, 9, 0.78);
  color: var(--color-champagne);
  font-size: 8px;
  letter-spacing: 1px;
}
.model-overlay {
  position: absolute;
  inset: 20% 0 0;
  background: linear-gradient(0deg, rgba(0, 0, 0, .88), transparent);
}
.model-copy {
  position: absolute;
  right: 18px;
  bottom: 18px;
  left: 18px;
  display: grid;
  gap: 7px;
  text-align: center;
}
.model-category {
  color: var(--color-gold);
  font-family: var(--font-serif);
  font-size: 12px;
  font-style: italic;
}
.model-copy strong {
  color: #fff;
  font-size: clamp(12px, 1.25vw, 15px);
  font-weight: 500;
  line-height: 1.5;
}
.model-detail {
  color: rgba(255, 255, 255, .75);
  font-size: 9px;
  letter-spacing: .3px;
}
.model-detail > span {
  color: var(--color-gold);
}
.model-image:focus-visible {
  outline: 2px solid var(--color-champagne);
  outline-offset: 4px;
}
@media (prefers-reduced-motion: reduce) {
  .model-image img {
    transition: none;
  }
}
</style>
