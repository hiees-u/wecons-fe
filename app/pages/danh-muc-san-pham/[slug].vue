<template>
  <main class="model-detail-page">
    <div v-if="pending && !model" class="page-state" role="status">
      {{ t('product_detail.loading') }}
    </div>

    <section v-else-if="!model" class="page-state" role="alert">
      <p class="eyebrow"><span></span>{{ t('product_detail.not_found_eyebrow') }}</p>
      <h1>{{ t('product_detail.not_found_title') }}</h1>
      <p>{{ t('product_detail.not_found_desc') }}</p>
      <button v-if="apiError" type="button" class="text-link" @click="retryLoad">
        {{ t('product_detail.retry') }} <span aria-hidden="true">↻</span>
      </button>
      <NuxtLink v-else class="text-link" to="/danh-muc-san-pham">
        {{ t('product_detail.back_to_collection') }} <span aria-hidden="true">↗</span>
      </NuxtLink>
    </section>

    <article v-else class="model-detail">
      <ModelHero
        :model="model"
        :breadcrumb-items="breadcrumbItems"
        :hero-facts="heroFacts"
        :consultation-link="consultationLink"
      />

      <ModelStory
        :image="storyImage"
        :image-alt="model.imageAlt"
        :paragraphs="storyParagraphs"
        :consultation-link="consultationLink"
      />

      <ModelGallery
        :images="galleryImages.slice(0, 5)"
        :fallback-image="model.image"
      />

      <ModelInfoTable
        :rows="detailRows"
      />

      <ModelDescription
        :detail-fallback="descriptionDetailFallback"
        :image-alt="model.imageAlt"
        :description-paragraphs="descriptionParagraphs"
        :description-blocks="descriptionBlocks"
        :architecture-documents="architectureDocuments"
        :closing-paragraphs="closingParagraphs"
      />

      <ModelClosingCta
        :image="detailFallback?.cta_image || model.image"
        :description="localized(detailFallback?.cta_description, detailFallback?.cta_description_en)"
        :consultation-link="consultationLink"
      />
    </article>
  </main>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import ModelHero from '~/components/catalog/ModelHero.vue'
import ModelStory from '~/components/catalog/ModelStory.vue'
import ModelGallery from '~/components/catalog/ModelGallery.vue'
import ModelInfoTable from '~/components/catalog/ModelInfoTable.vue'
import ModelDescription from '~/components/catalog/ModelDescription.vue'
import ModelClosingCta from '~/components/catalog/ModelClosingCta.vue'
import defaultSettings from '~/data/defaultSettings.json'
import homeData from '~/data/homeContent.json'
import { useI18n } from '~/composables/useI18n'
import { useNavigation } from '~/composables/useNavigation'
import { useRealEstate } from '~/composables/useRealEstate'
import type { HomeImageItem } from '~/types/content'
import { articleContentToBlocks } from '~/utils/articleContent'
import { truncateText } from '~/utils/formatters'
import type {
  ApiProperty,
  DetailModel,
  ProductDetailFallback,
} from '~/utils/catalogHelper'
import {
  normalizeProperty,
  localizedFallback,
  localizedFallbackList,
  getImage,
} from '~/utils/catalogHelper'

interface PropertyResponse {
  success?: boolean
  data?: ApiProperty | null
  message?: string
}

const route = useRoute()
const { t, locale } = useI18n()
const { siteUrl } = useNavigation()
const { getProperty } = useRealEstate()
const slug = computed(() => String(route.params.slug || ''))

const designs = homeData.designs as Array<HomeImageItem & { slug?: string; categorySlug: string }>
const fallbackDesign = computed(() => designs.find(item => item.slug === slug.value) || null)
const fallbackContent = defaultSettings.product_detail_fallback
const productDetailFallbacks = defaultSettings.product_detail_by_slug as Record<string, ProductDetailFallback>
const defaultDetailFallback = productDetailFallbacks['biet-thu-tan-co-dien-thanh-lich'] || null
const specificDetailFallback = computed(() => productDetailFallbacks[slug.value] || null)
const detailFallback = computed(() => specificDetailFallback.value || defaultDetailFallback)
const localDetailGallery = Array.from({ length: 8 }, (_, index) => `/images/mau-nha-detail/${index + 1}.webp`)

const { data: response, pending, error, refresh } = await useAsyncData<PropertyResponse | null>(
  () => `catalog-product-${slug.value}`,
  () => slug.value ? getProperty(slug.value) as Promise<PropertyResponse> : Promise.resolve(null),
  { watch: [slug], default: () => null },
)

const apiProperty = computed<ApiProperty | null>(() => {
  const result = response.value
  if (!result?.success || !result.data) return null
  return result.data.data || result.data
})

const mockModel = computed<DetailModel | null>(() => {
  const item = fallbackDesign.value
  const specific = specificDetailFallback.value
  const defaults = detailFallback.value
  if (!item && !defaults) return null

  const title = localized(specific?.title, specific?.title_en) || item?.title || localized(defaults?.title, defaults?.title_en) || slug.value
  const fallbackImage = item?.image || '/images/pg.webp'
  const images = localDetailGallery

  return {
    title,
    projectName: localized(specific?.project_name, specific?.project_name_en) || item?.title || localized(defaults?.project_name, defaults?.project_name_en) || title,
    category: item?.category || localized(specific?.type, specific?.type_en) || localized(defaults?.type, defaults?.type_en),
    image: localDetailGallery[0] || fallbackImage,
    imageAlt: item?.alt || title,
    images,
    description: '',
    content: '',
    area: specific?.area || defaults?.area || '',
    floors: localized(specific?.floors, specific?.floors_en) || localized(defaults?.floors, defaults?.floors_en),
    type: localized(specific?.type, specific?.type_en) || item?.category || localized(defaults?.type, defaults?.type_en),
    heroStyle: localized(specific?.hero_style, specific?.hero_style_en) || localized(defaults?.hero_style, defaults?.hero_style_en),
    style: localized(specific?.style, specific?.style_en) || localized(defaults?.style, defaults?.style_en),
    year: specific?.year || defaults?.year || '',
    materials: localized(specific?.materials, specific?.materials_en) || localized(defaults?.materials, defaults?.materials_en),
    location: localized(specific?.location, specific?.location_en) || localized(defaults?.location, defaults?.location_en),
  }
})

const model = computed<DetailModel | null>(() => {
  const mock = mockModel.value
  const property = apiProperty.value
  if (!property) return mock

  const normalized = normalizeProperty(
    property,
    fallbackDesign.value,
    detailFallback.value,
    locale.value,
    localDetailGallery,
    slug.value,
  )

  if (!mock) return normalized

  return {
    title: normalized.title || mock.title,
    projectName: normalized.projectName || mock.projectName,
    category: normalized.category || mock.category,
    image: normalized.image || mock.image,
    imageAlt: normalized.imageAlt || mock.imageAlt,
    images: normalized.images.length ? normalized.images : mock.images,
    description: normalized.description || mock.description,
    content: normalized.content || mock.content,
    area: normalized.area || mock.area,
    floors: normalized.floors || mock.floors,
    type: normalized.type || mock.type,
    heroStyle: normalized.heroStyle || mock.heroStyle,
    style: normalized.style || mock.style,
    year: normalized.year || mock.year,
    materials: normalized.materials || mock.materials,
    location: normalized.location || mock.location,
  }
})

const apiError = computed(() => Boolean(error.value || (response.value && !response.value.success && response.value.message)))

function localized(vietnamese?: string, english?: string): string {
  return localizedFallback(locale.value, vietnamese, english)
}

function localizedList(vietnamese?: string[], english?: string[]): string[] {
  return localizedFallbackList(locale.value, vietnamese, english)
}

const storyParagraphs = computed(() => {
  const apiParagraphs = articleContentToBlocks(model.value?.description)
    .map(block => block.text)
    .filter(Boolean)
  if (apiParagraphs.length) return apiParagraphs
  const specificParagraphs = locale.value === 'en'
    ? detailFallback.value?.story_en
    : detailFallback.value?.story
  if (specificParagraphs?.length) return specificParagraphs
  return [locale.value === 'vi' ? fallbackContent.story : t('product_detail.fallback_story')]
})

const storyText = computed(() => storyParagraphs.value.join(' '))

const architectureDocuments = computed(() => {
  const projectDocuments = locale.value === 'en'
    ? detailFallback.value?.architecture_documents_en
    : detailFallback.value?.architecture_documents
  if (projectDocuments?.length) return projectDocuments
  return locale.value === 'vi'
    ? fallbackContent.architecture_documents
    : [
        t('product_detail.document_1'),
        t('product_detail.document_2'),
        t('product_detail.document_3'),
        t('product_detail.document_4'),
      ]
})

const descriptionBlocks = computed(() => {
  const blocks = articleContentToBlocks(model.value?.content)
    .filter(block => block.kind !== 'image' && block.kind !== 'video')
  if (blocks.length) return blocks
  const specificParagraphs = locale.value === 'en'
    ? detailFallback.value?.description_en
    : detailFallback.value?.description
  if (specificParagraphs?.length) {
    return specificParagraphs.map(text => ({ kind: 'paragraph' as const, text }))
  }
  const text = locale.value === 'vi' ? fallbackContent.description : t('product_detail.fallback_description')
  return [{ kind: 'paragraph' as const, text }]
})

const contentImages = computed(() => articleContentToBlocks(model.value?.content)
  .filter(block => block.kind === 'image')
  .map(block => getImage(block.text))
  .filter(Boolean))

const galleryImages = computed(() => [...new Set([
  ...(model.value?.images || []),
  ...contentImages.value,
].filter(Boolean))])

const storyImage = computed(() => galleryImages.value[1] || galleryImages.value[0] || model.value?.image || '')

const descriptionParagraphs = computed(() => {
  const apiParagraphs = articleContentToBlocks(model.value?.content)
    .filter(block => block.kind === 'paragraph' || block.kind === 'list-item')
    .map(block => block.text)
    .filter(Boolean)
  if (apiParagraphs.length) return apiParagraphs
  return localizedList(detailFallback.value?.description, detailFallback.value?.description_en)
})

const descriptionDetailFallback = computed(() => {
  if (!detailFallback.value) return null
  if (apiProperty.value && (model.value?.content || model.value?.description)) {
    return { ...detailFallback.value, feature_images: undefined }
  }
  return detailFallback.value
})

const closingParagraphs = computed(() => localizedList(
  detailFallback.value?.closing_paragraphs,
  detailFallback.value?.closing_paragraphs_en,
))

const heroFacts = computed(() => {
  if (!model.value) return []
  return [
    model.value.area ? { label: t('product_detail.area'), value: model.value.area } : null,
    model.value.floors ? { label: t('product_detail.floors'), value: model.value.floors } : null,
    model.value.heroStyle || model.value.style || model.value.category
      ? { label: t('product_detail.style'), value: model.value.heroStyle || model.value.style || model.value.category }
      : null,
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact))
})

const detailRows = computed(() => {
  if (!model.value) return []
  return [
    { label: t('product_detail.project_name'), value: model.value.projectName },
    { label: t('product_detail.type'), value: model.value.type || model.value.category },
    { label: t('product_detail.year'), value: model.value.year },
    { label: t('product_detail.style'), value: model.value.style },
    { label: t('product_detail.interior_area'), value: model.value.area },
    { label: t('product_detail.materials'), value: model.value.materials },
  ].filter(row => Boolean(row.value))
})

const breadcrumbItems = computed(() => [
  { label: t('product_detail.breadcrumb_home'), to: '/' },
  { label: t('product_detail.breadcrumb_collection'), to: '/danh-muc-san-pham' },
  { label: model.value?.title || slug.value },
])

const consultationLink = computed(() => ({
  path: '/lien-he',
  hash: '#consultation-form',
  query: { model: slug.value },
}))

const pageTitle = computed(() => model.value
  ? `${model.value.title} | ${t('product_detail.meta_title_suffix')}`
  : t('product_detail.not_found_title'))
const pageDescription = computed(() => truncateText(storyText.value, 148))
const canonicalUrl = computed(() => `${siteUrl.replace(/\/$/, '')}/danh-muc-san-pham/${encodeURIComponent(slug.value)}`)

function retryLoad(): void {
  void refresh()
}

useHead(() => ({
  title: pageTitle.value,
  meta: [
    { name: 'description', content: pageDescription.value },
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: pageTitle.value },
    { property: 'og:description', content: pageDescription.value },
    { property: 'og:url', content: canonicalUrl.value },
    { property: 'og:image', content: model.value?.image || '' },
    { name: 'robots', content: model.value ? 'index, follow' : 'noindex, nofollow' },
  ],
  link: [{ rel: 'canonical', href: canonicalUrl.value }],
}))
</script>

<style scoped>
.model-detail-page {
  --page-gutter: clamp(22px, 5.4vw, 78px);
  min-height: 70vh;
  overflow: clip;
  padding-bottom: clamp(72px, 9vw, 120px);
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 18px;
}

.page-state {
  width: min(1515px, calc(100% - var(--page-gutter, 24px) * 2));
  margin: 0 auto;
  padding: 120px 0;
  text-align: center;
}

.eyebrow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--color-gold);
  font-size: 13px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.eyebrow span {
  width: 28px;
  height: 1px;
  background: var(--color-gold);
}

.page-state h1 {
  font-family: var(--font-serif);
  font-size: clamp(32px, 3.2vw, 48px);
  margin-bottom: 16px;
}

.page-state p {
  color: rgba(245, 242, 235, .7);
  margin-bottom: 28px;
}

.text-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--color-gold);
  text-decoration: none;
  font-size: 16px;
  background: none;
  border: none;
  cursor: pointer;
}
</style>
