<template>
  <main class="article-page">
    <AppBreadcrumb :items="breadcrumbItems" />

    <BlogLoadingState v-if="loading" :label="t('article_detail.loading')" />
    <section v-else-if="notFound" class="article-state article-not-found" role="alert">
      <p class="eyebrow"><span></span> {{ t('article_detail.not_found_eyebrow') }}</p>
      <h1>{{ t('article_detail.not_found_title') }}</h1>
      <p>{{ t('article_detail.not_found_desc') }}</p>
      <NuxtLink class="text-link" to="/tin-tuc">
        {{ t('article_detail.back_to_blog') }} <span aria-hidden="true">↗</span>
      </NuxtLink>
    </section>
    <section v-else-if="errorMessage" class="article-state" role="alert">
      <p>{{ errorMessage }}</p>
      <button type="button" @click="loadArticle">
        {{ t('article_detail.retry') }}
      </button>
    </section>
    <article v-else-if="post" class="article-content">
      <div class="article-layout">
        <aside class="article-toc article-toc-desktop" :aria-label="t('article_detail.toc_title')">
          <p class="sidebar-heading">{{ t('article_detail.toc_title') }}</p>
          <nav v-if="tableOfContents.length" :aria-label="t('article_detail.toc_title')">
            <a
              v-for="item in tableOfContents"
              :key="item.id"
              :href="`#${item.id}`"
              :class="{ 'is-active': activeTocId === item.id, 'is-nested': item.level > 2 }"
              @click.prevent="scrollToHeading(item.id)"
            >
              {{ item.title }}
            </a>
          </nav>
          <p v-else class="sidebar-empty">{{ t('article_detail.toc_empty') }}</p>
        </aside>

        <div class="article-main">
          <header class="article-header">
            <p class="eyebrow"><span></span>{{ post.category || t('article_detail.default_category') }}</p>
            <h1>{{ post.title }}</h1>
            <div class="article-byline">
              <time v-if="post.date" :datetime="post.date">{{ formatDate(post.date) }}</time>
              <span v-if="post.author">{{ t('article_detail.author_label') }} {{ post.author }}</span>
            </div>
          </header>

          <aside class="article-toc article-toc-mobile" :aria-label="t('article_detail.toc_title')">
            <button
              class="article-toc-toggle"
              type="button"
              aria-controls="article-toc-list"
              :aria-expanded="!isTocCollapsed"
              @click="isTocCollapsed = !isTocCollapsed"
            >
              <span>{{ t('article_detail.toc_title') }}</span>
              <i class="article-toc-chevron fa-solid fa-chevron-down" :class="{ 'is-collapsed': isTocCollapsed }" aria-hidden="true"></i>
            </button>
            <div id="article-toc-list" v-show="!isTocCollapsed" class="article-toc-content">
              <nav v-if="tableOfContents.length" :aria-label="t('article_detail.toc_title')">
              <a
                v-for="item in tableOfContents"
                :key="item.id"
                :href="`#${item.id}`"
                :class="{ 'is-active': activeTocId === item.id, 'is-nested': item.level > 2 }"
                @click.prevent="scrollToHeading(item.id)"
              >
                {{ item.title }}
              </a>
              </nav>
              <p v-else class="sidebar-empty">{{ t('article_detail.toc_empty') }}</p>
            </div>
          </aside>

          <figure v-if="post.image" class="article-cover">
            <img
              :src="post.image"
              :alt="post.title"
              fetchpriority="high"
              width="1440"
              height="900"
              @error="onCoverError"
            >
          </figure>

          <ArticleContent
            :lead="post.excerpt"
            :blocks="contentBlocks"
            :heading-ids="headingIds"
          />
        </div>

        <ArticleRelated
          :posts="relatedPosts"
          :categories="postCategories"
        />
      </div>
    </article>
  </main>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppBreadcrumb from '~/components/common/AppBreadcrumb.vue'
import ArticleContent from '~/components/blog/ArticleContent.vue'
import ArticleRelated from '~/components/blog/ArticleRelated.vue'
import BlogLoadingState from '~/components/blog/BlogLoadingState.vue'
import type { RelatedArticle } from '~/components/blog/ArticleRelated.vue'
import { useBlog, getDefaultPostImage, type BlogPost } from '~/composables/useBlog'
import { useNavigation } from '~/composables/useNavigation'
import { useI18n } from '~/composables/useI18n'
import { articleContentToBlocks } from '~/utils/articleContent'
import { formatDate, getImageUrl, truncateText } from '~/utils/formatters'

import seoArticlesData from '~/data/seoArticles.json'

definePageMeta({
  alias: [
    '/blog/:slug'
  ]
})

interface Article {
  id: number | string
  slug: string
  title: string
  excerpt: string
  content: string
  image: string
  category: string
  date: string
  author: string
  categories: Array<{ id?: number | string; name: string; slug: string }>
}

const route = useRoute()
const { t } = useI18n()
const { getPost, getPosts } = useBlog()
const { siteUrl } = useNavigation()

const slug = computed(() => String(route.params.slug || ''))
const activeTocId = ref('')
const isTocCollapsed = ref(false)
let tocObserver: IntersectionObserver | undefined
const errorMessage = ref('')

function normalizeArticle(item: BlogPost): Article {
  const imageValue = item.image || item.thumbnail || item.feature_image
  const categories = item.categories
  const author = item.author
  const imagePath = typeof imageValue === 'string'
    ? imageValue
    : imageValue?.url || imageValue?.thumb || ''
  const seed = item.id || item.slugable?.key || item.slug || slug.value || ''
  const normalizedCategories = Array.isArray(categories)
    ? categories.flatMap((category) => {
      const name = category?.name || ''
      const categorySlug = category?.slug || (name ? slugifyHeading(name) : '')
      return name && categorySlug
        ? [{ id: category.id, name, slug: categorySlug }]
        : []
    })
    : []

  return {
    id: item.id,
    slug: item.slugable?.key || item.slug || slug.value,
    title: item.name || item.title || t('article_detail.breadcrumb_fallback'),
    excerpt: truncateText(item.description || item.excerpt || '', 220),
    content: item.content || item.body || '',
    image: getImageUrl(imagePath, '') || getDefaultPostImage(seed),
    category: Array.isArray(categories) ? categories[0]?.name || '' : '',
    categories: normalizedCategories,
    date: item.created_at || item.published_at || '',
    author: typeof author === 'string' ? author : author?.name || '',
  }
}

function slugifyHeading(value: string): string {
  return value.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function updateTocObserver(): void {
  tocObserver?.disconnect()
  tocObserver = undefined
  if (!import.meta.client || !tableOfContents.value.length) return

  tocObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((first, second) => first.boundingClientRect.top - second.boundingClientRect.top)
    if (visible[0]?.target.id) activeTocId.value = visible[0].target.id
  }, { rootMargin: '-18% 0px -68% 0px', threshold: 0 })

  tableOfContents.value.forEach((item) => {
    const heading = document.getElementById(item.id)
    if (heading) tocObserver?.observe(heading)
  })
  if (!activeTocId.value && tableOfContents.value[0]) activeTocId.value = tableOfContents.value[0].id
}

function scrollToHeading(id: string): void {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  activeTocId.value = id
}

const { data: asyncArticle, pending: loading, refresh: reloadArticle } = await useAsyncData(
  `article-${slug.value}`,
  async () => {
    if (!slug.value) return null
    try {
      const response = await getPost(slug.value)
      if (response && response.success && response.data) {
        return normalizeArticle(response.data)
      }
    } catch {
      // fallback
    }

    const current = slug.value.replace(/^\/|\/$/g, '')
    const matched = seoArticlesData.find(item => item.clean_slug === current || item.slug.replace(/^\/|\/$/g, '') === current)
    if (matched) {
      return {
        id: matched.source_code,
        slug: matched.clean_slug,
        title: matched.meta_title.split('|')[0].trim(),
        excerpt: matched.meta_description,
        content: `<h2>${matched.focus_keyword}</h2><p>${matched.meta_description}</p>`,
        image: getDefaultPostImage(matched.source_code),
        category: matched.market || 'TP.HCM',
        categories: [{ name: matched.market || 'TP.HCM', slug: 'tin-tuc' }],
        date: '2026-03-01',
        author: 'WE Construction',
      }
    }
    return null
  },
  { watch: [slug] },
)

const post = computed(() => asyncArticle.value)
const notFound = computed(() => !loading.value && !post.value)

const { data: relatedData } = await useAsyncData(
  `article-related-${slug.value}`,
  async () => {
    try {
      const relatedResponse = await getPosts({ per_page: 24 })
      if (relatedResponse && relatedResponse.success && Array.isArray(relatedResponse.data)) {
        return relatedResponse.data
      }
    } catch {
      // ignore
    }
    return []
  },
  { default: () => [] },
)

const breadcrumbItems = computed(() => [
  { label: t('article_detail.breadcrumb_home'), to: '/' },
  { label: t('article_detail.breadcrumb_blog'), to: '/tin-tuc' },
  { label: post.value?.title || t('article_detail.breadcrumb_fallback') },
])

const contentBlocks = computed(() => articleContentToBlocks(post.value?.content))

const headingIds = computed(() => {
  const counts = new Map<string, number>()
  return contentBlocks.value.map((block, index) => {
    if (block.kind !== 'heading') return ''
    const base = slugifyHeading(block.text) || `section-${index + 1}`
    const count = counts.get(base) || 0
    counts.set(base, count + 1)
    return count ? `${base}-${count + 1}` : base
  })
})

const tableOfContents = computed(() => contentBlocks.value.flatMap((block, index) => {
  if (block.kind !== 'heading') return []
  return [{ id: headingIds.value[index], title: block.text, level: block.level || 2 }]
}))

const matchedSeo = computed(() => {
  const current = slug.value.replace(/^\/|\/$/g, '')
  return seoArticlesData.find(item => item.clean_slug === current || item.slug.replace(/^\/|\/$/g, '') === current)
})

const pageTitle = computed(() => {
  const base = (matchedSeo.value?.meta_title || post.value?.title || t('article_detail.breadcrumb_fallback')).trim()
  if (base.length > 55) {
    return base.slice(0, 55).replace(/[,\s|–-]+[^\s]*$/, '')
  }
  return base
})

const canonicalUrl = computed(() => `${siteUrl.replace(/\/$/, '')}/tin-tuc/${encodeURIComponent(slug.value)}`)

const description = computed(() => {
  const raw = matchedSeo.value?.meta_description || post.value?.excerpt || post.value?.description || t('article_detail.meta_desc_default')
  let clean = String(raw).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  if (clean.length > 150) {
    clean = clean.slice(0, 147).replace(/[,\s]+[^\s]*$/, '') + '...'
  } else if (clean.length < 110) {
    clean = `${clean} - WECONS cam kết chất lượng, tiến độ và minh bạch vật tư xây dựng.`
    if (clean.length > 150) {
      clean = clean.slice(0, 147).replace(/[,\s]+[^\s]*$/, '') + '...'
    }
  }
  return clean
})

const keywords = computed(() => {
  if (matchedSeo.value) {
    return [matchedSeo.value.focus_keyword, ...(matchedSeo.value.secondary_keywords || [])].filter(Boolean).join(', ')
  }
  return ''
})

const robots = computed(() => matchedSeo.value?.robots || 'index,follow')

const relatedPosts = computed<RelatedArticle[]>(() => {
  const dynamicCandidates = (relatedData.value || [])
    .filter((item: any) => String(item.id) !== String(post.value?.id))
    .map((item: any) => {
      const imageValue = item.image || item.thumbnail || item.feature_image
      const imagePath = typeof imageValue === 'string'
        ? imageValue
        : imageValue?.url || imageValue?.thumb || ''
      return {
        id: item.id,
        slug: item.slugable?.key || item.slug || String(item.id),
        title: item.name || item.title || t('article_detail.breadcrumb_fallback'),
        image: getImageUrl(imagePath, '') || getDefaultPostImage(item.id || item.slug || ''),
        date: item.created_at || item.published_at || '',
      }
    })

  const currentSlug = slug.value.replace(/^\/|\/$/g, '')
  const seoCandidates = (seoArticlesData || [])
    .filter((item: any) => item.clean_slug !== currentSlug)
    .map((item: any) => ({
      id: item.source_code,
      slug: item.clean_slug,
      title: item.meta_title.split('|')[0].replace(/- WE Construction/i, '').trim(),
      image: getDefaultPostImage(item.source_code),
      date: '2026-03-01',
    }))

  return [...dynamicCandidates, ...seoCandidates].slice(0, 4)
})

const postCategories = computed<Array<{ id?: number | string; name: string; slug: string }>>(() => {
  const categoryMap = new Map<string, { id?: number | string; name: string; slug: string }>()
  for (const item of (relatedData.value || [])) {
    for (const category of item.categories || []) {
      const name = category?.name || ''
      const categorySlug = category?.slug || category?.slugable?.key || (name ? slugifyHeading(name) : '')
      const key = String(category?.id ?? categorySlug)
      if (name && categorySlug) categoryMap.set(key, { id: category.id, name, slug: categorySlug })
    }
  }
  for (const category of post.value?.categories || []) {
    categoryMap.set(String(category.id ?? category.slug), category)
  }
  return [...categoryMap.values()]
})

function onCoverError(e: Event) {
  const target = e.target as HTMLImageElement
  if (target && !target.dataset.fallbackApplied) {
    target.dataset.fallbackApplied = 'true'
    target.src = getDefaultPostImage(post.value?.id || post.value?.slug || slug.value)
  }
}

const seoImage = computed(() => {
  const img = post.value?.image
  if (!img) return `${siteUrl.replace(/\/$/, '')}/images/logo.png`
  if (img.startsWith('http://') || img.startsWith('https://')) return img
  return `${siteUrl.replace(/\/$/, '')}${img.startsWith('/') ? '' : '/'}${img}`
})

const articleSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: post.value?.title || pageTitle.value,
  description: description.value,
  image: [seoImage.value],
  datePublished: post.value?.date || '2026-01-01',
  dateModified: post.value?.date || '2026-01-01',
  author: {
    '@type': 'Organization',
    name: post.value?.author || 'WE Construction',
    url: siteUrl,
  },
  publisher: {
    '@id': 'https://wecons.vn/#organization',
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': canonicalUrl.value,
  },
}))

const breadcrumbSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: t('article_detail.breadcrumb_home'),
      item: siteUrl,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: t('article_detail.breadcrumb_blog'),
      item: `${siteUrl.replace(/\/$/, '')}/tin-tuc`,
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: post.value?.title || pageTitle.value,
      item: canonicalUrl.value,
    },
  ],
}))

useSeoMeta({
  title: pageTitle,
  description,
  keywords,
  robots,
  ogType: 'article',
  ogTitle: pageTitle,
  ogDescription: description,
  ogUrl: canonicalUrl,
  ogImage: seoImage,
  twitterCard: 'summary_large_image',
  twitterTitle: pageTitle,
  twitterDescription: description,
  twitterImage: seoImage,
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
  script: [
    {
      type: 'application/ld+json',
      textContent: () => JSON.stringify(articleSchema.value),
    },
    {
      type: 'application/ld+json',
      textContent: () => JSON.stringify(breadcrumbSchema.value),
    },
  ],
})

watch(contentBlocks, () => {
  void nextTick(updateTocObserver)
}, { flush: 'post' })

onMounted(() => {
  void nextTick(updateTocObserver)
})

onBeforeUnmount(() => tocObserver?.disconnect())

function loadArticle(): void {
  reloadArticle()
}

await useCmsPageMeta('articleDetail', {
  title: pageTitle,
  description,
})
</script>

<style scoped>
.article-page {
  --page-gutter: clamp(22px, 5.4vw, 78px);
  overflow: hidden;
  background: #292929;
  color: var(--color-text);
  padding: 110px 0 100px;
}

.article-page :deep(.app-breadcrumb) {
  width: min(1515px, calc(100% - var(--page-gutter) * 2));
  margin: 0 auto 34px;
}

.article-content {
  width: min(1515px, calc(100% - var(--page-gutter) * 2));
  margin: 0 auto;
}

.article-layout {
  display: grid;
  grid-template-columns: minmax(150px, .72fr) minmax(0, 2.35fr) minmax(220px, 1fr);
  gap: clamp(24px, 3vw, 54px);
  align-items: start;
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

.article-header h1 {
  margin-top: 16px;
  font-family: var(--font-heading);
  font-size: var(--type-article-title);
  font-weight: 650;
  line-height: 1.15;
  letter-spacing: -.7px;
  overflow-wrap: anywhere;
}

.article-byline {
  margin-top: 17px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px 18px;
  color: var(--color-subtle);
  font-size: 11px;
}

.article-byline time {
  color: var(--color-gold);
}

.article-main {
  min-width: 0;
}

.article-toc-mobile {
  display: none;
}

.article-cover {
  margin: 28px 0 32px;
  background: var(--color-surface);
  aspect-ratio: 1.78;
  overflow: hidden;
}

.article-cover img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-toc {
  position: sticky;
  top: 105px;
  min-width: 0;
  padding-left: 16px;
  border-left: 1px solid rgba(245, 242, 235, .2);
}

.sidebar-heading {
  margin-bottom: 16px;
  color: var(--color-gold);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1px;
  line-height: 1.5;
  text-transform: uppercase;
}

.article-toc nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.article-toc a {
  position: relative;
  color: var(--color-muted);
  font-size: 12px;
  line-height: 1.55;
  text-decoration: none;
  transition: color .2s ease;
}

.article-toc a::before {
  position: absolute;
  top: 0;
  bottom: 0;
  left: -17px;
  width: 2px;
  background: transparent;
  content: "";
}

.article-toc a.is-nested {
  padding-left: 10px;
  font-size: 11px;
}

.article-toc a:hover,
.article-toc a.is-active {
  color: var(--color-gold);
}

.article-toc a.is-active::before {
  background: var(--color-gold);
}

.sidebar-empty {
  color: var(--color-subtle);
  font-size: 12px;
}

.article-state {
  width: min(1515px, calc(100% - var(--page-gutter) * 2));
  margin: 60px auto;
  color: var(--color-muted);
  font-size: 13px;
  line-height: 1.8;
}

.article-not-found h1 {
  margin: 18px 0 10px;
  color: var(--color-text);
  font-size: 28px;
}

.article-not-found .text-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 24px;
  color: var(--color-gold);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 1.2px;
  text-decoration: none;
}

.article-state button {
  margin-top: 16px;
  padding: 10px 18px;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-champagne);
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 1.2px;
  cursor: pointer;
}

.article-state button:hover {
  border-color: var(--color-gold);
  color: var(--color-gold);
}

@media (max-width: 900px) {
  .article-layout {
    grid-template-columns: minmax(160px, .75fr) minmax(0, 2fr);
    gap: 28px;
  }

  .article-sidebar {
    grid-column: 2;
    padding-top: 26px;
    border-top: 1px solid var(--color-border);
  }
}

@media (max-width: 650px) {
  .article-page {
    padding-top: 90px;
  }

  .article-layout {
    display: flex;
    flex-direction: column;
    gap: 34px;
  }

  .article-main {
    order: 0;
    width: 100%;
  }

  .article-toc {
    width: 100%;
  }

  .article-toc-desktop {
    display: none;
  }

  .article-toc-mobile {
    display: block;
    position: static;
    order: 1;
    width: 100%;
    margin: 22px 0 0;
    padding: 0;
    border: 1px solid rgba(245, 242, 235, .16);
    background: #1b1b1b;
  }

  .article-toc-toggle {
    display: flex;
    width: 100%;
    min-height: 48px;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 0 14px;
    border: 0;
    background: transparent;
    color: var(--color-gold);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    text-align: left;
    text-transform: uppercase;
    cursor: pointer;
  }

  .article-toc-toggle:focus-visible {
    outline: 2px solid var(--color-gold);
    outline-offset: -3px;
  }

  .article-toc-chevron {
    font-size: 12px;
    line-height: 1;
    transition: transform .2s ease;
  }

  .article-toc-chevron.is-collapsed {
    transform: rotate(-90deg);
  }

  .article-toc-content {
    padding: 0 14px 12px;
  }

  .article-toc-mobile nav {
    gap: 0;
  }

  .article-toc-mobile nav a {
    display: flex;
    min-height: 44px;
    align-items: center;
    padding-top: 6px;
    padding-bottom: 6px;
    border-top: 1px solid rgba(245, 242, 235, .1);
  }

  .article-toc-mobile nav a::before {
    left: -14px;
  }

  .article-sidebar {
    order: 2;
    width: 100%;
    padding-top: 26px;
    border-top: 1px solid var(--color-border);
  }

  .article-header h1 {
    font-size: var(--type-article-title);
  }

  .article-cover {
    aspect-ratio: 1.35;
  }
}
</style>
