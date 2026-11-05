<template>
  <main ref="aboutPage" class="editorial-page" :class="{ 'motion-reveal-enabled': revealEnabled }">
    <EditorialPageHero
      class="about-hero"
      title-id="about-title"
      compact
      :breadcrumb-home="t('nav.home')"
      :breadcrumb-label="t('about_page.banner_title')"
      :eyebrow="t('about_page.hero_eyebrow')"
      :title="t('about_page.banner_title')"
      :description="t('about_page.hero_desc')"
      :image="cmsPage?.image || settings?.about_banner || '/images/bg-3.webp'"
      :image-mobile="cmsPage?.image || settings?.about_banner || '/images/bg-3.webp'"
      :image-alt="t('about_page.hero_image_alt')"
      :cta-label="t('about_page.hero_cta')"
      cta-to="/lien-he#consultation-form"
      :caption="t('about_page.hero_caption')"
    />

    <AboutOverview :overview="aboutOverview" :metrics="metrics" />

    <AboutStory />

    <AboutServices />

    <AboutValues :values="companyValues" />

    <AboutPortfolio :portfolio="aboutPortfolio" />

    <section class="about-events section" aria-labelledby="about-events-title">
      <SectionHeading
        :title="t('about_page.events_title')"
        heading-id="about-events-title"
        link-href="/tin-tuc"
        :link-text="t('about_page.events_view_all')"
      />
      <div v-if="featuredEvents.length" class="about-event-grid">
        <BlogCard v-for="event in featuredEvents" :key="event.id" :post="event" />
      </div>
      <p v-else class="about-events-empty">{{ t('about_page.events_empty') }}</p>
    </section>

    <!-- <AboutCta /> -->
  </main>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import type { BlogPost } from '~/composables/useBlog'
import EditorialPageHero from '~/components/EditorialPageHero.vue'
import AboutOverview from '~/components/about/AboutOverview.vue'
import AboutStory from '~/components/about/AboutStory.vue'
import AboutServices from '~/components/about/AboutServices.vue'
import AboutValues from '~/components/about/AboutValues.vue'
import AboutPortfolio from '~/components/about/AboutPortfolio.vue'
import AboutCta from '~/components/about/AboutCta.vue'
import BlogCard from '~/components/blog/BlogCard.vue'
import type { ArticleSummary } from '~/components/blog/BlogFeaturedCard.vue'
import SectionHeading from '~/components/common/SectionHeading.vue'
import pageData from '~/data/pageContent.json'
import type { CompanyValue } from '~/types/content'
import { useBlog } from '~/composables/useBlog'
import { useNavigation } from '~/composables/useNavigation'
import { useI18n } from '~/composables/useI18n'
import { useSiteSettings } from '~/composables/useSiteSettings'
import { buildOrganizationJsonLd } from '~/utils/seoHelper'

definePageMeta({ alias: ['/about'] })

const { t } = useI18n()
const aboutPage = ref<HTMLElement | null>(null)
const revealEnabled = ref(false)
let revealObserver: IntersectionObserver | undefined
let motionPreference: MediaQueryList | undefined

function setupSectionReveal(): void {
  const page = aboutPage.value
  if (!page || !('IntersectionObserver' in window) || motionPreference?.matches) return

  revealObserver?.disconnect()
  const targets = page.querySelectorAll<HTMLElement>(
    '.about-overview, .about-story, .about-services, .about-values, .about-portfolio, .about-events',
  )

  targets.forEach(target => target.classList.remove('is-revealed'))
  revealEnabled.value = true

  void nextTick(() => {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed')
          revealObserver?.unobserve(entry.target)
        }
      })
    }, { threshold: 0, rootMargin: '0px 0px -8% 0px' })

    targets.forEach(target => revealObserver?.observe(target))
  })
}

function updateMotionPreference(event: MediaQueryListEvent): void {
  if (event.matches) {
    revealObserver?.disconnect()
    revealEnabled.value = false
    return
  }

  setupSectionReveal()
}

onMounted(() => {
  motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
  motionPreference.addEventListener('change', updateMotionPreference)
  setupSectionReveal()
})

onBeforeUnmount(() => {
  revealObserver?.disconnect()
  motionPreference?.removeEventListener('change', updateMotionPreference)
})

const { siteUrl } = useNavigation()
const {
  settings,
  aboutOverview,
  aboutPortfolio,
  companyValues: settingsCompanyValues,
  metrics: settingsMetrics,
  footerCompanyName,
  hotline,
  address,
  footerTaxId,
  logo,
} = useSiteSettings()
const companyValues = computed(() => (settingsCompanyValues.value?.length ? settingsCompanyValues.value : pageData.companyValues as CompanyValue[]))
const defaultMetrics = [
  { value: '10+', label: t('about_page.metric_experience'), icon: 'fa-solid fa-award' },
  { value: '98%', label: t('about_page.metric_satisfaction'), icon: 'fa-solid fa-face-smile' },
  { value: '300+', label: t('about_page.metric_construction'), icon: 'fa-solid fa-helmet-safety' },
  { value: '300+', label: t('about_page.metric_design'), icon: 'fa-solid fa-pen-ruler' },
]
const metrics = computed(() => (settingsMetrics.value?.length ? settingsMetrics.value.map((m, idx) => ({ ...defaultMetrics[idx % defaultMetrics.length], ...m })) : defaultMetrics))

const pageTitle = computed(() => t('about_page.meta_title'))
const pageDescription = computed(() => t('about_page.meta_desc'))

const { getPosts } = useBlog()
const { data: featuredEvents } = await useAsyncData<ArticleSummary[]>(
  'about-featured-events-tag-75',
  async () => {
    try {
      const response = await getPosts({ per_page: 4, tag_id: 75 })
      if (!response.success || !Array.isArray(response.data)) {
        console.error('[About page] Featured events API returned an invalid response.')
        return []
      }

      return response.data.slice(0, 4).map((post: BlogPost) => ({
        id: post.id,
        slug: post.slug || post.slugable?.key || String(post.id),
        title: post.name || post.title || '',
        excerpt: post.description || post.excerpt || '',
        image: typeof post.image === 'string' ? post.image : '',
        category: post.categories?.[0]?.name || '',
        date: post.published_at || post.created_at || '',
      }))
    } catch (error) {
      console.error('[About page] Failed to load featured events during SSR:', error)
      return []
    }
  },
)

const aboutCanonical = `${siteUrl.replace(/\/$/, '')}/gioi-thieu`

useHead({
  meta: [
    { property: 'og:url', content: aboutCanonical },
  ],
  link: [{ rel: 'canonical', href: aboutCanonical }],
  script: [
    {
      type: 'application/ld+json',
      textContent: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: pageTitle.value,
        description: pageDescription.value,
        url: aboutCanonical,
        publisher: {
          '@id': 'https://wecons.vn/#organization',
        },
      }),
    },
  ],
})

const cmsPage = await useCmsPageMeta('about', {
  title: pageTitle,
  description: pageDescription,
})
</script>

<style scoped>
.editorial-page {
  --page-gutter: clamp(22px, 5.4vw, 78px);
  --about-content-width: 1515px;
  overflow: clip;
  background: var(--color-bg);
  color: var(--color-text);
}

.editorial-page.motion-reveal-enabled :deep(.about-overview),
.editorial-page.motion-reveal-enabled :deep(.about-story),
.editorial-page.motion-reveal-enabled :deep(.about-services),
.editorial-page.motion-reveal-enabled :deep(.about-values),
.editorial-page.motion-reveal-enabled :deep(.about-portfolio),
.editorial-page.motion-reveal-enabled :deep(.about-events) {
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 700ms ease,
    transform 700ms cubic-bezier(0.2, 0.65, 0.3, 1);
}

.editorial-page.motion-reveal-enabled :deep(.about-overview.is-revealed),
.editorial-page.motion-reveal-enabled :deep(.about-story.is-revealed),
.editorial-page.motion-reveal-enabled :deep(.about-services.is-revealed),
.editorial-page.motion-reveal-enabled :deep(.about-values.is-revealed),
.editorial-page.motion-reveal-enabled :deep(.about-portfolio.is-revealed),
.editorial-page.motion-reveal-enabled :deep(.about-events.is-revealed) {
  opacity: 1;
  transform: translateY(0);
}

.about-events {
  width: 100%;
  margin: 0 auto;
  padding: clamp(28px, 4vw, 48px)
    max(var(--page-gutter), calc((100% - var(--about-content-width)) / 2))
    clamp(60px, 7vw, 90px);
  background: #292929;
}

.about-events :deep(.section-heading) {
  margin-bottom: 28px;
  justify-content: space-between;
}

.about-event-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.about-events-empty {
  color: var(--color-muted);
  font-size: 13px;
}

@media (max-width: 760px) {
  .about-event-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px 14px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .editorial-page.motion-reveal-enabled :deep(.about-overview),
  .editorial-page.motion-reveal-enabled :deep(.about-story),
  .editorial-page.motion-reveal-enabled :deep(.about-services),
  .editorial-page.motion-reveal-enabled :deep(.about-values),
  .editorial-page.motion-reveal-enabled :deep(.about-portfolio),
  .editorial-page.motion-reveal-enabled :deep(.about-events) {
    transition: none;
    transform: none;
  }
}

@media (max-width: 420px) {
  .about-event-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .editorial-page {
    --page-gutter: 16px;
  }

  :deep(.about-hero.editorial-hero--compact) {
    min-height: clamp(380px, 52svh, 470px);
  }

  :deep(.about-hero.editorial-hero--compact .editorial-hero-copy) {
    padding: 100px 16px 38px;
  }

  :deep(.about-hero.editorial-hero--compact h1) {
    font-size: clamp(42px, 11vw, 56px);
    letter-spacing: -1.5px;
    text-align: left;
  }

  :deep(.about-hero .editorial-breadcrumb) {
    gap: 8px;
    font-size: 11px;
  }

  :deep(.about-overview) {
    gap: 20px;
    padding-top: 30px;
  }

  :deep(.about-overview-copy) {
    padding: 0 16px;
  }

  :deep(.about-overview-copy h2) {
    font-size: clamp(25px, 7vw, 31px);
    letter-spacing: -.5px;
    line-height: 1.2;
  }

  :deep(.about-overview-copy p) {
    margin-top: 12px;
    font-size: 13px;
    line-height: 1.75;
  }

  :deep(.about-overview-stats) {
    display: none;
  }

  .about-events {
    padding: 30px 16px 42px;
  }

  .about-events :deep(.section-heading) {
    flex-direction: row;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  .about-events :deep(.section-heading > div:first-child) {
    min-width: 0;
  }

  .about-events :deep(.section-heading h2) {
    font-family: var(--font-serif);
    font-size: clamp(24px, 7vw, 30px);
    font-weight: 400;
    letter-spacing: -.5px;
    line-height: 1.2;
  }

  .about-events :deep(.section-heading-side) {
    flex: 0 0 auto;
    align-items: flex-end;
  }

  .about-events :deep(.section-heading .text-link) {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 7px 9px;
    border: 1px solid var(--color-gold);
    color: var(--color-gold);
    font-size: 9px;
    letter-spacing: .04em;
    line-height: 1.2;
    text-decoration: none;
    white-space: nowrap;
  }

  .about-event-grid {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .about-event-grid :deep(.article-card) {
    flex-direction: row;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 0;
    border-top: 1px solid rgba(245, 242, 235, .16);
  }

  .about-event-grid :deep(.article-image) {
    width: 72px;
    flex: 0 0 72px;
    aspect-ratio: 1;
  }

  .about-event-grid :deep(.article-card-copy) {
    min-width: 0;
    padding-top: 0;
  }

  .about-event-grid :deep(.article-meta) {
    gap: 5px;
    font-size: 10px;
  }

  .about-event-grid :deep(.article-meta svg) {
    width: 15px;
    height: 15px;
    flex-basis: 15px;
    color: var(--color-gold);
  }

  .about-event-grid :deep(.article-card h3) {
    display: -webkit-box;
    overflow: hidden;
    margin-top: 5px;
    font-size: 13px;
    font-weight: 500;
    line-height: 1.45;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .about-event-grid :deep(.article-card .text-link) {
    display: none;
  }
}
</style>
