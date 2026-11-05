<template>
  <article v-if="post" class="featured-article">
    <NuxtLink
      class="featured-image"
      :to="`/tin-tuc/${post.slug}`"
      :aria-label="t('blog_page.read_article_aria', { title: post.title })"
    >
      <img
        v-if="post.image"
        :src="normalizeImageUrl(post.image)"
        :alt="post.title"
        fetchpriority="high"
        width="1200"
        height="850"
        @error="onImgError"
      >
      <span aria-hidden="true">{{ t('blog_page.read_article') }} ↗</span>
    </NuxtLink>
    <div class="featured-copy">
      <p class="article-meta">
        <span>{{ post.category || t('blog_page.default_category') }}</span>
        <time v-if="post.date" :datetime="post.date">{{ formatDate(post.date) }}</time>
      </p>
      <h2>
        <NuxtLink :to="`/tin-tuc/${post.slug}`">{{ post.title }}</NuxtLink>
      </h2>
      <p>{{ post.excerpt }}</p>
      <NuxtLink class="text-link" :to="`/tin-tuc/${post.slug}`">
        {{ t('blog_page.read_more') }} <span aria-hidden="true">↗</span>
      </NuxtLink>
    </div>
  </article>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'
import { formatDate } from '~/utils/formatters'
import { normalizeImageUrl } from '~/utils/imageHelper'
import { getDefaultPostImage } from '~/composables/useBlog'

function onImgError(e: Event) {
  const target = e.target as HTMLImageElement
  if (target && !target.dataset.fallbackApplied) {
    target.dataset.fallbackApplied = 'true'
    target.src = getDefaultPostImage(props.post.id || props.post.slug)
  }
}

export interface ArticleSummary {
  id: number | string
  slug: string
  title: string
  excerpt: string
  image: string
  category: string
  categorySlug?: string
  date: string
}

defineProps<{
  post: ArticleSummary
}>()

const { t } = useI18n()
</script>

<style scoped>
.featured-article {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(300px, 0.85fr);
  gap: clamp(30px, 5vw, 70px);
  align-items: center;
  padding-bottom: 55px;
  border-bottom: 1px solid var(--color-border);
}

.featured-image {
  position: relative;
  display: block;
  overflow: hidden;
  background: var(--color-surface);
  aspect-ratio: 1.36;
}

.featured-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.featured-image:hover img {
  transform: scale(1.025);
}

.featured-image > span {
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 13px 17px;
  background: #090909;
  color: var(--color-champagne);
  font-size: 8px;
  letter-spacing: 1px;
}

.featured-copy h2 {
  margin-top: 17px;
  font-family: var(--font-heading);
  font-size: var(--type-h2);
  font-weight: 600;
  line-height: 1.28;
}

.featured-copy h2 a {
  color: var(--color-text);
  text-decoration: none;
  transition: color 0.25s ease;
}

.featured-copy h2 a:hover {
  color: var(--color-gold);
}

.featured-copy > p:not(.article-meta) {
  margin-top: 14px;
  color: var(--color-muted);
  font-size: 12px;
  line-height: 1.8;
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 18px;
  color: var(--color-gold);
  font-size: 7px;
  font-weight: 600;
  letter-spacing: 1.15px;
}

.article-meta time {
  color: var(--color-subtle);
}

.featured-copy .text-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 24px;
  color: var(--color-gold);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 1.2px;
  text-decoration: none;
  transition: gap 0.25s ease, color 0.25s ease;
}

.featured-copy .text-link:hover {
  gap: 9px;
  color: var(--color-champagne);
}

@media (max-width: 800px) {
  .featured-article {
    grid-template-columns: 1fr;
    gap: 25px;
  }

  .featured-copy {
    max-width: 650px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .featured-image img {
    transition: none;
  }
}
</style>
