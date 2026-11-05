<template>
  <main class="services-page">
    <EditorialPageHero
      class="services-hero"
      title-id="services-title"
      compact
      :breadcrumb-home="t('nav.home')"
      :breadcrumb-label="t('services_page.banner_title')"
      :eyebrow="t('services_page.hero_eyebrow')"
      :title="t('services_page.banner_title')"
      :mobile-title="t('services_page.section_title')"
      :description="t('services_page.hero_desc')"
      :image="heroImage"
      :image-mobile="heroImageMobile"
      :image-alt="t('services_page.hero_image_alt')"
      :cta-label="t('services_page.hero_cta')"
      cta-to="/lien-he#consultation-form"
      :caption="t('services_page.hero_caption')"
    />

    <section class="services-overview" :aria-label="t('services_page.section_title')">
      <div class="service-list">
        <ServiceOverviewCard
          v-for="service in serviceHighlights"
          :key="service.title"
          :service="service"
        />
      </div>

      <div class="desktop-service-explorer">
        <ol class="desktop-service-accordion">
          <li
            v-for="(service, index) in desktopServiceItems"
            :key="`${service.id}-${index}`"
            class="desktop-service-accordion-item"
            :class="{ 'is-open': openDesktopServiceIndex === index }"
          >
            <div class="desktop-service-accordion-heading">
              <NuxtLink
                class="desktop-service-accordion-trigger"
                :to="serviceDetailPath(service)"
              >
                <span class="desktop-service-accordion-number">{{ String(index + 1).padStart(2, '0') }}</span>
                <span class="desktop-service-accordion-title">{{ service.title }}</span>
              </NuxtLink>
              <button
                class="desktop-service-accordion-toggle"
                type="button"
                :aria-label="`${t(openDesktopServiceIndex === index ? 'services_page.collapse_description' : 'services_page.expand_description')}: ${service.title}`"
                :aria-expanded="openDesktopServiceIndex === index"
                :aria-controls="`desktop-service-description-${index}`"
                @click="toggleDesktopService(index)"
              >
                <svg class="desktop-service-accordion-chevron" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="m5 7.5 5 5 5-5" />
                </svg>
              </button>
            </div>
            <div
              :id="`desktop-service-description-${index}`"
              class="desktop-service-accordion-panel"
              :aria-hidden="openDesktopServiceIndex !== index"
              :inert="openDesktopServiceIndex !== index"
            >
              <div class="desktop-service-accordion-panel-inner">
                <p>{{ service.description }}</p>
                <NuxtLink class="desktop-service-accordion-link" :to="serviceDetailPath(service)">
                  Xem chi tiết <span aria-hidden="true">›</span>
                </NuxtLink>
              </div>
            </div>
          </li>
        </ol>

        <div v-if="activeDesktopService" class="desktop-service-feature-image">
          <Transition name="desktop-service-image-fade">
            <img
              :key="activeDesktopService.image"
              :src="getDesktopServiceImage(activeDesktopService.image)"
              :alt="activeDesktopService.title"
              loading="lazy"
              width="1100"
              height="825"
              @error="onDesktopServiceImageError"
            >
          </Transition>
        </div>
      </div>

      <div class="mobile-service-explorer">
        <ol class="service-accordion">
          <li
            v-for="(service, index) in serviceHighlights"
            :key="service.slug || service.title"
            class="service-accordion-item"
            :class="{ 'is-open': openServiceIndex === index }"
          >
            <button
              class="service-accordion-trigger"
              type="button"
              :aria-expanded="openServiceIndex === index"
              :aria-controls="`service-description-${index}`"
              @click="toggleService(index)"
            >
              <span class="service-accordion-number">{{ service.category }}</span>
              <span class="service-accordion-title">{{ service.title }}</span>
              <svg class="service-accordion-chevron" viewBox="0 0 20 20" aria-hidden="true">
                <path d="m5 7.5 5 5 5-5" />
              </svg>
            </button>
            <div
              :id="`service-description-${index}`"
              class="service-accordion-panel"
              :aria-hidden="openServiceIndex !== index"
              :inert="openServiceIndex !== index"
            >
              <div class="service-accordion-panel-inner">
                <p>{{ service.description }}</p>
                <NuxtLink
                  class="service-accordion-link"
                  :to="`/dich-vu/${service.slug}`"
                >
                  {{ t('services_page.view_details') }} <span aria-hidden="true">›</span>
                </NuxtLink>
              </div>
            </div>
          </li>
        </ol>

        <div v-if="activeService" class="mobile-service-feature-image">
          <Transition name="service-image-fade" mode="out-in">
            <img
              :key="activeService?.image || defaultServiceImage"
              :src="getDesktopServiceImage(activeService?.image || '')"
              :alt="activeService?.alt || defaultServiceAlt"
              loading="lazy"
              width="1100"
              height="740"
              @error="onServiceImageError"
            >
          </Transition>
        </div>
      </div>
    </section>

    <FeaturedProjectsSlider :projects="featuredProjects" />

    <JournalSection
      heading-id="services-articles-title"
      section-class="services-articles-mobile section"
      :title="t('home.journal.title')"
      :link-text="t('common.view_all')"
      :articles="serviceArticles"
      :empty-text="t('blog_page.empty_desc')"
    />

    <JournalSection
      heading-id="services-journal-title"
      section-class="services-journal section"
      :title="t('home.journal.title')"
      :link-text="t('about_page.events_view_all')"
      :articles="featuredEvents || []"
      :empty-text="t('about_page.events_empty')"
    />

    <HomeEstimateCalculator class="services-estimate" :show-mobile-disclaimer="true" />
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import EditorialPageHero from '~/components/EditorialPageHero.vue'
import ServiceOverviewCard from '~/components/services/ServiceOverviewCard.vue'
import FeaturedProjectsSlider from '~/components/project/FeaturedProjectsSlider.vue'
import HomeEstimateCalculator from '~/components/home/HomeEstimateCalculator.vue'
import JournalSection from '~/components/blog/JournalSection.vue'
import type { ArticleSummary } from '~/components/blog/BlogFeaturedCard.vue'
import type { BlogPost } from '~/composables/useBlog'
import homeData from '~/data/homeContent.json'
import defaultServiceOverview from '~/data/services-overview.default.json'
import type { HomeImageItem } from '~/types/content'
import { useBlog } from '~/composables/useBlog'
import { useNavigation } from '~/composables/useNavigation'
import { useI18n } from '~/composables/useI18n'
import { useSiteSettings } from '~/composables/useSiteSettings'
import { useServiceHighlights } from '~/composables/useServiceHighlights'
import { normalizeImageUrl } from '~/utils/imageHelper'
import { buildOrganizationJsonLd } from '~/utils/seoHelper'

definePageMeta({ alias: ['/services'] })

const { t } = useI18n()
const { siteUrl } = useNavigation()

const fallbackFeaturedProjects = Array.isArray(homeData.projects)
  ? (homeData.projects as HomeImageItem[])
  : []
const fallbackArticles = Array.isArray(homeData.articles)
  ? homeData.articles as Array<{ id: string; slug: string; title: string; category: string; image: string; alt: string; detail: string; date: string }>
  : []

const toSafeText = (value: unknown, fallback = ''): string => {
  const text = typeof value === 'string' ? value.trim() : ''
  return text || fallback
}

const getArticleFallback = (index: number): typeof fallbackArticles[number] | undefined => {
  return fallbackArticles[index] ?? fallbackArticles[0]
}

const { getPosts } = useBlog()
const { data: featuredEvents } = await useAsyncData<ArticleSummary[]>(
  'services-featured-journal-tag-75',
  async () => {
    try {
      const response = await getPosts({ per_page: 4, tag_id: 75 })
      if (!response.success || !Array.isArray(response.data)) {
        console.error('[Services page] Featured journal API returned an invalid response.')
        return []
      }

      return response.data.slice(0, 4).map((post: BlogPost) => ({
        id: post.id,
        slug: post.slug || post.slugable?.key || String(post.id),
        title: post.name || post.title || '',
        excerpt: post.description || post.excerpt || '',
        image: typeof post.image === 'string'
          ? post.image
          : post.image?.url || post.image?.thumb || '',
        category: post.categories?.[0]?.name || '',
        date: post.published_at || post.created_at || '',
      }))
    } catch (error) {
      console.error('[Services page] Failed to load featured journal during SSR:', error)
      return []
    }
  },
)

const { footerCompanyName, hotline, address, footerTaxId, logo, servicesBanner, defaultPageBannerMobile } = useSiteSettings()
const serviceHighlights = useServiceHighlights()
const defaultServiceOverviewItems = defaultServiceOverview.items
const defaultServiceImage = normalizeImageUrl(defaultServiceOverviewItems[0]?.image)
const defaultServiceAlt = defaultServiceOverviewItems[0]?.alt
const defaultDesktopServiceImage = defaultServiceImage
const desktopServiceItems = serviceHighlights
const openDesktopServiceIndex = ref(0)
const activeDesktopService = computed(
  () => desktopServiceItems.value[openDesktopServiceIndex.value] ?? desktopServiceItems.value[0],
)
watch(desktopServiceItems, (items) => {
  if (!items[openDesktopServiceIndex.value]) openDesktopServiceIndex.value = 0
}, { immediate: true })

function toggleDesktopService(index: number): void {
  openDesktopServiceIndex.value = openDesktopServiceIndex.value === index ? -1 : index
}

function serviceDetailPath(service: { slug?: string; title: string }): string {
  const slug = service.slug || service.title.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return `/dich-vu/${encodeURIComponent(slug)}`
}

function getDesktopServiceImage(image: string): string {
  return normalizeImageUrl(image) || defaultDesktopServiceImage
}

function onDesktopServiceImageError(event: Event): void {
  const image = event.target as HTMLImageElement
  if (!image.dataset.fallbackApplied) {
    image.dataset.fallbackApplied = 'true'
    image.src = defaultDesktopServiceImage
  }
}

const openServiceIndex = ref<number | null>(0)
const activeService = computed(() => serviceHighlights.value[openServiceIndex.value ?? 0] || serviceHighlights.value[0])
const featuredProjects = computed<HomeImageItem[]>(() => fallbackFeaturedProjects)

function toggleService(index: number): void {
  openServiceIndex.value = openServiceIndex.value === index ? null : index
}

function onServiceImageError(event: Event): void {
  const image = event.target as HTMLImageElement
  if (!image.dataset.fallbackApplied) {
    image.dataset.fallbackApplied = 'true'
    image.src = defaultServiceImage
  }
}

const { data: featuredArticles } = await useAsyncData<ArticleSummary[]>(
  'services-featured-articles',
  async () => {
    try {
      const response = await getPosts({ per_page: 4 })
      if (!response.success || !Array.isArray(response.data)) {
        console.error('[Services page] Featured articles API returned an invalid response.')
        return []
      }

      return response.data.slice(0, 4).map((post: BlogPost) => ({
        id: post.id,
        slug: post.slug || post.slugable?.key || '',
        title: post.name || post.title || '',
        excerpt: post.description || post.excerpt || '',
        image: typeof post.image === 'string'
          ? post.image
          : post.image?.url || post.image?.thumb || '',
        category: post.categories?.[0]?.name || '',
        date: post.published_at || post.created_at || '',
      }))
    } catch (error) {
      console.error('[Services page] Failed to load featured articles during SSR:', error)
      return []
    }
  },
)
const serviceArticles = computed<ArticleSummary[]>(() => {
  const fallbackArticlesList: ArticleSummary[] = fallbackArticles.map(article => ({
    id: article.id,
    slug: article.slug,
    title: toSafeText(article?.title, ''),
    excerpt: toSafeText(article?.detail, ''),
    image: normalizeImageUrl(article?.image),
    category: toSafeText(article?.category, ''),
    date: article.date,
  }))
  const apiArticles = Array.isArray(featuredArticles.value) ? featuredArticles.value : []

  if (!apiArticles.length) return fallbackArticlesList.slice(0, 4)

  const articles = apiArticles.slice(0, 4).map((article, index) => {
    const sample = getArticleFallback(index)
    return {
      ...article,
      slug: toSafeText(article?.slug, sample?.slug ?? ''),
      title: toSafeText(article?.title, sample?.title ?? ''),
      excerpt: toSafeText(article?.excerpt, sample?.detail ?? ''),
      image: normalizeImageUrl(article?.image) || normalizeImageUrl(sample?.image),
      category: toSafeText(article?.category, sample?.category ?? ''),
    }
  })
  for (const article of fallbackArticlesList) {
    if (articles.length >= 4) break
    if (!articles.some(existing => existing.title === article.title)) {
      articles.push(article)
    }
  }

  return articles
})

const pageTitle = computed(() => t('services_page.meta_title'))
const pageDescription = computed(() => t('services_page.meta_desc'))
const canonicalUrl = `${siteUrl.replace(/\/$/, '')}/dich-vu`
const breadcrumbSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: t('nav.home'),
      item: `${siteUrl.replace(/\/$/, '')}/`,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: t('services_page.banner_title'),
      item: canonicalUrl,
    },
  ],
}))

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
  script: [{
    type: 'application/ld+json',
    textContent: () => JSON.stringify(breadcrumbSchema.value),
  }, {
    type: 'application/ld+json',
    textContent: JSON.stringify(
      buildOrganizationJsonLd({
        name: footerCompanyName.value,
        url: canonicalUrl,
        logo: logo.value,
        hotline: hotline.value,
        address: address.value,
        taxId: footerTaxId.value,
      }),
    ),
  }],
})

const cmsPage = await useCmsPageMeta('services', {
  title: pageTitle,
  description: pageDescription,
})

const heroImage = computed(() => {
  const custom = normalizeImageUrl(cmsPage.value?.image)
  return custom || servicesBanner.value || '/images/pg.webp'
})

const heroImageMobile = computed(() => {
  return cmsPage.value?.image ? undefined : (defaultPageBannerMobile.value || '/images/pg-mobile.webp')
})
</script>

<style scoped>
.services-page {
  --page-gutter: clamp(22px, 5.4vw, 78px);
  overflow: clip;
  background: var(--color-bg);
  color: var(--color-text);
}

.services-page :deep(.services-hero.editorial-hero--compact h1) {
  font-family: var(--font-heading);
  font-size: var(--type-service-hero);
  font-weight: 600;
  letter-spacing: -0.6px;
  line-height: 1.15;
}

.services-page :deep(.services-hero.editorial-hero--compact h1 em) {
  font-family: inherit;
  font-weight: inherit;
}

.services-overview {
  width: min(1515px, calc(100% - var(--page-gutter) * 2));
  margin: 0 auto;
  padding: clamp(80px, 9vw, 130px) 0 40px;
}

.services-journal :deep(.section-heading) {
  margin-bottom: 28px;
  justify-content: space-between;
}

.services-journal.section {
  width: 100%;
  max-width: none;
  padding: clamp(40px, 6vw, 80px) var(--page-gutter);
  background: #292929;
}

.services-journal :deep(.section-heading) {
  max-width: 1515px;
  margin: 0 auto 28px;
}

.desktop-service-explorer {
  display: none;
}

@media (min-width: 1024px) {
  .services-overview {
    width: 100%;
    margin: 0;
    padding: clamp(48px, 6vw, 88px) 0;
    background: #2b2b2b;
  }

  .service-list {
    display: none;
  }

  .desktop-service-explorer {
    display: grid;
    width: min(1515px, calc(100% - var(--page-gutter) * 2));
    grid-template-columns: 45% 55%;
    align-items: stretch;
    margin: 0 auto;
  }

  .desktop-service-accordion {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0;
    padding: 0 clamp(28px, 3.2vw, 52px) 0 0;
    list-style: none;
  }

  .desktop-service-accordion-item {
    border-bottom: 1px solid rgba(255, 255, 255, .15);
  }

  .desktop-service-accordion-item:first-child {
    border-top: 1px solid rgba(255, 255, 255, .15);
  }

  .desktop-service-accordion-heading {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 44px;
    align-items: stretch;
  }

  .desktop-service-accordion-trigger {
    display: grid;
    width: 100%;
    min-height: clamp(76px, 7.6vw, 104px);
    grid-template-columns: 38px minmax(0, 1fr);
    align-items: center;
    gap: 12px;
    padding: 12px 0;
    color: #fff;
    text-align: left;
    text-decoration: none;
  }

  .desktop-service-accordion-trigger:focus-visible,
  .desktop-service-accordion-toggle:focus-visible {
    outline: 2px solid var(--color-gold);
    outline-offset: -2px;
  }

  .desktop-service-accordion-toggle {
    display: grid;
    width: 44px;
    min-height: clamp(76px, 7.6vw, 104px);
    place-items: center;
    border: 0;
    background: transparent;
    cursor: pointer;
  }

  .desktop-service-accordion-number {
    color: #73777e;
    font-family: var(--font-serif);
    font-size: clamp(24px, 2.2vw, 32px);
    font-style: italic;
    line-height: 1;
    transition: color .3s ease;
  }

  .desktop-service-accordion-title {
    color: #fff;
    font-family: var(--font-heading);
    font-size: var(--type-h3);
    font-weight: 600;
    line-height: 1.2;
    transition: color .3s ease;
  }

  .desktop-service-accordion-chevron {
    width: 20px;
    height: 20px;
    fill: none;
    stroke: #fff;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.5;
    transform: rotate(90deg);
    transition: transform .3s ease;
  }

  .desktop-service-accordion-item.is-open .desktop-service-accordion-number,
  .desktop-service-accordion-item.is-open .desktop-service-accordion-title {
    color: var(--color-gold);
  }

  .desktop-service-accordion-item.is-open .desktop-service-accordion-chevron {
    transform: rotate(0);
  }

  .desktop-service-accordion-panel {
    display: grid;
    grid-template-rows: 0fr;
    opacity: 0;
    transition: grid-template-rows .3s ease, opacity .3s ease;
  }

  .desktop-service-accordion-item.is-open .desktop-service-accordion-panel {
    grid-template-rows: 1fr;
    opacity: 1;
  }

  .desktop-service-accordion-panel-inner {
    min-height: 0;
    overflow: hidden;
    padding: 0 0 0 50px;
  }

  .desktop-service-accordion-item.is-open .desktop-service-accordion-panel-inner {
    padding-bottom: clamp(20px, 2vw, 30px);
  }

  .desktop-service-accordion-panel p {
    margin: 0;
    color: rgba(255, 255, 255, .82);
    font-size: 14px;
    line-height: 1.6;
    text-align: justify;
  }

  .desktop-service-accordion-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 22px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, .65);
    color: #fff;
    font-family: var(--font-serif);
    font-size: 16px;
    line-height: 1;
    text-decoration: none;
  }

  .desktop-service-accordion-link span {
    font-family: sans-serif;
    font-size: 20px;
    line-height: .8;
  }

  .desktop-service-feature-image {
    position: relative;
    min-height: clamp(450px, 42vw, 680px);
    overflow: hidden;
    aspect-ratio: 4 / 3;
    background: var(--color-surface);
  }

  .desktop-service-feature-image img {
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .desktop-service-image-fade-enter-active,
  .desktop-service-image-fade-leave-active {
    transition: opacity .35s ease;
  }

  .desktop-service-image-fade-enter-from,
  .desktop-service-image-fade-leave-to {
    opacity: 0;
  }
}

@media (min-width: 601px) {
  .mobile-service-explorer,
  .services-articles-mobile {
    display: none;
  }
}

@media (max-width: 760px) {
  .services-overview {
    padding-top: 42px;
  }

}

@media (max-width: 600px) {
  .services-page {
    --page-gutter: 16px;
    background: #292929;
  }

  .services-journal {
    display: none;
  }

  :deep(.services-hero.editorial-hero--compact) {
    min-height: clamp(390px, 55svh, 470px);
  }

  :deep(.services-hero.editorial-hero--compact .editorial-hero-copy) {
    padding: 100px 16px 38px;
  }

  :deep(.services-hero.editorial-hero--compact h1) {
    max-width: 360px;
    font-size: var(--type-service-hero);
    letter-spacing: -0.6px;
    line-height: 1.12;
    text-align: left;
  }

  :deep(.services-hero .editorial-breadcrumb) {
    gap: 8px;
    font-size: 11px;
  }

  .services-overview {
    width: 100%;
    margin: 0;
    padding: 22px 0 0;
  }

  .service-list {
    display: none;
  }

  .mobile-service-explorer {
    display: block;
  }

  .service-accordion {
    margin: 0;
    padding: 0 16px;
    border-top: 1px solid var(--color-border);
    list-style: none;
  }

  .service-accordion-item {
    border-bottom: 1px solid rgba(245, 242, 235, .2);
  }

  .service-accordion-trigger {
    display: grid;
    grid-template-columns: 42px minmax(0, 1fr) 24px;
    min-height: 66px;
    width: 100%;
    align-items: center;
    gap: 10px;
    padding: 10px 0;
    border: 0;
    background: transparent;
    color: var(--color-text);
    text-align: left;
    cursor: pointer;
  }

  .service-accordion-trigger:focus-visible {
    outline: 2px solid var(--color-gold);
    outline-offset: -2px;
  }

  .service-accordion-number {
    color: var(--color-gold);
    font-family: var(--font-serif);
    font-size: 23px;
    font-style: italic;
    line-height: 1;
    transition: color .25s ease;
  }

  .service-accordion-title {
    font-size: 15px;
    font-weight: 500;
    line-height: 1.35;
    transition: color .25s ease;
  }

  .service-accordion-chevron {
    width: 20px;
    height: 20px;
    fill: none;
    stroke: var(--color-text);
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.4;
    transition: transform .25s ease, stroke .25s ease;
  }

  .service-accordion-item.is-open .service-accordion-number,
  .service-accordion-item.is-open .service-accordion-title {
    color: var(--color-gold);
  }

  .service-accordion-item.is-open .service-accordion-chevron {
    transform: rotate(180deg);
    stroke: var(--color-gold);
  }

  .service-accordion-panel {
    display: grid;
    grid-template-rows: 0fr;
    opacity: 0;
    transition: grid-template-rows .35s ease, opacity .25s ease;
  }

  .service-accordion-item.is-open .service-accordion-panel {
    grid-template-rows: 1fr;
    opacity: 1;
  }

  .service-accordion-panel-inner {
    min-height: 0;
    overflow: hidden;
    padding: 0 0 0 52px;
  }

  .service-accordion-item.is-open .service-accordion-panel-inner {
    padding-bottom: 17px;
  }

  .service-accordion-panel p {
    display: -webkit-box;
    max-height: 120px;
    overflow: hidden;
    color: rgba(245, 242, 235, .8);
    font-size: 13px;
    line-height: 1.7;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 5;
  }

  .service-accordion-link {
    display: inline-flex;
    min-height: 44px;
    align-items: center;
    gap: 7px;
    margin-top: 6px;
    color: var(--color-gold);
    font-family: var(--font-serif);
    font-size: 14px;
    text-decoration: underline;
    text-underline-offset: 4px;
  }

  .mobile-service-feature-image {
    position: relative;
    width: 100%;
    margin-top: 16px;
    overflow: hidden;
    aspect-ratio: 1.45;
    background: var(--color-surface);
  }

  .mobile-service-feature-image img {
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .service-image-fade-enter-active,
  .service-image-fade-leave-active {
    transition: opacity .2s ease;
  }

  .service-image-fade-enter-from,
  .service-image-fade-leave-to {
    opacity: 0;
  }

  :deep(.projects-section) {
    padding: 36px 0 30px;
  }

  :deep(.projects-section > h2) {
    margin: 0 16px 16px;
    font-size: var(--type-h2);
    letter-spacing: -.5px;
  }

  :deep(.projects-section .project-slider-track) {
    --featured-card-size: 100vw;
    gap: 0;
    padding-inline: 0;
  }

  :deep(.projects-section .project-card) {
    flex-basis: 100vw;
  }

  :deep(.projects-section .project-image) {
    aspect-ratio: 1.15;
  }

  :deep(.projects-section .project-copy) {
    right: 48px;
    bottom: 18px;
    left: 48px;
  }

  :deep(.projects-section .project-copy .card-kicker) {
    color: var(--color-gold);
    font-size: 14px;
  }

  :deep(.projects-section .project-copy h3) {
    font-size: var(--type-h3);
    font-weight: 600;
    line-height: 1.25;
  }

  :deep(.projects-section .project-slider-button) {
    width: 44px;
    height: 44px;
    border-color: var(--color-gold);
    background: rgba(20, 20, 20, .8);
    color: var(--color-gold);
  }

  :deep(.projects-section .project-slider-button span),
  :deep(.projects-section .project-slider-button i) {
    font-size: 15px;
  }

  :deep(.projects-section .project-slider-button-prev) {
    left: 10px;
  }

  :deep(.projects-section .project-slider-button-next) {
    right: 10px;
  }

  :deep(.projects-section .projects-cta) {
    min-height: 44px;
    margin-top: 14px;
    padding: 9px 16px;
    border-color: var(--color-gold);
    color: var(--color-gold) !important;
    font-size: 14px;
  }

  .services-articles-mobile {
    display: block;
    width: 100%;
    max-width: none;
    padding: 32px 16px 36px;
    background: #292929;
  }

  .services-articles-mobile :deep(.section-heading) {
    flex-direction: row;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
  }

  .services-articles-mobile :deep(.section-heading > div:first-child) {
    min-width: 0;
  }

  .services-articles-mobile :deep(.section-heading h2) {
    font-family: var(--font-heading);
    font-size: var(--type-h2);
    font-weight: 600;
    letter-spacing: -.5px;
    line-height: 1.2;
  }

  .services-articles-mobile :deep(.section-heading-side) {
    flex: 0 0 auto;
    align-items: flex-end;
  }

  .services-articles-mobile :deep(.section-heading .text-link) {
    display: inline-flex;
    min-height: 44px;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
    border: 1px solid var(--color-gold);
    color: var(--color-gold);
    font-size: var(--type-cta);
    font-weight: 600;
    letter-spacing: 0;
    text-decoration: none;
    white-space: nowrap;
  }

  :deep(.services-estimate.home-estimate-section) {
    padding: 36px 16px 48px;
  }

  :deep(.services-estimate > .section-heading) {
    justify-content: center;
    margin-bottom: 18px;
    text-align: center;
  }

  :deep(.services-estimate > .section-heading h2) {
    font-size: var(--type-h2);
    line-height: 1.2;
    text-align: center;
  }

  :deep(.services-estimate .home-estimate-panel) {
    gap: 20px;
    padding: 18px 14px;
    border-color: rgba(214, 179, 106, .28);
    background-color: var(--color-bg-soft);
  }

  :deep(.services-estimate .home-estimate-controls) {
    gap: 14px;
  }

  :deep(.services-estimate .home-estimate-field--basement-area) {
    display: none;
  }

  :deep(.services-estimate .home-estimate-field label),
  :deep(.services-estimate .home-estimate-controls .calculator-fieldset legend) {
    font-size: 13px;
    font-weight: 500;
  }

  :deep(.services-estimate .home-estimate-field input),
  :deep(.services-estimate .home-estimate-field select) {
    min-height: 48px;
    border-color: rgba(245, 242, 235, .24);
    background-color: #161616;
    font-size: 14px;
  }

  :deep(.services-estimate .home-package-option) {
    min-height: 48px;
    padding: 6px 4px;
    font-size: 12px;
  }

  :deep(.services-estimate .home-estimate-summary) {
    padding: 18px 14px;
    border-color: rgba(245, 242, 235, .18);
    background: #202020;
  }

  :deep(.services-estimate .home-estimate-summary h3) {
    font-size: var(--type-h3);
  }

  :deep(.services-estimate .home-estimate-total) {
    gap: 5px;
    margin-top: 14px;
  }

  :deep(.services-estimate .home-estimate-total strong) {
    color: var(--color-gold);
    font-size: clamp(28px, 8vw, 38px);
  }

  :deep(.services-estimate .home-estimate-total span) {
    color: var(--color-gold);
  }

  :deep(.services-estimate .home-estimate-summary dl) {
    gap: 10px;
    margin-top: 14px;
  }

  :deep(.services-estimate .home-estimate-summary dl > div) {
    align-items: flex-start;
    font-size: 12px;
    line-height: 1.45;
  }

  :deep(.services-estimate .home-estimate-summary dd) {
    max-width: 55%;
  }

  :deep(.services-estimate .home-estimate-cta) {
    min-height: 48px;
    margin-top: 14px;
    padding: 8px 12px;
    background: var(--color-gold);
    color: #100f0d !important;
    font-size: 13px;
  }

  :deep(.services-estimate .services-estimate-disclaimer) {
    display: block;
    margin-top: 1px;
    color: var(--color-muted);
    font-size: 11px;
    line-height: 1.6;
  }
}
</style>
