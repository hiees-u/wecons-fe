<template>
  <section v-if="images.length" class="gallery-section content-shell">
    <figure class="gallery-main">
      <img
        :key="activeImage"
        :src="activeImage"
        :alt="t('product_detail.gallery_image', { number: activeIndex + 1 })"
        width="1600"
        height="1000"
        loading="lazy"
        @error="onImageError"
      >
    </figure>
    <div v-if="images.length > 1" class="gallery-thumbnails" :aria-label="t('product_detail.gallery_navigation')">
      <button
        v-for="(image, index) in images"
        :key="image"
        type="button"
        class="gallery-thumbnail"
        :class="{ 'is-active': index === activeIndex }"
        :aria-label="t('product_detail.gallery_image', { number: index + 1 })"
        :aria-pressed="index === activeIndex"
        @click="activeIndex = index"
      >
        <img :src="image" alt="" loading="lazy" @error="onImageError">
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from '~/composables/useI18n'

const props = defineProps<{
  images: string[]
  fallbackImage: string
}>()

const { t } = useI18n()
const activeIndex = ref(0)
const activeImage = computed(() => props.images[activeIndex.value] || props.fallbackImage || '')

function onImageError(event: Event): void {
  const image = event.target as HTMLImageElement
  if (image.dataset.fallbackApplied) return
  image.dataset.fallbackApplied = 'true'
  image.src = '/images/pg.webp'
}
</script>

<style scoped>
.gallery-section {
  padding: clamp(36px, 5vw, 64px) 0;
}

.content-shell {
  width: min(1515px, calc(100% - var(--page-gutter, 24px) * 2));
  margin: 0 auto;
}

.gallery-main {
  margin: 0 0 18px;
  overflow: hidden;
  border-radius: 4px;
}

.gallery-main img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 1600 / 1000;
  object-fit: cover;
}

.gallery-thumbnails {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.gallery-thumbnail {
  /* flex: 0 0 clamp(90px, 12vw, 150px); */
  aspect-ratio: 16 / 10;
  padding: 0;
  border: 2px solid transparent;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  overflow: hidden;
  opacity: .5;
  transition: all .2s;
}

.gallery-thumbnail:hover,
.gallery-thumbnail.is-active {
  opacity: 1;
  border-color: var(--color-gold);
}

.gallery-thumbnail img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
