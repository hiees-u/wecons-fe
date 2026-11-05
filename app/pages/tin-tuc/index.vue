<template>
  <main class="blog-page">
    <EditorialPageHero
      class="blog-hero"
      title-id="blog-title"
      :eyebrow="t('blog_page.hero_eyebrow')"
      :title="t('blog_page.banner_title')"
      :description="t('blog_page.hero_desc')"
      :image="cmsPage?.image || settings?.news_banner || '/images/pg.webp'"
      :image-mobile="cmsPage?.image || settings?.default_page_banner_mobile || '/images/pg-mobile.webp'"
      :image-alt="t('blog_page.hero_image_alt')"
      :compact="true"
      :breadcrumb-label="t('blog_page.banner_title')"
    />

    <div class="blog-content">
      <!-- <section class="blog-section categories-section" aria-labelledby="categories-heading">
        <div class="categories-heading">
          <h2 id="categories-heading">{{ t('article_detail.categories_title') }}</h2>
          <button
            class="categories-toggle"
            type="button"
            :aria-expanded="isCategoriesVisible"
            aria-controls="blog-categories-content"
            @click="isCategoriesVisible = !isCategoriesVisible"
          >
            {{ t(isCategoriesVisible ? 'blog_page.categories_hide' : 'blog_page.categories_show') }}
            <i class="fa-solid" :class="isCategoriesVisible ? 'fa-angle-up' : 'fa-angle-down'" aria-hidden="true"></i>
          </button>
        </div>
        <div v-show="isCategoriesVisible" id="blog-categories-content">
          <p v-if="categoriesError" class="categories-state" role="alert">
            {{ t('blog_page.categories_error') }}
          </p>
          <p v-else-if="!rootCategories.length" class="categories-state">
            {{ t('blog_page.categories_empty') }}
          </p>
          <div v-else class="categories-grid">
            <NuxtLink
              v-for="category in rootCategories"
              :key="category.id"
              class="category-box"
              :to="{ path: '/tin-tuc', query: { category_id: String(category.id) } }"
            >
              <span class="category-box-title">{{ category.name }}</span>
              <span v-if="category.description" class="category-box-description">{{ category.description }}</span>
              <span class="category-box-count">{{ category.postsCount }} {{ t('blog_page.category_articles_count') }}</span>
            </NuxtLink>
          </div>
        </div>
      </section> -->

      <BlogLoadingState v-if="loading" :label="t('blog_page.loading')" />
      <div v-else-if="errorMessage" class="blog-state" role="alert">
        <p>{{ errorMessage }}</p>
        <button type="button" @click="loadPosts()">
          {{ t('blog_page.retry') }} <span aria-hidden="true">↻</span>
        </button>
      </div>
      <template v-else>
        <section v-if="featuredPosts.length && !selectedCategory" class="blog-section featured-section" aria-labelledby="featured-heading">
          <h2 id="featured-heading">{{ t('blog_page.featured_title') }}</h2>
          <div class="article-grid featured-grid">
            <BlogCard
              v-for="post in featuredPosts"
              :key="post.id"
              :post="post"
            />
          </div>
        </section>

        <section class="blog-section all-articles-section" aria-labelledby="all-articles-heading">
          <h2 id="all-articles-heading">{{ t('blog_page.all_articles') }}</h2>
          <div class="article-toolbar">
            <div class="category-tabs" role="group" :aria-label="t('blog_page.filter_categories')">
              <button
                type="button"
                :class="{ 'is-active': selectedCategory === '' }"
                :aria-pressed="selectedCategory === ''"
                @click="selectCategory('')"
              >
                {{ t('blog_page.all_categories') }}
              </button>
              <button
                v-for="category in categories"
                :key="category.id"
                type="button"
                :class="{ 'is-active': selectedCategory === String(category.id) }"
                :aria-pressed="selectedCategory === String(category.id)"
                @click="selectCategory(category.id)"
              >
                {{ category.name }}
              </button>
            </div>
            <form class="article-search" role="search" @submit.prevent="loadPosts()">
              <label class="visually-hidden" for="article-search">{{ t('blog_page.search_label') }}</label>
              <input
                id="article-search"
                v-model="searchInput"
                type="search"
                :placeholder="t('blog_page.search_placeholder')"
              >
              <button type="submit" :aria-label="t('blog_page.search_label')">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="10.8" cy="10.8" r="6.3" />
                  <path d="m15.5 15.5 4.2 4.2" />
                </svg>
              </button>
            </form>
          </div>

          <div v-if="visiblePosts.length" class="article-grid all-articles-grid">
            <BlogCard
              v-for="post in visiblePosts"
              :key="post.id"
              :post="post"
            />
          </div>
          <p v-else class="no-results">{{ t('blog_page.no_results') }}</p>

          <AppPagination
            :current-page="page"
            :page-count="pageCount"
            :loading="loading"
            :aria-label="t('blog_page.pagination_label')"
            @change="loadPosts"
          />
        </section>

        <section v-if="seoCardPosts.length" class="blog-section seo-topics-section" aria-labelledby="seo-topics-heading">
          <h2 id="seo-topics-heading">Cẩm Nang &amp; Báo Giá Xây Dựng Tiêu Biểu</h2>
          <div class="article-grid seo-topics-grid">
            <BlogCard
              v-for="post in seoCardPosts"
              :key="post.id"
              :post="post"
            />
          </div>
        </section>
      </template>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EditorialPageHero from '~/components/EditorialPageHero.vue'
import BlogCard from '~/components/blog/BlogCard.vue'
import BlogLoadingState from '~/components/blog/BlogLoadingState.vue'
import AppPagination from '~/components/common/AppPagination.vue'
import type { ArticleSummary } from '~/components/blog/BlogFeaturedCard.vue'
import { useBlog, getDefaultPostImage } from '~/composables/useBlog'
import { usePostCategories } from '~/composables/usePostCategories'
import { useNavigation } from '~/composables/useNavigation'
import { useI18n } from '~/composables/useI18n'
import { useSiteSettings } from '~/composables/useSiteSettings'
import { getImageUrl, truncateText } from '~/utils/formatters'
import seoArticlesData from '~/data/seoArticles.json'

definePageMeta({ alias: ['/blog'] })

interface ArticleCategory {
  id: number | string
  name: string
}

const POSTS_PER_PAGE = 16
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { getPosts } = useBlog()
const { categories: rootCategories, error: categoriesError } = await usePostCategories()
const { siteUrl } = useNavigation()
const { settings } = useSiteSettings()

const isCategoriesVisible = ref(true)
const posts = ref<ArticleSummary[]>([])

const featuredPosts = ref<ArticleSummary[]>([])
const categories = computed<ArticleCategory[]>(() => rootCategories.value.map(category => ({
  id: category.id,
  name: category.name,
})))
const loading = ref(true)
const errorMessage = ref('')
const page = ref(1)
const pageCount = ref(1)
const selectedCategory = ref(typeof route.query.category_id === 'string' ? route.query.category_id : '')
const searchInput = ref('')
const searchQuery = ref('')

watch(categoriesError, (error) => {
  if (error) console.error('[Blog listing] Failed to load categories:', error)
}, { immediate: true })

function normalizePost(item: any): ArticleSummary {
  const imageValue = item.image || item.thumbnail || item.feature_image
  const seed = item.id || item.slugable?.key || item.slug || item.name || ''
  let resolvedImage = ''
  if (typeof imageValue === 'string' && imageValue.trim()) {
    resolvedImage = getImageUrl(imageValue.trim(), '')
  } else if (typeof imageValue === 'object' && imageValue !== null) {
    resolvedImage = getImageUrl(imageValue.url || imageValue.thumb || '', '')
  }

  const category = item.categories?.[0]
  const categoryName = category?.name || ''

  return {
    id: item.id,
    slug: item.slugable?.key || item.slug || String(item.id),
    title: item.name || item.title || t('article_detail.breadcrumb_fallback'),
    excerpt: truncateText(item.description || item.excerpt || '', 180),
    image: resolvedImage || getDefaultPostImage(seed),
    category: categoryName,
    date: item.created_at || item.published_at || '',
  }
}

const visiblePosts = computed(() => {
  const query = searchQuery.value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

  return posts.value.filter((post) => {
    const searchableText = `${post.title} ${post.excerpt}`
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
    return !query || searchableText.includes(query)
  })
})

async function loadPosts(targetPage = 1): Promise<void> {
  loading.value = true
  errorMessage.value = ''
  searchQuery.value = searchInput.value.trim()

  const params: Record<string, string | number> = {
    per_page: POSTS_PER_PAGE,
    page: targetPage,
  }
  if (selectedCategory.value) params.category_id = selectedCategory.value
  if (searchQuery.value) params.keyword = searchQuery.value

  try {
    const response = await getPosts(params)
    if (!response.success || !Array.isArray(response.data)) {
      errorMessage.value = response.message || t('blog_page.empty_desc')
      return
    }

    const result = response.data
      .map(normalizePost)
      .filter((post: ArticleSummary) => post.id && post.title)
    posts.value = result
    if (!featuredPosts.value.length && !selectedCategory.value && !searchQuery.value && targetPage === 1) {
      featuredPosts.value = result.slice(0, 4)
    }
    page.value = targetPage

    const lastPage = Number(response.meta?.last_page)
    const total = Number(response.meta?.total)
    pageCount.value = lastPage > 0
      ? lastPage
      : total > 0
        ? Math.ceil(total / POSTS_PER_PAGE)
        : response.meta?.has_more
          ? targetPage + 1
          : targetPage
  } catch (error) {
    console.error('[Blog listing] Failed to load posts:', error)
    errorMessage.value = t('blog_page.empty_desc')
  } finally {
    loading.value = false
  }
}

function selectCategory(categoryId: number | string): void {
  const selectedId = String(categoryId)
  if (selectedId === selectedCategory.value && route.path === '/tin-tuc') {
    void loadPosts(1)
    return
  }

  const query = { ...route.query }
  delete query.category
  if (selectedId) query.category_id = selectedId
  else delete query.category_id

  void router.push({ path: '/tin-tuc', query })
}

const seoCardPosts = computed<ArticleSummary[]>(() => {
  return (seoArticlesData || []).map((art: any) => ({
    id: art.source_code,
    slug: art.clean_slug,
    title: art.meta_title.split('|')[0].replace(/- WE Construction/i, '').trim(),
    excerpt: art.meta_description,
    image: getDefaultPostImage(art.source_code),
    date: '2026-03-01',
    author: 'WE Construction',
    category: art.market || 'TP.HCM',
  }))
})

const pageTitle = computed(() => t('blog_page.meta_title'))
const pageDescription = computed(() => t('blog_page.meta_desc'))

const canonicalUrl = computed(() => `${siteUrl.replace(/\/$/, '')}/tin-tuc`)

const blogListSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: pageTitle.value,
  description: pageDescription.value,
  url: canonicalUrl.value,
  publisher: {
    '@id': 'https://wecons.vn/#organization',
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
      item: canonicalUrl.value,
    },
  ],
}))

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  robots: 'index,follow',
  ogType: 'website',
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogUrl: canonicalUrl,
  ogImage: `${siteUrl.replace(/\/$/, '')}/images/logo.png`,
  twitterCard: 'summary_large_image',
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
  twitterImage: `${siteUrl.replace(/\/$/, '')}/images/logo.png`,
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
  script: [
    {
      type: 'application/ld+json',
      textContent: () => JSON.stringify(blogListSchema.value),
    },
    {
      type: 'application/ld+json',
      textContent: () => JSON.stringify(breadcrumbSchema.value),
    },
  ],
})

onMounted(() => {
  void loadPosts()
})

watch(() => route.query.category_id, (categoryId) => {
  selectedCategory.value = typeof categoryId === 'string' ? categoryId : ''
  void loadPosts()
})

const cmsPage = await useCmsPageMeta('articles', {
  title: pageTitle,
  description: pageDescription,
})
</script>

<style scoped>
.blog-page {
  --blog-surface: #2b2b2b;
  --page-gutter: clamp(22px, 5.4vw, 78px);
  overflow: clip;
  background: var(--blog-surface);
  color: var(--color-text);
}

.blog-page :deep(.editorial-hero--compact) {
  min-height: clamp(560px, 42vw, 720px);
}

.blog-page :deep(.editorial-hero--compact .editorial-hero-shade) {
  background: linear-gradient(0deg, rgba(7, 7, 8, .64), rgba(7, 7, 8, .44));
}

.blog-page :deep(.editorial-hero--compact .editorial-hero-copy) {
  width: min(1720px, 100%);
  padding-right: var(--page-gutter);
  padding-left: var(--page-gutter);
}

.blog-page :deep(.editorial-hero--compact h1) {
  font-size: clamp(62px, 7vw, 96px);
}

.blog-content {
  width: min(1515px, calc(100% - var(--page-gutter) * 2));
  margin: 0 auto;
  padding: 82px 0 110px;
}

.categories-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.categories-section h2 {
  margin-bottom: 24px;
}

.categories-toggle {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  gap: 9px;
  margin-bottom: 24px;
  padding: 8px 0 8px 12px;
  border: 0;
  background: transparent;
  color: var(--color-champagne);
  font-size: 13px;
  cursor: pointer;
}

.categories-toggle:focus-visible {
  outline: 2px solid var(--color-champagne);
  outline-offset: 3px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.category-box {
  display: flex;
  min-height: 150px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 22px;
  border: 1px solid rgba(223, 223, 223, .24);
  background: rgba(255, 255, 255, .025);
  color: var(--color-text);
  text-decoration: none;
  transition: border-color .2s ease, background-color .2s ease;
}

.category-box:hover,
.category-box:focus-visible {
  border-color: var(--color-gold);
  background: rgba(214, 179, 106, .07);
}

.category-box-title {
  font-family: var(--font-serif);
  font-size: clamp(20px, 2vw, 26px);
  line-height: 1.25;
}

.category-box-description {
  display: -webkit-box;
  overflow: hidden;
  color: var(--color-muted);
  font-size: 13px;
  line-height: 1.6;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.category-box-count {
  color: var(--color-champagne);
  font-size: 11px;
}

.categories-state {
  padding: 20px;
  border: 1px solid rgba(223, 223, 223, .24);
  color: var(--color-muted);
}

.blog-section + .blog-section {
  margin-top: 70px;
  padding-top: 53px;
  border-top: 1px solid rgba(223, 223, 223, .34);
}

.blog-section h2 {
  margin-bottom: 24px;
  color: #f5f2eb;
  font-family: var(--font-serif);
  font-size: clamp(36px, 4vw, 58px);
  font-weight: 400;
  letter-spacing: -1.5px;
  line-height: 1.12;
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  column-gap: 22px;
  row-gap: 42px;
}

.article-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin: 7px 0 23px;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 7px 21px;
}

.category-tabs button {
  position: relative;
  padding: 4px 0 8px;
  border: 0;
  background: transparent;
  color: rgba(245, 242, 235, .65);
  font-size: 16px;
  line-height: 1.4;
  cursor: pointer;
  transition: color .2s ease;
}

.category-tabs button::after {
  position: absolute;
  right: 100%;
  bottom: 1px;
  left: 0;
  height: 1px;
  background: var(--color-gold);
  content: "";
  transition: right .2s ease;
}

.category-tabs button:hover,
.category-tabs button.is-active {
  color: var(--color-champagne);
}

.category-tabs button:hover::after,
.category-tabs button.is-active::after {
  right: 0;
}

.article-search {
  display: flex;
  width: min(245px, 100%);
  flex: 0 0 245px;
  align-items: center;
  border-bottom: 1px solid rgba(245, 242, 235, .35);
}

.article-search input {
  width: 100%;
  min-width: 0;
  padding: 5px 0 8px 10px;
  border: 0;
  outline: 0;
  background: transparent;
  color: #f5f2eb;
  font-size: 18px;
}

.article-search input::placeholder {
  color: rgba(245, 242, 235, .62);
}

.article-search input::-webkit-search-cancel-button {
  cursor: pointer;
}

.article-search button {
  display: grid;
  width: 25px;
  height: 28px;
  flex: 0 0 25px;
  place-items: center;
  border: 0;
  background: transparent;
  color: rgba(245, 242, 235, .7);
  cursor: pointer;
}

.article-search svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-width: 1.3;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 48px;
}

.pagination button {
  display: grid;
  min-width: 24px;
  height: 30px;
  place-items: center;
  border: 0;
  border-bottom: 1px solid transparent;
  background: transparent;
  color: rgba(245, 242, 235, .7);
  font-size: 10px;
  cursor: pointer;
  transition: color .2s ease, border-color .2s ease;
}

.pagination button:hover:not(:disabled),
.pagination button.is-active {
  border-bottom-color: var(--color-gold);
  color: var(--color-gold);
}

.pagination button:disabled {
  opacity: .35;
  cursor: not-allowed;
}

.pagination-arrow {
  font-size: 20px !important;
  line-height: 1;
}

.pagination-ellipsis {
  color: rgba(245, 242, 235, .65);
  font-size: 10px;
}

.no-results {
  padding: 30px 0;
  color: var(--color-muted);
  font-size: 12px;
}

.blog-state {
  padding: 42px 0;
  border-top: 1px solid rgba(223, 223, 223, .34);
  color: var(--color-muted);
  font-size: 13px;
  line-height: 1.8;
}

.blog-state h2 {
  color: var(--color-text);
  font-family: var(--font-serif);
  font-size: 28px;
}

.blog-state button {
  margin-top: 15px;
  padding: 9px 0;
  border: 0;
  background: transparent;
  color: var(--color-champagne);
  font-size: 9px;
  letter-spacing: 1px;
  cursor: pointer;
}

.blog-state button:focus-visible,
.category-tabs button:focus-visible,
.article-search button:focus-visible,
.pagination button:focus-visible {
  outline: 2px solid var(--color-champagne);
  outline-offset: 3px;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  clip-path: inset(50%);
}

@media (max-width: 900px) {
  .categories-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .article-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 34px 20px;
  }

  .article-toolbar {
    flex-direction: column;
    gap: 15px;
  }

  .article-search {
    width: min(360px, 100%);
    flex-basis: auto;
  }
}

@media (max-width: 600px) {
  .blog-page :deep(.editorial-hero--compact) {
    min-height: clamp(380px, 62svh, 520px);
  }

  .blog-page :deep(.editorial-hero--compact h1) {
    font-size: clamp(48px, 13vw, 66px);
  }

  .blog-content {
    padding: 55px 0 72px;
  }

  .categories-grid {
    grid-template-columns: 1fr;
  }

  .category-box {
    min-height: 130px;
    padding: 18px;
  }

  .blog-section + .blog-section {
    margin-top: 48px;
    padding-top: 36px;
  }

  .blog-section h2 {
    margin-bottom: 18px;
    font-size: 38px;
  }

  .categories-toggle {
    margin-bottom: 18px;
    font-size: 12px;
  }

  .article-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .category-tabs {
    gap: 7px 16px;
  }

  .category-tabs button {
    font-size: 10px;
  }

  .pagination {
    gap: 6px;
    margin-top: 36px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .category-tabs button,
  .category-tabs button::after,
  .pagination button,
  .article-search button {
    transition: none;
  }
}
</style>
