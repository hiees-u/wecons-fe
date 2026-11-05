<template>
  <section class="trust-strip" :aria-label="t('home.trust.metrics_aria')">
    <div class="trust-inner">
      <div v-for="item in displayMetrics" :key="item.value" class="trust-item">
        <strong>{{ item.value }}</strong><span>{{ item.label }}</span>
      </div>
      <p class="metric-note">{{ t('home.trust.license_note') }}</p>
    </div>
  </section>

  <section id="about" class="section intro-section">
    <div class="intro-image-wrap">
      <img
        :src="getOptimizedImageUrl(trustIntroImage || '/images/bg-3.webp', 900)"
        :srcset="getImageSrcset(trustIntroImage || '/images/bg-3.webp', [480, 800, 1200])"
        sizes="(max-width: 768px) 100vw, 650px"
        :alt="t('home.trust.image_alt')"
        loading="lazy"
        width="1300"
        height="960"
      >
      <span class="image-index">{{ t('home.trust.image_badge') }}</span>
    </div>
    <div class="intro-copy">
      <p class="eyebrow"><span></span> {{ t('home.trust.eyebrow') }}</p>
      <h2>{{ t('home.trust.title_1') }}<br><em>{{ t('home.trust.title_2') }}</em></h2>
      <p class="body-copy">{{ t('home.trust.desc') }}</p>
      <div class="value-list">
        <div v-for="(value, index) in displayValues" :key="index" class="value-item">
          <span>0{{ index + 1 }}</span>
          <strong>{{ typeof value === 'string' ? value : (value.title + ' — ' + value.subtitle) }}</strong>
        </div>
      </div>
      <NuxtLink class="text-link" to="/gioi-thieu">{{ t('home.trust.btn_more') }} <span aria-hidden="true">↗</span></NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import homeData from '~/data/homeContent.json'
import { getOptimizedImageUrl, getImageSrcset } from '~/utils/imageHelper'
import { useI18n } from '~/composables/useI18n'
import { useSiteSettings } from '~/composables/useSiteSettings'

const { t } = useI18n()
const { metrics: siteMetrics, homeValues, trustIntroImage } = useSiteSettings()

const displayMetrics = computed(() => (siteMetrics.value?.length ? siteMetrics.value : homeData.metrics))
const displayValues = computed(() => (homeValues.value?.length ? homeValues.value : homeData.values))
</script>
