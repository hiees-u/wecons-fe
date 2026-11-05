<template>
  <section class="about-portfolio section" aria-labelledby="about-portfolio-title">
    <div class="about-portfolio-copy">
      <h2 id="about-portfolio-title">
        <span class="about-portfolio-title-default">{{ portfolio?.title || t('about_page.portfolio_title') }}</span>
        <span class="about-portfolio-title-mobile">{{ t('about_page.portfolio_title') }}</span>
      </h2>
      <p>{{ portfolio?.description || t('about_page.portfolio_description') }}</p>
      <p class="about-portfolio-description-secondary">{{ t('about_page.portfolio_description_secondary') }}</p>
      <NuxtLink class="text-link" to="/du-an">
        {{ t('about_page.portfolio_link') }} <span aria-hidden="true">›</span>
      </NuxtLink>
    </div>
    <img
      :src="portfolio?.image || '/images/image-2.webp'"
      :alt="t('about_page.portfolio_image_alt')"
      loading="lazy"
      width="767"
      height="510"
    >
  </section>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'

defineProps<{
  portfolio?: {
    title: string
    description: string
    image: string
  }
}>()

const { t } = useI18n()
</script>

<style scoped>
.about-portfolio {
  display: grid;
  grid-template-columns: minmax(0, 520px) minmax(0, 1fr);
  align-items: center;
  gap: clamp(32px, 6vw, 96px);
  width: min(var(--about-content-width, 1515px), 100%);
  margin: 0 auto;
  padding-top: clamp(48px, 6vw, 96px);
  padding-bottom: clamp(48px, 6vw, 96px);
}

.about-portfolio-copy h2 {
  color: var(--color-text);
  font-family: var(--font-serif);
  font-size: clamp(32px, 4vw, 56px);
  font-weight: 400;
  letter-spacing: -1.6px;
  line-height: 1.15;
}

.about-portfolio-title-mobile {
  display: none;
}

.about-portfolio-copy p {
  margin-top: 20px;
  color: rgba(245, 242, 235, .78);
  font-size: 16px;
  line-height: 1.75;
}

.about-portfolio-copy p:first-of-type {
  font-size: 18px;
}

.about-portfolio-copy .text-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 32px;
  color: var(--color-gold);
  font-size: 14px;
  letter-spacing: .08em;
  text-decoration: none;
  text-transform: uppercase;
}

.about-portfolio > img {
  display: block;
  width: 100%;
  aspect-ratio: 767 / 510;
  object-fit: cover;
}

@media (max-width: 900px) {
  .about-portfolio {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

@media (max-width: 600px) {
  .about-portfolio {
    gap: 18px;
    padding: 32px 16px 38px;
    background: #292929;
  }

  .about-portfolio-title-default {
    display: none;
  }

  .about-portfolio-title-mobile {
    display: inline;
  }

  .about-portfolio-copy h2 {
    font-size: clamp(29px, 8vw, 35px);
    letter-spacing: -.7px;
    line-height: 1.18;
  }

  .about-portfolio-copy p {
    margin-top: 12px;
    font-size: 13px;
    line-height: 1.7;
  }

  .about-portfolio-copy p:first-of-type {
    font-size: 14px;
  }

  .about-portfolio-description-secondary {
    display: none;
  }

  .about-portfolio-copy .text-link {
    gap: 6px;
    margin-top: 20px;
    padding-bottom: 4px;
    border-bottom: 1px solid currentColor;
    font-size: 12px;
    letter-spacing: 0;
    text-decoration: none;
  }

  .about-portfolio-copy .text-link span {
    display: none;
  }

  .about-portfolio-copy .text-link::after {
    content: '→';
  }

  .about-portfolio > img {
    aspect-ratio: 1.45;
  }
}
</style>
