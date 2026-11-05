<template>
  <section id="benefits" class="section benefits-section" aria-labelledby="benefits-title">
    <div class="benefits-heading">
      <p class="eyebrow"><span></span> {{ t('home.benefits.eyebrow') }}</p>
      <h2 id="benefits-title">{{ t('home.benefits.title') }}</h2>
    </div>
    <div class="benefit-grid">
      <article v-for="(benefit, index) in benefits" :key="benefit.title" class="benefit-item">
        <svg
          class="benefit-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.35"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path v-for="path in icons[index]" :key="path" :d="path" />
        </svg>
        <p>{{ benefit.body }}</p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import homeData from '~/data/homeContent.json'
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()
const benefits = homeData.benefits
const icons = [
  ['M9 18h6', 'M10 22h4', 'M8.2 14.5A7 7 0 1 1 15.8 14.5c-.9.6-1.3 1.4-1.3 2.5h-5c0-1.1-.4-1.9-1.3-2.5Z'],
  ['M21 11.5a8.5 8.5 0 0 1-12.4 7.6L3 21l1.9-5.6A8.5 8.5 0 1 1 21 11.5Z', 'M8 11.5h.01', 'M12 11.5h.01', 'M16 11.5h.01'],
  ['M14.7 6.3a5 5 0 0 0-6.4 6.4L3 18l3 3 5.3-5.3a5 5 0 0 0 6.4-6.4l-3.1 3.1-3-3 3.1-3.1Z'],
  ['M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', 'M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z', 'm16 11 2 2 4-4', 'M17 3.5a4 4 0 0 1 4 4'],
  ['M5 3h11l4 4v14H5z', 'M16 3v5h4', 'M8 12h8', 'M8 16h4', 'M15 16h1', 'M14 11.5c0-.8.7-1.5 1.6-1.5s1.6.7 1.6 1.5-.7 1.5-1.6 1.5-1.6.7-1.6 1.5.7 1.5 1.6 1.5 1.6-.7 1.6-1.5'],
  ['M4 20 17.5 6.5', 'M14.5 5.5l4 4', 'M3 21l4-.8-.8-3.2z', 'M13 4l2-2 7 7-2 2'],
]
</script>
