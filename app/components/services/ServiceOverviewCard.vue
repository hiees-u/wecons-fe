<template>
  <article class="service-item">
    <div class="service-item-heading">
      <span class="service-item-number">{{ service.category }}</span>
      <h3>{{ service.title }}</h3>
    </div>
    <div class="service-item-image">
      <img
        :src="normalizeImageUrl(service.image)"
        :alt="service.alt"
        loading="lazy"
        width="1100"
        height="740"
        @error="onImgError"
      >
    </div>
    <div class="service-item-copy">
      <p>{{ service.description }}</p>
      <NuxtLink
        class="text-link"
        :to="`/dich-vu/${service.slug || slugify(service.title)}`"
      >
        {{ t('services_page.view_details') }} <span aria-hidden="true">↗</span>
      </NuxtLink>
    </div>
  </article>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'
import { normalizeImageUrl } from '~/utils/imageHelper'
import type { ServiceHighlight } from '~/types/content'

defineProps<{ service: ServiceHighlight }>()

const { t } = useI18n()

function slugify(text: string): string {
  return text.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function onImgError(e: Event) {
  const target = e.target as HTMLImageElement
  if (target && !target.dataset.fallbackApplied) {
    target.dataset.fallbackApplied = 'true'
    target.src = '/images/pg.webp'
  }
}
</script>

<style scoped>
.service-item {
  display: grid;
  grid-template-columns: minmax(0, .9fr) minmax(0, 1fr) minmax(0, 1fr);
  align-items: center;
  gap: clamp(20px, 3.2vw, 52px);
  padding: clamp(30px, 3.8vw, 48px) 0;
  border-bottom: 1px solid var(--color-border);
}

.service-item:first-child {
  border-top: 1px solid var(--color-border);
}

.service-item-heading {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.service-item-number {
  color: var(--color-gold);
  font-family: var(--font-serif);
  font-size: clamp(26px, 2.5vw, 36px);
  font-style: italic;
  line-height: 1;
}

.service-item-image {
  position: relative;
  aspect-ratio: 1.5;
  overflow: hidden;
  background: var(--color-surface);
}

.service-item-image img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.service-item:hover .service-item-image img {
  transform: scale(1.025);
}

.service-item-heading h3 {
  color: var(--color-text);
  font-family: var(--font-heading);
  font-size: var(--type-h3);
  font-weight: 600;
  letter-spacing: -.4px;
}

.service-item-copy > p {
  max-width: 480px;
  color: var(--color-muted);
  font-size: var(--type-service-body);
  font-weight: 400;
  line-height: 1.7;
}

.service-item-copy .text-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 18px;
  color: var(--color-gold);
  font-size: var(--type-cta);
  font-weight: 600;
  letter-spacing: 0;
  text-decoration: none;
  transition: gap 0.25s ease, color 0.25s ease;
}

.service-item-copy .text-link:hover {
  gap: 9px;
  color: var(--color-champagne);
}

@media (max-width: 760px) {
  .service-item {
    grid-template-columns: 1fr;
    gap: 18px;
    padding: 28px 0;
  }

  .service-item-heading {
    gap: 10px;
  }

  .service-item-heading h3 {
    font-size: var(--type-h3);
  }

  .service-item-image {
    aspect-ratio: 1.55;
  }
}

@media (prefers-reduced-motion: reduce) {
  .service-item-image img {
    transition: none;
  }
}
</style>
