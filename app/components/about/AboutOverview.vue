<template>
  <section class="about-overview" :aria-label="t('about_page.statistics_label')">
    <div class="about-overview-content">
      <div class="about-overview-copy">
        <h2>{{ overview?.title || t('about_page.overview_title') }}</h2>
        <p>{{ overview?.description || t('about_page.overview_description') }}</p>
      </div>
      <img
        class="about-overview-image"
        :src="overview?.image || '/images/bg-3.webp'"
        :alt="t('about_page.overview_image_alt')"
        loading="lazy"
        >
        <!-- width="1600"
        height="900" -->
    </div>
    <dl class="about-overview-stats">
      <div v-for="metric in metrics" :key="metric.label">
        <dd>
          <i :class="metric.icon" aria-hidden="true"></i>
          <span>{{ metric.value }}</span>
        </dd>
        <dt>{{ metric.label }}</dt>
      </div>
    </dl>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'

defineProps<{
  overview?: {
    title: string
    description: string
    image: string
  }
  metrics: Array<{
    value: string
    label: string
    icon: string
  }>
}>()

const { t } = useI18n()
</script>

<style scoped>
.about-overview {
  display: grid;
  gap: 65px;
  padding: clamp(42px, 6vw, 78px) 0 0;
  background: #292929;
}

.about-overview .about-overview-image {
  width: 100vw;
}

.about-overview-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
  width: min(var(--about-content-width, 1515px), 100%);
  margin: 0 auto;
}

.about-overview-image {
  display: block;
  width: 100%;
  aspect-ratio: 2.3;
  object-fit: cover;
}

.about-overview-copy {
  min-width: 0;
  max-width: 1255px;
  text-align: center;
}

.about-overview-copy h2 {
  color: var(--color-text);
  font-family: var(--font-serif);
  font-size: clamp(32px, 4vw, 60px);
  font-weight: 400;
  letter-spacing: -1.6px;
  line-height: 1.15;
}

.about-overview-copy p {
  max-width: 1010px;
  margin: 14px auto 0;
  color: rgba(245, 242, 235, .78);
  font-size: 18px;
  line-height: 1.75;
}

.about-overview-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  width: min(var(--about-content-width, 1515px), 100%);
  margin: clamp(32px, 6vw, 50px) auto;
  padding: 34px 0;
  background: #141414;
}

.about-overview-stats > div {
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 15px;
  border-left: 1px solid rgba(245, 242, 235, .28);
}

.about-overview-stats > div:first-child {
  border-left: 0;
}

.about-overview-stats dd {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: #fff;
  font-size: clamp(28px, 3vw, 42px);
  font-weight: 700;
  line-height: 1.1;
}

.about-overview-stats dd i {
  color: var(--color-gold);
  font-size: 32px;
  /* font-weight: 400; */
}

.about-overview-stats dt {
  margin-top: 8px;
  color: rgba(245, 242, 235, .88);
  font-size: 13px;
  letter-spacing: .08em;
  text-transform: uppercase;
}

@media (max-width: 768px) {
  .about-overview-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px 0;
  }

  .about-overview-stats > div:nth-child(3) {
    border-left: 0;
  }
}

@media (max-width: 600px) {
  .about-overview-content {
    gap: 18px;
  }

  .about-overview-image {
    aspect-ratio: 1.8;
  }
}
</style>
