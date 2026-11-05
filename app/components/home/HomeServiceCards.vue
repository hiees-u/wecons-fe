<template>
  <section id="services" class="section services-section">
    <SectionHeading
      :eyebrow="eyebrow"
      :title="title"
      :style-center="true"
    />
    <h2 v-if="mobileTitle" class="services-mobile-title">{{ mobileTitle }}</h2>
    <p v-if="description" class="services-section-intro">{{ description }}</p>

    <div class="service-grid">
      <article
        v-for="(service, index) in services"
        :key="service.title"
        class="service-card"
      >
        <NuxtLink
          class="service-image"
          :to="linkToCategory ? defaultServicePath : (service.slug ? `/dich-vu/${service.slug}` : defaultServicePath)"
          :aria-label="linkToCategory ? service.title : `${exploreLabel} - ${service.title}`"
        >
          <img
            :src="getOptimizedImageUrl(service.image, 768)"
            :srcset="getImageSrcset(service.image, [480, 768, 1100])"
            sizes="(max-width: 768px) 100vw, 550px"
            :alt="service.alt"
            loading="lazy"
            width="1100"
            height="740"
          >
          <span class="service-number">0{{ index + 1 }}</span>
          <div class="service-copy">
            <p class="card-kicker">{{ service.category }}</p>
            <h3>{{ service.title }}</h3>
            <p class="service-detail">{{ service.detail }}</p>
            <span v-if="showExploreAction" class="text-link">
              {{ exploreLabel }} <span aria-hidden="true">↗</span>
            </span>
          </div>
        </NuxtLink>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import SectionHeading from '~/components/common/SectionHeading.vue'
import type { HomeImageItem } from '~/types/content'
import { getImageSrcset, getOptimizedImageUrl } from '~/utils/imageHelper'

withDefaults(defineProps<{
  eyebrow: string
  title: string
  mobileTitle?: string
  description?: string
  exploreLabel: string
  services: HomeImageItem[]
  defaultServicePath?: string
  linkToCategory?: boolean
  showExploreAction?: boolean
}>(), {
  defaultServicePath: '/danh-muc-dich-vu',
  linkToCategory: false,
  showExploreAction: true,
})
</script>
