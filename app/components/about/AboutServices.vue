<template>
  <section class="about-services" aria-labelledby="about-services-title">
    <SectionHeading
      :title="t('about_page.services_title')"
      heading-id="about-services-title"
      custom-class="about-services-heading"
    />

    <div class="about-service-grid">
      <NuxtLink
        v-for="(service, index) in services"
        :key="service.title"
        class="about-service-card"
        to="/danh-muc-san-pham"
      >
        <img
          :src="normalizeImageUrl(service.image)"
          :alt="service.alt"
          loading="lazy"
          width="1100"
          height="740"
          @error="onImgError"
        >
        <span class="about-service-number">0{{ index + 1 }}</span>
        <h3>{{ service.title }}</h3>
        <p>{{ service.description }}</p>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { normalizeImageUrl } from '~/utils/imageHelper'
import { useI18n } from '~/composables/useI18n'
import { useServiceHighlights } from '~/composables/useServiceHighlights'
import SectionHeading from '~/components/common/SectionHeading.vue'

const { t } = useI18n()
const sharedServices = useServiceHighlights()

function onImgError(e: Event) {
  const target = e.target as HTMLImageElement
  if (target && !target.dataset.fallbackApplied) {
    target.dataset.fallbackApplied = 'true'
    target.src = '/images/pg.webp'
  }
}
const services = computed(() => sharedServices.value.slice(0, 4))
</script>

<style scoped>
.about-services {
  padding: 16px 0 clamp(60px, 8vw, 100px);
  background: #292929;
}

.about-services :deep(.about-services-heading) {
  justify-content: center;
  margin-bottom: 20px;
  text-align: center;
}

.about-services :deep(.about-services-heading h2) {
  margin-top: 0;
  font-family: var(--font-serif);
  font-size: clamp(30px, 3.5vw, 44px);
  font-weight: 400;
  letter-spacing: -.8px;
}

.about-service-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 2px;
}

.about-service-card {
  position: relative;
  display: block;
  min-width: 0;
  aspect-ratio: .72;
  overflow: hidden;
  background: #181716;
  color: #fff;
  text-decoration: none;
  isolation: isolate;
}

.about-service-card::after {
  position: absolute;
  z-index: 1;
  inset: 0;
  background: linear-gradient(180deg, rgba(8, 8, 8, .2), rgba(8, 8, 8, .62));
  content: '';
}

.about-service-card img {
  position: absolute;
  z-index: 0;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .5s ease;
}

.about-service-card p {
  display: none;
}

.about-service-card:hover img,
.about-service-card:focus-visible img {
  transform: scale(1.04);
}

.about-service-number,
.about-service-card h3 {
  position: absolute;
  z-index: 2;
  right: 18px;
  left: 20px;
}

.about-service-number {
  top: 22px;
  color: var(--color-gold);
  font-family: var(--font-serif);
  font-size: clamp(24px, 3vw, 36px);
  font-style: italic;
}

.about-service-card h3 {
  top: 65px;
  font-size: clamp(15px, 1.5vw, 21px);
  font-weight: 600;
  line-height: 1.3;
}

.about-service-card:focus-visible {
  outline: 2px solid var(--color-champagne);
  outline-offset: 3px;
}

@media (min-width: 601px) and (hover: hover) {
  .about-service-card p {
    position: absolute;
    z-index: 2;
    right: 20px;
    bottom: 20px;
    left: 20px;
    display: block;
    overflow: hidden;
    color: rgba(255, 255, 255, .9);
    font-size: clamp(12px, 1vw, 15px);
    line-height: 1.55;
    opacity: 0;
    transform: translateY(10px);
    transition: opacity .3s ease, transform .3s ease;
  }

  .about-service-card:hover p,
  .about-service-card:focus-visible p {
    opacity: 1;
    transform: translateY(0);
  }

  .about-service-card:hover::after,
  .about-service-card:focus-visible::after {
    background: linear-gradient(180deg, rgba(8, 8, 8, .2), rgba(8, 8, 8, .82));
  }
}

@media (max-width: 760px) {
  .about-service-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .about-service-card {
    aspect-ratio: .85;
  }
}

@media (max-width: 420px) {
  .about-service-number {
    top: 14px;
    left: 13px;
  }

  .about-service-card h3 {
    top: 51px;
    right: 12px;
    left: 13px;
    font-size: 14px;
  }
}

@media (max-width: 600px) {
  .about-services {
    padding: 28px 0 42px;
  }

  .about-services :deep(.about-services-heading) {
    margin-bottom: 16px;
    padding: 0 16px;
  }

  .about-services :deep(.about-services-heading h2) {
    font-size: clamp(26px, 7.5vw, 32px);
  }

  .about-service-grid {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .about-service-card {
    aspect-ratio: .78;
    border-bottom: 1px solid rgba(245, 242, 235, .15);
  }

  .about-service-card::after {
    background: linear-gradient(180deg, rgba(8, 8, 8, .08) 18%, rgba(8, 8, 8, .22) 46%, rgba(8, 8, 8, .78) 100%);
  }

  .about-service-number {
    top: auto;
    right: 16px;
    bottom: 116px;
    left: 16px;
    font-size: 44px;
  }

  .about-service-card h3 {
    top: auto;
    right: 16px;
    bottom: 76px;
    left: 16px;
    font-size: clamp(21px, 6vw, 25px);
    font-weight: 700;
    line-height: 1.2;
  }

  .about-service-card p {
    position: absolute;
    z-index: 2;
    right: 16px;
    bottom: 18px;
    left: 16px;
    display: -webkit-box;
    overflow: hidden;
    color: rgba(255, 255, 255, .9);
    font-size: 12px;
    line-height: 1.55;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }
}
</style>
