<template>
  <main class="project-detail-page">
    <AppBreadcrumb :items="breadcrumbItems" />

    <p v-if="loading" class="project-state" role="status">
      {{ t('project_detail.loading') }}
    </p>
    <section v-else-if="notFound" class="project-state project-not-found" role="alert">
      <p class="eyebrow"><span></span> {{ t('project_detail.not_found_eyebrow') }}</p>
      <h1>{{ t('project_detail.not_found_title') }}</h1>
      <p>{{ t('project_detail.not_found_desc') }}</p>
      <NuxtLink class="text-link" to="/du-an">
        {{ t('project_detail.back_to_projects') }} <span aria-hidden="true">↗</span>
      </NuxtLink>
    </section>
    <section v-else-if="errorMessage" class="project-state" role="alert">
      <p>{{ errorMessage }}</p>
      <button type="button" @click="loadProject">
        {{ t('project_detail.retry') }}
      </button>
    </section>
    <article v-else-if="project" class="project-content">
      <header class="project-header">
        <p class="eyebrow">
          <span></span>{{ project.category || t('project_detail.default_category') }}
        </p>
        <h1>{{ project.name }}</h1>
        <p v-if="project.location" class="project-location">{{ project.location }}</p>
        <div class="project-facts">
          <span v-if="project.type">{{ project.type }}</span>
          <span v-if="project.area">{{ project.area }}</span>
        </div>
      </header>

      <figure v-if="project.image" class="project-cover">
        <img
          :src="project.image"
          :alt="project.name"
          fetchpriority="high"
          width="1600"
          height="1000"
          @error="onImgError"
        >
      </figure>

      <section v-if="contentBlocks.length" class="project-description" :aria-label="t('project_detail.info_label')">
        <template v-for="(block, index) in contentBlocks" :key="`${block.kind}-${index}`">
          <h2 v-if="block.kind === 'heading'">{{ block.text }}</h2>
          <blockquote v-else-if="block.kind === 'quote'">{{ block.text }}</blockquote>
          <p v-else>{{ block.text }}</p>
        </template>
      </section>

      <aside class="project-cta">
        <p class="eyebrow"><span></span> {{ t('project_detail.cta_eyebrow') }}</p>
        <h2>
          {{ t('project_detail.cta_title_1') }}<br>
          <em>{{ t('project_detail.cta_title_2') }}</em>
        </h2>
        <NuxtLink class="text-link" to="/lien-he#consultation-form">
          {{ t('project_detail.cta_btn') }} <span aria-hidden="true">?</span>
        </NuxtLink>
      </aside>
    </article>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppBreadcrumb from '~/components/common/AppBreadcrumb.vue'
import homeData from '~/data/homeContent.json'
import type { ProjectDetail } from '~/types/project'
import { useRealEstate } from '~/composables/useRealEstate'
import { useNavigation } from '~/composables/useNavigation'
import { useI18n } from '~/composables/useI18n'
import { articleContentToBlocks } from '~/utils/articleContent'
import { getImageUrl, truncateText } from '~/utils/formatters'

const { t } = useI18n()
const route = useRoute()
const { getProject } = useRealEstate()
const { siteUrl } = useNavigation()

const slug = computed(() => String(route.params.slug || ''))

const { data: response, pending: loading, error, refresh: loadProject } = await useAsyncData(
  () => `project-detail-${slug.value}`,
  () => slug.value ? getProject(slug.value) : Promise.resolve(null),
  { watch: [slug] },
)

function normalizeProject(item: Record<string, any>): ProjectDetail {
  const imageValue = item.image || item.thumbnail || item.feature_image || item.images?.[0]
  const categories = Array.isArray(item.categories) ? item.categories : []
  return {
    id: item.id,
    slug: item.slugable?.key || item.slug || slug.value,
    name: item.name || item.title || t('project_detail.breadcrumb_fallback'),
    image: typeof imageValue === 'string'
      ? getImageUrl(imageValue, '/images/pg.webp')
      : getImageUrl(imageValue?.url || imageValue?.thumb, '/images/pg.webp'),
    location: item.location || item.city?.name || '',
    area: String(item.area || item.square || ''),
    type: item.project_type || item.type || '',
    category: categories.map((category: { name?: string }) => category.name).filter(Boolean).join(' � '),
    description: item.description || item.content || '',
  }
}

const fallbackProject = computed<ProjectDetail | null>(() => {
  const item = (homeData.projects || []).find(p => p.idProject === slug.value)
  if (!item) return null
  return {
    id: item.idProject,
    slug: item.idProject,
    name: item.title,
    image: item.image || '/images/pg.webp',
    location: item.detail || '',
    area: '',
    type: item.category || '',
    category: item.category || '',
    description: item.detail || '',
  }
})

const project = computed<ProjectDetail | null>(() => {
  if (response.value?.success && response.value.data) {
    return normalizeProject(response.value.data)
  }
  return fallbackProject.value
})

const notFound = computed(() => !loading.value && !project.value)
const errorMessage = computed(() => {
  if (error.value) return t('projects_page.error_load')
  if (response.value && !response.value.success && response.value.message && !notFound.value) {
    return response.value.message
  }
  return ''
})

const breadcrumbItems = computed(() => [
  { label: t('project_detail.breadcrumb_home'), to: '/' },
  { label: t('project_detail.breadcrumb_projects'), to: '/du-an' },
  { label: project.value?.name || t('project_detail.breadcrumb_fallback') },
])
const contentBlocks = computed(() => articleContentToBlocks(project.value?.description))
const pageTitle = computed(() => {
  if (!project.value) return `${t('project_detail.breadcrumb_projects')} | WE Construction`
  const base = project.value.name.trim()
  if (base.length > 45) return base
  return `${base} | WE Construction`
})
const description = computed(() => {
  const fallback = t('project_detail.meta_desc_default')
  const raw = project.value?.description || fallback
  let clean = String(raw).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  if (clean.length < 110 && fallback) {
    clean = `${clean} - ${fallback}`
  }
  if (clean.length > 150) {
    return clean.slice(0, 147).replace(/[,\s]+[^\s]*$/, '') + '...'
  }
  return clean
})
const canonicalUrl = computed(() => `${siteUrl.replace(/\/$/, '')}/du-an/${encodeURIComponent(slug.value)}`)
const breadcrumbSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbItems.value.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.label,
    item: index === breadcrumbItems.value.length - 1
      ? canonicalUrl.value
      : `${siteUrl.replace(/\/$/, '')}${item.to || '/'}`,
  })),
}))

function onImgError(e: Event) {
  const target = e.target as HTMLImageElement
  if (target && !target.dataset.fallbackApplied) {
    target.dataset.fallbackApplied = 'true'
    target.src = '/images/pg.webp'
  }
}

useSeoMeta({
  title: pageTitle,
  description,
  robots: () => notFound.value ? 'noindex, nofollow' : 'index, follow',
  ogType: 'article',
  ogTitle: pageTitle,
  ogDescription: description,
  ogUrl: canonicalUrl,
  ogImage: () => project.value?.image || `${siteUrl.replace(/\/$/, '')}/images/logo.png`,
  twitterCard: 'summary_large_image',
  twitterTitle: pageTitle,
  twitterDescription: description,
  twitterImage: () => project.value?.image || `${siteUrl.replace(/\/$/, '')}/images/logo.png`,
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
  script: [{
    type: 'application/ld+json',
    textContent: () => JSON.stringify(breadcrumbSchema.value),
  }],
})
</script>

<style scoped>
.project-detail-page {
  --page-gutter: clamp(22px, 5.4vw, 78px);
  min-height: 70vh;
  overflow: clip;
  padding-bottom: clamp(76px, 9vw, 120px);
  background: var(--color-bg);
  color: var(--color-text);
}
.project-breadcrumb {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: min(1280px, calc(100% - var(--page-gutter) * 2));
  margin: 0 auto;
  padding: 27px 0;
  color: var(--color-subtle);
  font-size: 10px;
}
.project-breadcrumb a {
  color: var(--color-muted);
  text-decoration: none;
}
.project-breadcrumb a:hover,
.project-breadcrumb a:focus-visible {
  color: var(--color-champagne);
}
.project-content {
  width: min(1280px, calc(100% - var(--page-gutter) * 2));
  margin: 0 auto;
}
.project-header {
  max-width: 850px;
  padding: clamp(38px, 6vw, 78px) 0 34px;
}
.eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--color-gold);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 1.7px;
}
.eyebrow > span {
  width: 30px;
  height: 1px;
  background: currentColor;
}
.project-header h1 {
  margin-top: 18px;
  color: var(--color-text);
  font-size: clamp(42px, 6.4vw, 78px);
  font-weight: 500;
  letter-spacing: -2px;
  line-height: 1.08;
}
.project-location {
  margin-top: 18px;
  color: var(--color-muted);
  font-size: 12px;
}
.project-facts {
  display: flex;
  flex-wrap: wrap;
  gap: 9px 22px;
  margin-top: 17px;
  color: var(--color-subtle);
  font-size: 10px;
}
.project-cover {
  aspect-ratio: 1.6;
  overflow: hidden;
  background: var(--color-surface);
}
.project-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.project-description {
  max-width: 760px;
  margin: clamp(42px, 7vw, 88px) auto 0;
  color: #d6d2ca;
  font-size: 14px;
  line-height: 2;
}
.project-description h2 {
  margin: 30px 0 12px;
  color: var(--color-text);
  font-size: 24px;
  font-weight: 500;
  line-height: 1.3;
}
.project-description blockquote {
  margin: 28px 0;
  padding-left: 20px;
  border-left: 1px solid var(--color-gold);
  color: var(--color-champagne);
  font-family: var(--font-serif);
  font-size: 20px;
}
.project-cta {
  margin-top: clamp(65px, 9vw, 115px);
  padding: 34px 0;
  border-top: 1px solid var(--color-border);
}
.project-cta h2 {
  margin-top: 17px;
  font-size: clamp(32px, 4.5vw, 52px);
  font-weight: 500;
  line-height: 1.18;
}
.project-cta h2 em {
  color: var(--color-champagne);
  font-family: var(--font-serif);
  font-weight: 400;
}
.text-link {
  display: inline-flex;
  align-items: center;
  gap: 15px;
  margin-top: 23px;
  color: var(--color-champagne);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 1.2px;
  text-decoration: none;
}
.text-link:focus-visible {
  outline: 2px solid var(--color-champagne);
  outline-offset: 5px;
}
.project-state {
  width: min(1280px, calc(100% - var(--page-gutter) * 2));
  min-height: 340px;
  margin: 0 auto;
  padding: 70px 0;
  color: var(--color-muted);
  font-size: 13px;
  line-height: 1.8;
}
.project-state h1 {
  margin-top: 17px;
  color: var(--color-text);
  font-size: clamp(36px, 5vw, 58px);
  font-weight: 500;
}
.project-state > p:not(.eyebrow) {
  margin-top: 12px;
}
.project-state button {
  margin-top: 18px;
  padding: 11px 16px;
  border: 1px solid var(--color-gold);
  background: transparent;
  color: var(--color-champagne);
  font-size: 9px;
  letter-spacing: 1px;
  cursor: pointer;
}
@media (max-width: 600px) {
  .project-header h1 {
    letter-spacing: -1.3px;
  }
  .project-cover {
    aspect-ratio: 1.1;
  }
  .project-description {
    font-size: 13px;
  }
}
</style>
