<template>
  <section class="editorial-hero" :class="{ 'editorial-hero--compact': compact }" :aria-labelledby="titleId">
    <picture class="editorial-hero-picture">
      <source v-if="resolvedImageMobile" media="(max-width: 768px)" :srcset="resolvedImageMobile">
      <img
        class="editorial-hero-image"
        :src="getOptimizedImageUrl(resolvedImage, 1600)"
        :srcset="getImageSrcset(resolvedImage, [640, 1024, 1600])"
        sizes="100vw"
        :alt="imageAlt"
        fetchpriority="high"
        width="1600"
        height="900"
        @error="onImgError"
      >
    </picture>
    <div class="editorial-hero-shade" aria-hidden="true"></div>
    <div class="editorial-hero-copy">
      <nav v-if="compact && breadcrumbLabel" class="editorial-breadcrumb" :aria-label="t('common.breadcrumb_label', 'Điều hướng trang')">
        <NuxtLink to="/">
          <i class="fa-solid fa-house" aria-hidden="true"></i>
          {{ breadcrumbHome }}
        </NuxtLink>
        <template v-if="breadcrumbParent">
          <span aria-hidden="true">·</span>
          <NuxtLink :to="breadcrumbParent.to">{{ breadcrumbParent.label }}</NuxtLink>
        </template>
        <span aria-hidden="true">·</span>
        <span aria-current="page">{{ breadcrumbLabel }}</span>
      </nav>
      <p v-if="!compact" class="editorial-eyebrow"><span></span>{{ eyebrow }}</p>
      <h1 :id="titleId">
        <template v-if="mobileTitle">
          <span class="editorial-hero-title-desktop">{{ title }}<em v-if="titleAccent">{{ titleAccent }}</em></span>
          <span class="editorial-hero-title-mobile">{{ mobileTitle }}</span>
        </template>
        <template v-else>{{ title }}<em v-if="titleAccent">{{ titleAccent }}</em></template>
      </h1>
      <p v-if="!compact" class="editorial-hero-description">{{ description }}</p>
      <NuxtLink v-if="ctaLabel && !compact" class="editorial-hero-cta" :to="ctaTo">
        {{ ctaLabel }} <span aria-hidden="true">↗</span>
      </NuxtLink>
    </div>
    <p v-if="caption && !compact" class="editorial-hero-caption">{{ caption }}</p>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getOptimizedImageUrl, getImageSrcset, normalizeImageUrl } from '~/utils/imageHelper'
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()

const props = withDefaults(defineProps<{
  eyebrow: string
  title: string
  mobileTitle?: string
  titleAccent?: string
  description: string
  image: string
  imageMobile?: string
  imageAlt: string
  compact?: boolean
  breadcrumbHome?: string
  breadcrumbParent?: { label: string; to: string }
  breadcrumbLabel?: string
  ctaLabel?: string
  ctaTo?: string
  caption?: string
  titleId: string
}>(), {
  titleAccent: '',
  ctaLabel: '',
  ctaTo: '/lien-he',
  caption: '',
  compact: false,
  breadcrumbHome: '',
  breadcrumbParent: undefined,
  breadcrumbLabel: '',
})

const resolvedImage = computed(() => normalizeImageUrl(props.image) || '/images/pg.webp')
const resolvedImageMobile = computed(() => {
  const norm = props.imageMobile ? normalizeImageUrl(props.imageMobile) : ''
  return norm || '/images/pg-mobile.webp'
})
const resolvedBreadcrumbHome = computed(() => props.breadcrumbHome || t('nav.home', 'Trang chủ'))

function onImgError(e: Event) {
  const target = e.target as HTMLImageElement
  if (!target || target.dataset.fallbackApplied) return
  target.dataset.fallbackApplied = 'true'
  const picture = target.closest('picture')
  if (picture) {
    picture.querySelectorAll('source').forEach((source) => {
      source.srcset = '/images/pg-mobile.webp'
    })
  }
  target.src = '/images/pg.webp'
  target.srcset = '/images/pg-mobile.webp 800w, /images/pg.webp 1920w'
}
</script>

<style scoped>
.editorial-hero {
  position: relative;
  display: flex;
  min-height: clamp(480px, 65vw, 700px);
  align-items: flex-end;
  overflow: hidden;
  isolation: isolate;
  background: #090909;
}

.editorial-hero-image,
.editorial-hero-shade {
  position: absolute;
  z-index: -1;
  inset: 0;
  width: 100%;
  height: 100%;
}

.editorial-hero-picture { position: absolute; z-index: -1; inset: 0; display: block; overflow: hidden; }
.editorial-hero-picture .editorial-hero-image { position: absolute; }
.editorial-hero-image { object-fit: cover; object-position: center 52%; overflow: hidden; color: transparent; font-size: 0; }
.editorial-hero-shade {
  background: linear-gradient(90deg, rgba(7,7,7,.78), rgba(7,7,7,.24) 75%), linear-gradient(0deg, rgba(7,7,7,.88), transparent 78%);
}

.editorial-hero-copy {
  /* width: min(1320px, 100%);
  margin: 0 auto; */
  padding: 118px clamp(22px, 5.4vw, 78px) 78px;
}

.editorial-eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--color-gold);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 1.7px;
}

.editorial-eyebrow > span { width: 30px; height: 1px; background: currentColor; }

.editorial-hero h1 {
  max-width: 900px;
  margin-top: 22px;
  color: var(--color-text);
  font-size: clamp(46px, 6.6vw, 82px);
  font-weight: 500;
  letter-spacing: -2.4px;
  line-height: 1.07;
  text-wrap: balance;
}

.editorial-hero-title-desktop { display: contents; }
.editorial-hero-title-mobile { display: none; }

.editorial-hero h1 em {
  display: block;
  color: var(--color-champagne);
  font-family: var(--font-serif);
  font-weight: 400;
}

.editorial-hero-description {
  max-width: 560px;
  margin-top: 20px;
  color: rgba(245,242,235,.82);
  font-size: 13px;
  line-height: 1.9;
}

.editorial-hero-cta {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  min-height: 48px;
  margin-top: 26px;
  padding: 0 18px;
  background: var(--color-gold);
  color: #100f0d;
  font-size: var(--type-cta);
  font-weight: 600;
  letter-spacing: 0;
  text-decoration: none;
  transition: background-color 200ms ease, gap 200ms ease;
}

.editorial-hero-cta:hover { gap: 21px; background: var(--color-gold-hover); }
.editorial-hero-cta:focus-visible { outline: 2px solid var(--color-champagne); outline-offset: 4px; }
.editorial-hero-caption { position: absolute; right: clamp(22px,5.4vw,78px); bottom: 22px; color: rgba(245,242,235,.65); font-size: var(--type-caption); font-weight: 400; letter-spacing: 0; }

.editorial-hero--compact {
  min-height: clamp(440px, 42vw, 640px);
}

.editorial-hero--compact .editorial-hero-image { object-position: center 54%; }

.editorial-hero--compact .editorial-hero-shade {
  background:
    linear-gradient(90deg, rgba(7, 7, 7, .3), rgba(7, 7, 7, .12) 75%),
    linear-gradient(0deg, rgba(7, 7, 7, .7), transparent 58%);
}

.editorial-hero--compact .editorial-hero-copy {
  padding: 110px clamp(22px, 8.5vw, 120px) 62px;
}

.editorial-breadcrumb {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  color: rgba(255, 255, 255, .86);
  font-size: 12px;
  line-height: 1.5;
}

.editorial-breadcrumb a {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: inherit;
  text-decoration: none;
}

.editorial-breadcrumb a .fa-house {
  font-size: 10px;
}

.editorial-breadcrumb a:hover,
.editorial-breadcrumb a:focus-visible {
  color: var(--color-gold);
}

.editorial-breadcrumb [aria-current="page"] { color: #fff; }

.editorial-hero--compact h1 {
  max-width: 1000px;
  margin-top: 0;
  font-family: var(--font-serif);
  font-size: clamp(48px, 6vw, 82px);
  font-weight: 400;
  letter-spacing: -2.2px;
  line-height: 1.08;
}

@media (max-width: 600px) {
  .editorial-hero { min-height: min(650px, 78svh); }
  .editorial-hero-copy { padding-bottom: 70px; }
  .editorial-hero h1 { font-size: clamp(40px, 10vw, 58px); letter-spacing: -1.8px; }
  .editorial-hero-description { font-size: 12px; }
  .editorial-hero-title-desktop { display: none; }
  .editorial-hero-title-mobile { display: block; }

  .editorial-hero--compact {
    min-height: clamp(380px, 62svh, 520px);
  }

  .editorial-hero--compact .editorial-hero-copy {
    padding: 105px 24px 48px;
  }

  .editorial-hero--compact h1 {
    font-size: clamp(40px, 10vw, 58px);
    letter-spacing: -1.5px;
    text-wrap: balance;
  }

  .editorial-breadcrumb { margin-bottom: 10px; font-size: 11px; }

}

@media (prefers-reduced-motion: reduce) {
  .editorial-hero-cta { transition: none; }
}
</style>
