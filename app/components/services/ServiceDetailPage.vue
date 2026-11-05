<template>
  <main class="service-detail-page">
    <EditorialPageHero
      class="service-detail-hero"
      title-id="service-detail-title"
      compact
      :breadcrumb-home="t('nav.home')"
      :breadcrumb-parent="{ label: t('services_page.banner_title'), to: parentTo }"
      :breadcrumb-label="currentService.title"
      :eyebrow="t('services_page.hero_eyebrow')"
      :title="currentService.title"
      :description="currentService.description"
      :image="heroImage"
      :image-mobile="heroImageMobile"
      :image-alt="currentService.alt || currentService.title"
      :cta-label="t('services_page.contact_service_cta')"
      :cta-to="heroContactUrl"
      :caption="t('services_page.hero_caption')"
    />

    <HomeServiceCards
      :eyebrow="t('home.services.eyebrow')"
      :title="t('home.services.title')"
      :mobile-title="currentService.title"
      :description="currentService.description"
      :explore-label="t('home.services.explore')"
      :services="homeServices"
      default-service-path="/dich-vu"
    />

    <section class="service-section process-section">
      <div class="section-shell process-layout">
        <header class="section-copy">
          <p class="section-kicker">{{ detailContent.process.eyebrow }}</p>
          <h2>{{ detailContent.process.titleFirstLine }}<br>{{ detailContent.process.titleSecondLine }}</h2>
          <p class="section-lead">{{ detailContent.process.description }}</p>
        </header>
        <ProcessTimeline :steps="serviceSteps" />
      </div>
    </section>

    <section class="service-section gallery-section">
      <div class="section-shell">
        <header class="section-heading">
          <div>
            <p class="section-kicker">{{ detailContent.gallery.eyebrow }}</p>
            <h2>{{ detailContent.gallery.title }}</h2>
          </div>
          <p class="section-lead">{{ detailContent.gallery.description }}</p>
        </header>
        <div class="featured-gallery">
          <NuxtLink class="gallery-featured" :to="projectLink(featuredProjects[0])">
            <img :src="featuredProjects[0]?.image || '/images/pg.webp'" :alt="featuredProjects[0]?.alt || 'Dự án nổi bật của WECONS'" loading="lazy" width="1200" height="900" @error="onImageError">
            <span class="gallery-overlay">
              <span class="gallery-label">{{ featuredProjects[0]?.category || detailContent.gallery.fallbackCategory }}</span>
              <strong>{{ featuredProjects[0]?.title || detailContent.gallery.fallbackTitle }}</strong>
            </span>
          </NuxtLink>
          <div class="gallery-small-grid">
            <NuxtLink v-for="project in featuredProjects.slice(1, 5)" :key="project.idProject || project.title" class="gallery-tile" :to="projectLink(project)">
              <img :src="project.image" :alt="project.alt" loading="lazy" width="720" height="520" @error="onImageError">
              <span>{{ project.title }}</span>
            </NuxtLink>
          </div>
        </div>
        <div class="featured-gallery-mobile">
          <NuxtLink
            v-if="featuredProjects[0]"
            class="gallery-mobile-feature"
            :to="projectLink(featuredProjects[0])"
          >
            <img :src="featuredProjects[0].image" :alt="featuredProjects[0].alt" loading="lazy" width="1200" height="900">
          </NuxtLink>
          <div class="gallery-mobile-grid">
            <NuxtLink
              v-for="(project, index) in featuredProjects.slice(1, 5)"
              :key="project.idProject || project.title"
              class="gallery-mobile-tile"
              :class="{ 'is-all-projects': index === 3 }"
              :to="index === 3 ? '/du-an' : projectLink(project)"
            >
              <img :src="project.image" :alt="project.alt" loading="lazy" width="720" height="520">
              <span v-if="index === 3" class="gallery-mobile-all-link">
                {{ t('common.view_all') }} <span aria-hidden="true">↗</span>
              </span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="service-section reasons-section">
      <div class="section-shell">
        <header class="center-heading">
          <p class="section-kicker">{{ detailContent.reasons.eyebrow }}</p>
          <h2>{{ detailContent.reasons.title }}</h2>
        </header>
        <div class="reasons-list">
          <article v-for="(reason, index) in reasons" :key="reason.title" class="reason-card">
            <span class="reason-icon" aria-hidden="true"><i :class="reason.icon"></i></span>
            <div>
              <!-- <span class="reason-number">{{ formatIndex(index) }}</span> -->
              <h3>{{ reason.title }}</h3>
              <p>{{ reason.description }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="service-section mobile-reasons-section" aria-labelledby="mobile-reasons-title">
      <header class="center-heading">
        <h2 id="mobile-reasons-title">{{ detailContent.reasons.title }}</h2>
      </header>
      <AboutValues :values="mobileReasons" />
    </section>

    <HomeCompletedProjects :projects="featuredProjects" />

    <JournalSection
      heading-id="service-knowledge-title"
      section-class="service-section knowledge-section"
      content-class="section-shell"
      :eyebrow="detailContent.knowledge.eyebrow"
      :title="detailContent.knowledge.title"
      :link-text="t('common.view_all')"
      :articles="visiblePosts"
    />

    <section class="estimator-section">
      <div class="section-shell">
        <header class="center-heading">
          <p class="section-kicker">BẮT ĐẦU TỪ MỘT CON SỐ THAM KHẢO</p>
          <h2>{{ detailContent.estimateTitle }}</h2>
        </header>
        <HomeEstimateCalculator />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import EditorialPageHero from '~/components/EditorialPageHero.vue'
import HomeCompletedProjects from '~/components/home/HomeCompletedProjects.vue'
import HomeServiceCards from '~/components/home/HomeServiceCards.vue'
import HomeEstimateCalculator from '~/components/home/HomeEstimateCalculator.vue'
import JournalSection from '~/components/blog/JournalSection.vue'
import AboutValues from '~/components/about/AboutValues.vue'
import ProcessTimeline from '~/components/process/ProcessTimeline.vue'
import type { ArticleSummary } from '~/components/blog/BlogFeaturedCard.vue'
import homeData from '~/data/homeContent.json'
import pageData from '~/data/pageContent.json'
import type { CompanyValue, HomeImageItem, ProcessDetail, ServiceHighlight } from '~/types/content'
import { useBlog } from '~/composables/useBlog'
import { useI18n } from '~/composables/useI18n'
import { useNavigation } from '~/composables/useNavigation'
import { useSiteSettings } from '~/composables/useSiteSettings'
import { normalizeImageUrl } from '~/utils/imageHelper'
import { buildOrganizationJsonLd } from '~/utils/seoHelper'

const props = withDefaults(defineProps<{
  slug: string
  parentTo?: string
}>(), {
  parentTo: '/dich-vu',
})

const { t } = useI18n()
const { siteUrl } = useNavigation()
const { getPosts } = useBlog()
const {
  serviceHighlights: siteServices,
  footerCompanyName,
  hotline,
  address,
  footerTaxId,
  logo,
  servicesBanner,
  defaultPageBannerMobile,
} = useSiteSettings()
const fallbackProjects = homeData.projects as Array<HomeImageItem & { idProject: string }>
const homeServices = homeData.services as HomeImageItem[]
const detailContent = pageData.serviceDetailPage

function slugify(text: string): string {
  return text.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const allServices = computed<ServiceHighlight[]>(() =>
  (siteServices.value?.length ? siteServices.value : pageData.serviceHighlights) as ServiceHighlight[],
)

const currentService = computed<ServiceHighlight>(() => {
  const service = allServices.value.find(item => item.slug === props.slug || slugify(item.title) === props.slug)
  if (service) return service

  return {
    title: props.slug.replace(/-/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase()),
    description: t('services_page.hero_desc'),
    image: '/images/pg.webp',
    alt: props.slug,
    category: '01',
    slug: props.slug,
  }
})

const heroImage = computed(() => normalizeImageUrl(currentService.value.image) || servicesBanner.value || '/images/pg.webp')
const heroImageMobile = computed(() => defaultPageBannerMobile.value || '/images/pg-mobile.webp')
const heroContactUrl = computed(() => `/lien-he?service=${encodeURIComponent(currentService.value.slug || 'service')}#consultation-form`)

const serviceSteps = detailContent.process.steps as ProcessDetail[]
const reasons = detailContent.reasons.items
const mobileReasons = detailContent.reasons.items as CompanyValue[]

const featuredProjects = computed(() => fallbackProjects.slice(0, 8))

function projectLink(project: HomeImageItem | undefined): string {
  return project?.slug ? `/du-an/${project.slug}` : '/du-an'
}

const fallbackArticles: ArticleSummary[] = detailContent.articles.map(article => ({
  id: article.id,
  title: article.title,
  slug: '',
  excerpt: '',
  image: normalizeImageUrl(article.image),
  category: article.category || '',
  date: article.date || '',
}))

const { data: articleData } = await useAsyncData<ArticleSummary[]>(
  `service-articles-${props.slug}`,
  async () => {
    try {
      const response = await getPosts({ per_page: 4 })
      if (response.success && Array.isArray(response.data) && response.data.length) {
        return response.data.map((post, index) => {
          const rawImage = typeof post.image === 'string'
            ? post.image
            : post.image?.url || post.image?.thumb || ''
          const rawDate = post.published_at || post.created_at
          return {
            id: post.id,
            title: post.name || post.title || '',
            slug: post.slug || post.slugable?.key || '',
            excerpt: post.description || post.excerpt || '',
            image: normalizeImageUrl(rawImage),
            category: post.categories?.[0]?.name || 'KIẾN THỨC THIẾT KẾ',
            date: rawDate || fallbackArticles[index]?.date || '',
          }
        })
      }
      return fallbackArticles
    } catch (error) {
      console.error('[Service detail] Could not load latest articles.', error)
      return fallbackArticles
    }
  },
  { default: () => fallbackArticles },
)

const visiblePosts = computed<ArticleSummary[]>(() => articleData.value?.length ? articleData.value : fallbackArticles)

function onImageError(event: Event): void {
  const image = event.target as HTMLImageElement
  if (image.dataset.fallbackApplied) return
  image.dataset.fallbackApplied = 'true'
  image.src = '/images/pg.webp'
}

const canonicalUrl = `${siteUrl.replace(/\/$/, '')}${props.parentTo}/${props.slug}`
const pageTitle = computed(() => `${currentService.value.title} | WECONS`)
const pageDescription = computed(() => currentService.value.description || t('services_page.meta_desc'))
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
      item: `${siteUrl.replace(/\/$/, '')}${props.parentTo}`,
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: currentService.value.title,
      item: canonicalUrl,
    },
  ],
}))

useHead({
  title: pageTitle,
  meta: [
    { name: 'description', content: pageDescription },
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: pageDescription },
    { property: 'og:image', content: heroImage },
    { property: 'og:type', content: 'article' },
  ],
  link: [{ rel: 'canonical', href: canonicalUrl }],
  script: [
    {
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
    },
    {
      type: 'application/ld+json',
      textContent: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: currentService.value.title,
        description: currentService.value.description,
        provider: {
          '@type': 'Organization',
          name: footerCompanyName.value || 'WE Construction',
          url: siteUrl,
        },
        areaServed: 'VN',
      }),
    },
    {
      type: 'application/ld+json',
      textContent: () => JSON.stringify(breadcrumbSchema.value),
    },
  ],
})

await useCmsPageMeta('serviceDetail', {
  title: pageTitle,
  description: pageDescription,
})
</script>

<style scoped>
.service-detail-page {
  --page-gutter: clamp(22px, 5.4vw, 78px);
  --home-gutter: var(--page-gutter);
  overflow: clip;
  background: var(--color-bg);
  color: var(--color-text);
}

.service-detail-page :deep(.section-heading) {
  justify-content: center;
}

.service-detail-page :deep(.service-detail-hero.editorial-hero--compact h1) {
  font-family: var(--font-heading);
  font-size: var(--type-service-hero);
  font-weight: 600;
  letter-spacing: -0.6px;
  line-height: 1.15;
}

.service-detail-page :deep(.service-detail-hero.editorial-hero--compact h1 em) {
  font-family: inherit;
  font-weight: inherit;
}

.service-detail-page > .service-section >.section-shell>.section-heading {
  justify-content: space-between;
}

.service-detail-page :deep(.completed-project-section) {
  padding: 38px var(--home-gutter) 34px;
}

.service-section {
  padding: clamp(58px, 7vw, 96px) 0;
}

.section-shell {
  width: min(1515px, calc(100% - var(--page-gutter) * 2));
  margin: 0 auto;
}

.section-kicker {
  margin: 0 0 14px;
  color: var(--color-gold);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1.8px;
}

.service-section h2,
.estimator-section h2 {
  margin: 0;
  color: var(--color-text);
  font-family: var(--font-heading);
  font-size: var(--type-h2);
  font-weight: 600;
  line-height: 1.18;
}

.section-lead {
  max-width: 650px;
  margin: 16px 0 0;
  color: var(--color-muted);
  font-size: var(--type-service-body);
  font-weight: 400;
  line-height: 1.8;
}

.service-detail-page :deep(.section-lead),
.service-detail-page :deep(.reason-card p) {
  font-size: var(--type-service-body);
  font-weight: 400;
}

.process-section {
  background: #111;
}

.process-layout {
  display: flex;
  align-items: flex-start;
  gap: clamp(44px, 8vw, 130px);
}

.section-copy {
  width: 34%;
  flex: 0 0 34%;
}

.process-layout :deep(.process-timeline) {
  min-width: 0;
  flex: 1;
  border-top: 0;
}

.process-layout :deep(.process-timeline li) {
  padding: 18px 0;
  border-bottom-color: rgba(245, 242, 235, .12);
}

.process-layout :deep(.process-timeline h3) {
  font-family: var(--font-heading);
  font-size: var(--type-h3);
  font-weight: 600;
}

.process-layout :deep(.process-timeline p) {
  max-width: 700px;
  font-size: var(--type-service-body);
  font-weight: 400;
}

.gallery-section {
  background: #292929;
}

.section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 30px;
  margin-bottom: 30px;
}

.section-heading .section-lead {
  max-width: 430px;
  margin: 0;
}

.featured-gallery {
  display: flex;
  gap: 8px;
  min-height: 400px;
}

.gallery-featured,
.gallery-tile {
  position: relative;
  display: block;
  min-width: 0;
  overflow: hidden;
  color: #fff;
  text-decoration: none;
}

.gallery-featured {
  flex: 1 1 50%;
}

.gallery-featured img,
.gallery-tile img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .5s ease;
}

.gallery-featured:hover img,
.gallery-tile:hover img {
  transform: scale(1.04);
}

.gallery-overlay {
  position: absolute;
  inset: auto 0 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 48px 24px 24px;
  background: linear-gradient(transparent, rgba(0, 0, 0, .8));
}

.gallery-label,
.player-caption > div > span {
  color: var(--color-gold);
  font-size: 10px;
  letter-spacing: 1px;
}

.gallery-overlay strong {
  font-family: var(--font-serif);
  font-size: 24px;
  font-weight: 400;
}

.gallery-small-grid {
  display: flex;
  flex: 1 1 50%;
  flex-wrap: wrap;
  gap: 8px;
}

.gallery-tile {
  flex: 1 1 calc(50% - 8px);
  height: calc(50% - 4px);
}

.gallery-tile > span {
  position: absolute;
  right: 12px;
  bottom: 12px;
  left: 12px;
  font-family: var(--font-serif);
  font-size: 16px;
  text-shadow: 0 1px 5px #000;
}

.reasons-section {
  background: #111;
}

.center-heading {
  margin: 0 auto 34px;
  text-align: center;
}

.center-heading .section-kicker {
  margin-bottom: 10px;
}

.reasons-list {
  display: flex;
  flex-wrap: wrap;
  border-top: 1px solid rgba(197, 160, 89, .32);
  border-left: 1px solid rgba(197, 160, 89, .32);
}

.reason-card {
  display: flex;
  min-height: 170px;
  flex: 1 1 33.333%;
  gap: 16px;
  padding: 24px;
  border-right: 1px solid rgba(197, 160, 89, .32);
  border-bottom: 1px solid rgba(197, 160, 89, .32);
  background: #151515;
  flex-direction: column;
}

.reason-icon {
  display: flex;
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(197, 160, 89, .55);
  border-radius: 50%;
  color: var(--color-gold);
  font-size: 16px;
}

.reason-number {
  color: var(--color-gold);
  font-family: var(--font-serif);
  font-size: 12px;
}

.reason-card h3 {
  margin: 7px 0;
  color: var(--color-text);
  font-family: var(--font-heading);
  font-size: var(--type-h3);
  font-weight: 600;
}

.reason-card p {
  margin: 0;
  color: var(--color-muted);
  font-size: var(--type-service-body);
  font-weight: 400;
  line-height: 1.7;
}

.knowledge-section {
  background: #111;
}

.estimator-section {
  padding: 40px 0 80px;
  border-bottom: 1px solid rgba(197, 160, 89, .4);
  background: #292929;
}

.estimator-section :deep(.home-estimate-section) {
  width: 100%;
  padding: 0;
}

.estimator-section :deep(.home-estimate-section > .section-heading) {
  display: none;
}

.estimator-section :deep(.home-estimate-panel) {
  margin: 0;
}

.featured-gallery-mobile,
.mobile-reasons-section,
:deep(.services-mobile-title),
.service-detail-page :deep(.services-section-intro) {
  display: none;
}

@media (max-width: 900px) {
  .process-layout {
    flex-direction: column;
    gap: 30px;
  }

  .section-copy {
    width: auto;
    flex-basis: auto;
  }

  .featured-gallery {
    min-height: 340px;
  }

  .reason-card {
    flex-basis: 50%;
  }

}

@media (max-width: 600px) {
  .section-shell {
    width: calc(100% - 40px);
  }

  .service-section {
    padding: 50px 0;
  }

  .service-section h2,
  .estimator-section h2 {
    font-size: var(--type-h2);
  }

  .process-layout :deep(.process-timeline li) {
    grid-template-columns: 42px minmax(0, 1fr);
    gap: 12px;
  }

  .process-layout :deep(.process-timeline h3) {
    font-size: var(--type-h3);
  }

  .section-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 15px;
  }

  .section-heading .section-lead {
    font-size: var(--type-service-body);
  }

  .featured-gallery {
    min-height: 0;
    flex-direction: column;
  }

  .gallery-featured {
    min-height: 260px;
  }

  .gallery-small-grid {
    min-height: 300px;
    flex-basis: auto;
  }

  .gallery-tile {
    height: calc(50% - 4px);
  }

  .gallery-overlay strong {
    font-size: 20px;
  }

  .center-heading {
    margin-bottom: 24px;
  }

  .reason-card {
    min-height: 155px;
    flex-basis: 100%;
    padding: 18px;
  }

  .estimator-section {
    padding: 42px 0 58px;
  }

  .estimator-section :deep(.home-estimate-panel) {
    padding: 20px 14px;
  }

  .estimator-section :deep(.home-estimate-controls) {
    grid-template-columns: 1fr;
  }

  .service-detail-page {
    --page-gutter: 16px;
    --home-gutter: 16px;
    background: #292929;
  }

  .service-detail-page :deep(.service-detail-hero.editorial-hero--compact h1) {
    font-size: var(--type-service-hero);
  }

  :deep(.editorial-hero--compact) {
    min-height: 460px;
  }

  :deep(.editorial-hero--compact .editorial-hero-copy) {
    padding: 108px 16px 42px;
  }

  :deep(.editorial-hero--compact h1) {
    max-width: 100%;
    font-size: 40px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 1.12;
  }

  :deep(.editorial-hero--compact .editorial-breadcrumb) {
    gap: 7px;
    font-size: 11px;
  }

  .section-shell {
    width: calc(100% - 32px);
  }

  .service-section {
    padding: 44px 0;
  }

  .service-section h2,
  .estimator-section h2 {
    font-size: var(--type-h2);
    letter-spacing: 0;
  }

  :deep(.services-section) {
    padding: 38px 0 0;
    background: #292929;
  }

  :deep(.services-section > .section-heading) {
    display: none;
  }

  :deep(.services-mobile-title) {
    display: block;
    margin: 0 16px 10px;
    color: var(--color-text);
    font-family: var(--font-heading);
    font-size: var(--type-h2);
    font-weight: 600;
    line-height: 1.2;
    text-align: center;
  }

  .service-detail-page :deep(.services-section-intro) {
    display: block;
    margin: 0 16px 22px;
    color: rgba(245, 242, 235, .76);
    font-size: var(--type-service-body);
    font-weight: 400;
    line-height: 1.75;
    text-align: center;
  }

  :deep(.services-section .service-grid) {
    grid-template-columns: 1fr;
    gap: 2px;
  }

  :deep(.services-section .service-image) {
    aspect-ratio: 3 / 4;
  }

  :deep(.services-section .service-image:focus-visible) {
    outline: 2px solid var(--color-gold);
    outline-offset: -3px;
  }

  :deep(.services-section .service-number) {
    top: auto;
    bottom: 145px;
    left: 16px;
    padding: 0;
    background: transparent;
    color: var(--color-gold);
    font-family: var(--font-serif);
    font-size: 42px;
    font-style: italic;
    letter-spacing: 0;
  }

  :deep(.services-section .service-copy) {
    padding: 16px 16px 20px;
    transform: none;
    transition: none;
  }

  :deep(.services-section .card-kicker),
  :deep(.services-section .service-copy .text-link) {
    display: none;
  }

  :deep(.services-section .service-copy h3) {
    margin: 0 0 7px;
    color: #fff;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.25;
  }

  :deep(.services-section .service-detail) {
    display: -webkit-box;
    overflow: hidden;
    margin: 0;
    color: rgba(255, 255, 255, .88);
    font-size: 12px;
    line-height: 1.65;
    line-clamp: 3;
    opacity: 1;
    transform: none;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }

  .process-section {
    background: #292929;
  }

  .process-layout {
    flex-direction: column;
    gap: 22px;
  }

  .process-layout .section-kicker {
    display: none;
  }

  .process-layout :deep(.process-timeline) {
    border-top: 0;
  }

  .process-layout :deep(.process-timeline li) {
    position: relative;
    grid-template-columns: 42px minmax(0, 1fr);
    gap: 12px;
    padding: 16px 0;
    border-bottom-color: rgba(214, 179, 106, .18);
  }

  .process-layout :deep(.process-timeline li:not(:last-child)::after) {
    position: absolute;
    top: 54px;
    bottom: -16px;
    left: 17px;
    width: 1px;
    background: rgba(214, 179, 106, .35);
    content: '';
  }

  .process-layout :deep(.process-number) {
    position: relative;
    z-index: 1;
    display: grid;
    width: 36px;
    height: 36px;
    place-items: center;
    border: 1px solid rgba(214, 179, 106, .65);
    border-radius: 50%;
    background: #292929;
    color: var(--color-gold);
    font-size: 13px;
  }

  .process-layout :deep(.process-timeline li:first-child .process-number) {
    border-color: var(--color-gold);
    background: var(--color-gold);
    color: #141414;
  }

  .process-layout :deep(.process-timeline h3) {
    color: var(--color-text);
    font-family: var(--font-heading);
    font-size: var(--type-h3);
    font-weight: 600;
    line-height: 1.4;
  }

  .process-layout :deep(.process-timeline li:first-child h3) {
    color: var(--color-gold);
  }

  .process-layout :deep(.process-timeline p) {
    max-width: none;
    margin-top: 6px;
    color: rgba(245, 242, 235, .72);
    font-size: var(--type-service-body);
    font-weight: 400;
    line-height: 1.7;
  }

  .gallery-section {
    background: #292929;
  }

  .gallery-section .section-kicker {
    display: none;
  }

  .gallery-section .section-heading {
    gap: 10px;
    margin-bottom: 20px;
  }

  .gallery-section .section-heading .section-lead {
    max-width: none;
    margin: 0;
  }

  .featured-gallery {
    display: none;
  }

  .featured-gallery-mobile {
    display: grid;
    gap: 4px;
  }

  .gallery-mobile-feature,
  .gallery-mobile-tile {
    position: relative;
    display: block;
    overflow: hidden;
    background: #161616;
  }

  .gallery-mobile-feature {
    aspect-ratio: 1.4;
  }

  .gallery-mobile-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 4px;
  }

  .gallery-mobile-tile {
    aspect-ratio: 1.2;
  }

  .gallery-mobile-feature img,
  .gallery-mobile-tile img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .gallery-mobile-tile.is-all-projects::after {
    position: absolute;
    inset: 0;
    background: rgba(9, 9, 9, .56);
    content: '';
  }

  .gallery-mobile-all-link {
    position: absolute;
    z-index: 1;
    top: 50%;
    left: 50%;
    display: inline-flex;
    min-height: 44px;
    align-items: center;
    gap: 8px;
    padding: 0 12px;
    border: 1px solid var(--color-gold);
    color: var(--color-gold);
    font-size: 11px;
    white-space: nowrap;
    transform: translate(-50%, -50%);
  }

  .reasons-section {
    display: none;
  }

  .mobile-reasons-section {
    display: block;
    padding: 42px 16px;
    background: #111;
  }

  .mobile-reasons-section .center-heading {
    margin-bottom: 18px;
  }

  .mobile-reasons-section :deep(.about-values) {
    padding: 0;
    background: transparent;
  }

  .mobile-reasons-section :deep(.about-values > .section-heading) {
    display: none;
  }

  .mobile-reasons-section :deep(.about-value-list) {
    width: 100%;
    border-color: rgba(214, 179, 106, .22);
    background: #161616;
  }

  .mobile-reasons-section :deep(.about-value-list li) {
    border-bottom-color: rgba(214, 179, 106, .18);
    background: #161616;
  }

  .service-detail-page :deep(.completed-project-section) {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
    padding: 42px 16px;
    background: #292929;
  }

  .service-detail-page :deep(.completed-project-list) {
    display: contents;
  }

  .service-detail-page :deep(.completed-project-list h2) {
    grid-row: 1;
    margin: 0 0 18px;
    font-size: var(--type-h2);
    text-align: center;
  }

  .service-detail-page :deep(.completed-project-preview) {
    grid-row: 2;
    width: 100%;
    aspect-ratio: 16 / 9;
  }

  .service-detail-page :deep(.completed-project-selected-title) {
    grid-row: 3;
    margin: 13px 0 0;
    color: var(--color-text);
    font-size: var(--type-h3);
    font-weight: 600;
    text-align: center;
  }

  .service-detail-page :deep(.completed-project-items) {
    grid-row: 4;
    display: flex;
    height: auto;
    gap: 8px;
    margin-top: 16px;
    overflow: visible;
  }

  .service-detail-page :deep(.completed-project-item) {
    display: block;
    min-width: 0;
    min-height: 44px;
    flex: 1 1 0;
    padding: 0;
    border: 1px solid rgba(245, 242, 235, .2);
  }

  .service-detail-page :deep(.completed-project-item:nth-child(n + 4)) {
    display: none;
  }

  .service-detail-page :deep(.completed-project-item.is-active) {
    border-color: var(--color-gold);
  }

  .service-detail-page :deep(.completed-project-item img) {
    display: block;
    width: 100%;
    height: 100%;
    aspect-ratio: 1.4;
    object-fit: cover;
  }

  .service-detail-page :deep(.completed-project-item-copy) {
    display: none;
  }

  .service-detail-page :deep(.completed-project-all-link) {
    grid-row: 5;
    display: inline-flex;
    justify-self: center;
    min-height: 44px;
    margin-top: 18px;
    padding: 0 16px;
    border-color: var(--color-gold);
    color: var(--color-gold);
    font-size: var(--type-cta);
  }

  .service-detail-page :deep(.completed-project-note) {
    display: none;
  }

  :deep(.knowledge-section .section-heading) {
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 18px;
  }

  :deep(.knowledge-section .eyebrow) {
    display: none;
  }

  :deep(.knowledge-section .section-heading h2) {
    font-size: 25px;
  }

  :deep(.knowledge-section .section-heading .text-link) {
    display: inline-flex;
    min-height: 44px;
    align-items: center;
    gap: 6px;
    padding: 0 10px;
    border: 1px solid var(--color-gold);
    color: var(--color-gold);
    font-size: 10px;
    white-space: nowrap;
  }

  .estimator-section {
    background: #292929;
  }

  .estimator-section .section-kicker {
    display: none;
  }

  .estimator-section :deep(.home-estimate-panel) {
    border: 1px solid rgba(214, 179, 106, .22);
    background: #161616;
  }

  .estimator-section :deep(.home-package-option) {
    min-height: 44px;
    border-color: rgba(245, 242, 235, .2);
  }

  .estimator-section :deep(.home-package-option.is-selected) {
    border-color: var(--color-gold);
  }

  .estimator-section :deep(.home-estimate-summary) {
    border: 1px solid rgba(245, 242, 235, .12);
    background: #202020;
  }

  .estimator-section :deep(.home-estimate-cta) {
    min-height: 48px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .gallery-featured img,
  .gallery-tile img,
  .article-image img {
    transition: none;
  }
}
</style>
