<template>
  <main class="projects-page">
    <EditorialPageHero
      title-id="projects-title"
      :eyebrow="t('projects_page.hero_eyebrow')"
      :title="t('projects_page.hero_title')"
      :title-accent="t('projects_page.hero_title_accent')"
      :description="t('projects_page.hero_desc')"
      :image="cmsPage?.image || settings?.projects_banner || '/images/pg.webp'"
      :image-mobile="cmsPage?.image || settings?.default_page_banner_mobile || '/images/pg-mobile.webp'"
      :image-alt="t('projects_page.hero_image_alt')"
      :cta-label="t('projects_page.hero_cta')"
      cta-to="/lien-he#consultation-form"
      :caption="t('projects_page.hero_caption')"
    />

    <section class="projects-content" aria-labelledby="projects-list-title">
      <AppBreadcrumb :items="breadcrumbItems" />
      <div class="projects-heading">
        <div>
          <p class="eyebrow"><span></span> {{ t('projects_page.section_eyebrow') }}</p>
          <h2 id="projects-list-title">
            {{ t('projects_page.section_title') }}<br>
            <em>{{ t('projects_page.section_title_accent') }}</em>
          </h2>
        </div>
        <p>{{ t('projects_page.section_desc') }}</p>
      </div>

      <AppFeedbackState
        v-if="loading"
        type="loading"
        :description="t('projects_page.loading')"
      />
      <AppFeedbackState
        v-else-if="errorMessage"
        type="error"
        :description="errorMessage"
        :retry-label="t('projects_page.retry')"
        @retry="loadProjects"
      />
      <div v-else-if="projects.length" class="projects-grid">
        <ProjectCard
          v-for="(project, index) in projects"
          :key="project.id"
          :project="project"
          :index="index"
        />
      </div>
      <AppFeedbackState
        v-else
        type="empty"
        :title="t('projects_page.empty_title')"
        :description="t('projects_page.empty_desc')"
        :cta-label="t('projects_page.empty_cta')"
        cta-to="/lien-he#consultation-form"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppBreadcrumb from '~/components/common/AppBreadcrumb.vue'
import EditorialPageHero from '~/components/EditorialPageHero.vue'
import ProjectCard from '~/components/project/ProjectCard.vue'
import AppFeedbackState from '~/components/common/AppFeedbackState.vue'
import homeData from '~/data/homeContent.json'
import type { ApiProject, PublishedProject } from '~/types/project'
import { useRealEstate } from '~/composables/useRealEstate'
import { useNavigation } from '~/composables/useNavigation'
import { useI18n } from '~/composables/useI18n'
import { useSiteSettings } from '~/composables/useSiteSettings'

const { t } = useI18n()
const { settings } = useSiteSettings()
const { getProjects } = useRealEstate()
const { siteUrl } = useNavigation()

const { data: response, pending: loading, error, refresh: loadProjects } = await useAsyncData(
  'projects-list-page',
  () => getProjects({ per_page: 24 }),
)

const errorMessage = computed(() => {
  if (error.value) return t('projects_page.error_load')
  if (response.value && !response.value.success && response.value.message) return response.value.message
  return ''
})

const defaultProjects = computed<PublishedProject[]>(() => {
  const fallbackList = homeData.projects || []
  return fallbackList.map((item, index) => ({
    id: item.idProject || index + 1,
    name: item.title || t('project_detail.breadcrumb_fallback'),
    slug: item.idProject || `du-an-${index + 1}`,
    image: item.image || '/images/pg.webp',
    location: item.detail || '',
    area: '',
    type: item.category || '',
    category: item.category || '',
  }))
})

const projects = computed<PublishedProject[]>(() => {
  const data = response.value?.data
  if (Array.isArray(data) && data.length) {
    return data
      .filter((item: ApiProject): item is ApiProject & { id: number | string } => item?.id !== undefined && Boolean(item.name || item.title))
      .map((item: ApiProject) => ({
        id: item.id,
        name: item.name || item.title || t('project_detail.breadcrumb_fallback'),
        slug: item.slug || item.slugable?.key,
        image: (() => { const raw = (typeof item.image === "string" ? item.image : (item.image?.url || item.image?.thumb || item.images?.[0] || "")).trim(); return (!raw || /600x600|resido\.local/i.test(raw)) ? "/images/pg.webp" : raw; })(),
        location: item.location || item.city?.name || '',
        area: item.area || item.square || '',
        type: item.project_type || item.type || '',
        category: item.categories?.map(category => category.name).filter(Boolean).join(' · ')
          || item.category?.name
          || '',
      }))
  }
  return defaultProjects.value
})

const title = t('projects_page.meta_title')
const description = t('projects_page.meta_desc')
const breadcrumbItems = computed(() => [
  { label: t('project_detail.breadcrumb_home'), to: '/' },
  { label: t('project_detail.breadcrumb_projects') },
])
const canonicalUrl = `${siteUrl.replace(/\/$/, '')}/du-an`
const breadcrumbSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: breadcrumbItems.value[0].label,
      item: `${siteUrl.replace(/\/$/, '')}/`,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: breadcrumbItems.value[1].label,
      item: canonicalUrl,
    },
  ],
}))
useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
  script: [{
    type: 'application/ld+json',
    textContent: () => JSON.stringify(breadcrumbSchema.value),
  }],
})

const cmsPage = await useCmsPageMeta('projects', { title, description })
</script>

<style scoped>
.projects-page {
  --page-gutter: clamp(22px, 5.4vw, 78px);
  overflow: clip;
  background: var(--color-bg);
  color: var(--color-text);
}
.projects-content {
  width: min(1280px, calc(100% - var(--page-gutter) * 2));
  margin: 0 auto;
  padding: clamp(82px, 9vw, 125px) 0;
}
.projects-heading {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 30px;
  margin-bottom: 45px;
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
.projects-heading h2 {
  margin-top: 18px;
  color: var(--color-text);
  font-size: clamp(36px, 4.4vw, 58px);
  font-weight: 500;
  letter-spacing: -1.8px;
  line-height: 1.13;
}
.projects-heading h2 em {
  color: var(--color-champagne);
  font-family: var(--font-serif);
  font-weight: 400;
}
.projects-heading > p {
  max-width: 350px;
  color: var(--color-muted);
  font-size: 12px;
  line-height: 1.8;
}
.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 38px 22px;
}
.projects-state {
  padding: 48px 0;
  border-top: 1px solid var(--color-border);
  color: var(--color-muted);
  font-size: 13px;
  line-height: 1.8;
}
.projects-state h3 {
  color: var(--color-text);
  font-size: 20px;
  font-weight: 500;
}
.projects-state p {
  max-width: 540px;
  margin-top: 10px;
}
.projects-state button {
  display: block;
  margin-top: 16px;
  padding: 10px 0;
  border: 0;
  background: none;
  color: var(--color-champagne);
  font-size: 9px;
  letter-spacing: 1px;
  cursor: pointer;
}
.projects-state .text-link {
  margin-top: 20px;
}
@media (max-width: 650px) {
  .projects-heading {
    align-items: flex-start;
    flex-direction: column;
  }
  .projects-grid {
    grid-template-columns: 1fr;
    gap: 29px;
  }
}
</style>
