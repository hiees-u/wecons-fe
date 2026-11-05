<template>
  <article class="project-card">
    <NuxtLink
      class="project-image"
      :to="`/du-an/${project.slug || project.id}`"
      :aria-label="t('projects_page.view_project', { name: project.name })"
    >
      <img
        v-if="project.image"
        :src="getImageUrl(project.image)"
        :alt="project.name"
        loading="lazy"
        width="1200"
        height="900"
        @error="onImgError"
      >
      <span class="project-index">{{ formattedIndex }}</span>
      <span class="project-open" aria-hidden="true">↗</span>
      <div class="project-image-shade"></div>
    </NuxtLink>
    <div class="project-copy">
      <p>{{ project.type || project.category || t('projects_page.default_category') }}</p>
      <h3>
        <NuxtLink :to="`/du-an/${project.slug || project.id}`">
          {{ project.name }}
        </NuxtLink>
      </h3>
      <span v-if="project.location">{{ project.location }}</span>
      <span v-if="project.area">{{ project.area }}</span>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PublishedProject } from '~/types/project'
import { getImageUrl } from '~/utils/formatters'
import { useI18n } from '~/composables/useI18n'

const props = defineProps<{
  project: PublishedProject
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
.project-card {
  min-width: 0;
}
.project-image {
  position: relative;
  display: block;
  aspect-ratio: 1.32;
  overflow: hidden;
  background: var(--color-surface);
}
.project-image img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
.project-card:hover .project-image img {
  transform: scale(1.025);
}
.project-image-shade {
  position: absolute;
  inset: 45% 0 0;
  background: linear-gradient(0deg, rgba(9, 9, 9, 0.46), transparent);
  pointer-events: none;
}
.project-index,
.project-open {
  position: absolute;
  z-index: 1;
  display: grid;
  place-items: center;
  background: rgba(9, 9, 9, 0.78);
  color: var(--color-champagne);
}
.project-index {
  top: 14px;
  left: 14px;
  padding: 6px 9px;
  font-size: 8px;
  letter-spacing: 1px;
}
.project-open {
  right: 14px;
  bottom: 14px;
  width: 34px;
  height: 34px;
  border: 1px solid rgba(245, 242, 235, 0.45);
  font-size: 15px;
}
.project-image:focus-visible,
.project-copy a:focus-visible {
  outline: 2px solid var(--color-champagne);
  outline-offset: 4px;
}
.project-copy {
  padding: 16px 2px 0;
}
.project-copy > p {
  color: var(--color-gold);
  font-size: 7px;
  font-weight: 600;
  letter-spacing: 1.25px;
}
.project-copy h3 {
  margin-top: 8px;
  font-size: 19px;
  font-weight: 500;
}
.project-copy h3 a {
  color: var(--color-text);
  text-decoration: none;
}
.project-copy > span {
  display: inline-block;
  margin: 9px 12px 0 0;
  color: var(--color-muted);
  font-size: 10px;
}
@media (max-width: 650px) {
  .project-image {
    aspect-ratio: 1.17;
  }
}
@media (prefers-reduced-motion: reduce) {
  .project-image img {
    transition: none;
  }
}
</style>
