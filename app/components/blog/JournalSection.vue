<template>
  <section :id="sectionId" :class="['journal-section', sectionClass]" :aria-labelledby="headingId">
    <div :class="contentClass">
      <SectionHeading
        :eyebrow="eyebrow"
        :title="title"
        :heading-id="headingId"
        link-href="/tin-tuc"
        :link-text="linkText"
        :link-text-mobile="linkTextMobile"
      />

      <nav class="journal-category-nav" :aria-label="t('blog_page.filter_categories')">
        <NuxtLink to="/tin-tuc">
          {{ t('blog_page.all_articles') }}
        </NuxtLink>
        <NuxtLink
          v-for="category in categories.slice(0, 4)"
          :key="category.id"
          :to="{ path: '/tin-tuc', query: { category_id: String(category.id) } }"
        >
          {{ category.name }}
        </NuxtLink>
      </nav>

      <div v-if="articles.length" class="journal-grid">
        <article v-for="article in articles" :key="article.id" class="journal-card">
          <NuxtLink class="journal-image" :to="article.slug ? `/tin-tuc/${article.slug}` : '/tin-tuc'">
            <img
              :src="getOptimizedImageUrl(article.image, 600)"
              :srcset="getImageSrcset(article.image, [360, 600, 900])"
              sizes="(max-width: 768px) 100vw, 400px"
              :alt="article.title"
              loading="lazy"
              width="900"
              height="620"
              @error="onImageError"
            >
            <span aria-hidden="true">↗</span>
          </NuxtLink>
          <div class="journal-meta">
            <span v-if="article.date" class="journal-date">
              <svg class="journal-date-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {{ formatJournalDate(article.date) }}
            </span>
            <span class="journal-category">{{ article.category }}</span>
          </div>
          <h3>
            <NuxtLink :to="article.slug ? `/tin-tuc/${article.slug}` : '/tin-tuc'">
              {{ article.title }}
            </NuxtLink>
          </h3>
          <p v-if="article.excerpt">{{ article.excerpt }}</p>
          <NuxtLink class="read-link" :to="article.slug ? `/tin-tuc/${article.slug}` : '/tin-tuc'">
            {{ t('home.journal.read_article') }} <span aria-hidden="true">›</span>
          </NuxtLink>
        </article>
      </div>
      <p v-else-if="emptyText" class="journal-empty">{{ emptyText }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import type { ArticleSummary } from '~/components/blog/BlogFeaturedCard.vue'
import SectionHeading from '~/components/common/SectionHeading.vue'
import { useI18n } from '~/composables/useI18n'
import { usePostCategories } from '~/composables/usePostCategories'
import { getImageSrcset, getOptimizedImageUrl } from '~/utils/imageHelper'

withDefaults(defineProps<{
  articles: ArticleSummary[]
  title: string
  headingId: string
  eyebrow?: string
  linkText?: string
  linkTextMobile?: string
  sectionId?: string
  sectionClass?: string
  contentClass?: string
  emptyText?: string
}>(), {
  sectionId: undefined,
  sectionClass: 'section',
  contentClass: undefined,
  emptyText: undefined,
})

const { t } = useI18n()
const { categories, error: categoriesError } = await usePostCategories()

watch(categoriesError, (error) => {
  if (error) console.error('[Journal section] Failed to load post categories:', error)
}, { immediate: true })

function formatJournalDate(value: string): string {
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return value
  const date = new Date(value)
  if (!value || Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date)
}

function onImageError(event: Event): void {
  const image = event.target as HTMLImageElement
  if (!image.dataset.fallbackApplied) {
    image.dataset.fallbackApplied = 'true'
    image.src = '/images/image-1.webp'
  }
}
</script>

<style scoped>
.journal-category-nav {
  display: flex;
  flex-wrap: wrap;
  max-width: 1515px;
  gap: 0;
  margin: -22px auto 24px;
}

.journal-category-nav a {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  margin: 0 14px 6px 0;
  padding-right: 14px;
  border-right: 1px solid rgba(245, 242, 235, 0.22);
  color: rgba(245, 242, 235, 0.72);
  font-size: 11px;
  line-height: 1.4;
  text-decoration: none;
  transition: color 0.2s ease;
}

.journal-category-nav a:last-child {
  margin-right: 0;
  padding-right: 0;
  border-right: 0;
}

.journal-category-nav a:hover,
.journal-category-nav a:focus-visible {
  color: var(--color-gold);
}

.journal-empty {
  max-width: 1515px;
  margin: 0 auto;
  color: var(--color-muted);
  font-size: 13px;
}

.journal-section :deep(.section-heading) {
  max-width: 1515px;
  margin-right: auto;
  margin-left: auto;
}

.journal-section :deep(.journal-grid) {
  max-width: 1515px;
  margin-right: auto;
  margin-left: auto;
}

.journal-section > .section-shell {
  width: min(1515px, calc(100% - var(--page-gutter, 40px) * 2));
  margin: 0 auto;
}

@media (max-width: 600px) {
  .journal-section.knowledge-section {
    width: 100%;
  }

  .journal-section.services-articles-mobile .journal-category-nav {
    margin-top: 0;
  }

  .journal-category-nav {
    margin-top: -12px;
    overflow-x: auto;
    flex-wrap: nowrap;
    scrollbar-width: none;
  }

  .journal-category-nav::-webkit-scrollbar {
    display: none;
  }

  .journal-category-nav a {
    flex: 0 0 auto;
    white-space: nowrap;
  }
}
</style>
