<template>
  <aside class="article-sidebar">
    <section v-if="posts.length" class="related-articles">
      <p class="sidebar-heading">{{ t('article_detail.related_title') }}</p>
      <article v-for="related in posts" :key="related.id">
        <NuxtLink :to="`/tin-tuc/${related.slug}`">
          <img
            v-if="related.image"
            :src="normalizeImageUrl(related.image)"
            :alt="related.title"
            loading="lazy"
            @error="onImgError"
          >
          <span class="related-copy">
            <time v-if="related.date" :datetime="related.date">{{ formatDate(related.date) }}</time>
            <span class="related-title">{{ related.title }}</span>
          </span>
        </NuxtLink>
      </article>
    </section>
    <section v-if="categories.length" class="article-categories">
      <p class="sidebar-heading">{{ t('article_detail.categories_title') }}</p>
      <NuxtLink
        v-for="category in categories"
        :key="category.id ?? category.slug"
        :to="category.id
          ? { path: '/tin-tuc', query: { category_id: String(category.id) } }
          : '/tin-tuc'"
      >
        {{ category.name }}
      </NuxtLink>
    </section>
    <NuxtLink class="back-to-blog" to="/tin-tuc">{{ t('article_detail.all_articles') }}</NuxtLink>
  </aside>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'
import { formatDate } from '~/utils/formatters'
import { normalizeImageUrl } from '~/utils/imageHelper'
import { getDefaultPostImage } from '~/composables/useBlog'

export interface RelatedArticle {
  id: number | string
  slug: string
  title: string
  image: string
  date: string
}

defineProps<{
  posts: RelatedArticle[]
  categories: Array<{ id?: number | string; name: string; slug: string }>
}>()

const { t } = useI18n()

function onImgError(e: Event) {
  const target = e.target as HTMLImageElement
  if (target && !target.dataset.fallbackApplied) {
    target.dataset.fallbackApplied = 'true'
    target.src = getDefaultPostImage()
  }
}
</script>

<style scoped>
.article-sidebar {
  display: flex;
  flex-direction: column;
  gap: 34px;
}

.sidebar-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--color-gold);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1.1px;
  text-transform: uppercase;
}

.related-articles,
.article-categories {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.related-articles article {
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.related-articles a {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  color: var(--color-text);
  text-decoration: none;
  transition: color 0.25s ease;
}

.related-articles img {
  width: 82px;
  aspect-ratio: 1.2;
  flex: 0 0 82px;
  object-fit: cover;
}

.related-copy {
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 0;
}

.related-copy time {
  color: var(--color-subtle);
  font-size: 10px;
}

.related-title {
  font-size: 12px;
  line-height: 1.55;
}

.related-articles a:hover {
  color: var(--color-gold);
}

.article-categories a {
  color: var(--color-muted);
  font-size: 12px;
  line-height: 1.5;
  text-decoration: none;
  transition: color 0.2s ease;
}

.article-categories a:hover {
  color: var(--color-gold);
}

.back-to-blog {
  color: var(--color-champagne);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 1.2px;
  text-decoration: none;
  transition: color 0.25s ease, transform 0.25s ease;
}

.back-to-blog:hover {
  color: var(--color-gold);
  transform: translateX(-3px);
}

</style>
