<template>
  <article class="article-card">
    <NuxtLink
      class="article-image"
      :to="postHref"
      :aria-label="t('blog_page.read_article_aria', { title: post.title })"
    >
      <img
        v-if="post.image"
        :src="normalizeImageUrl(post.image)"
        :alt="post.title"
        loading="lazy"
        width="900"
        height="620"
        @error="onImgError"
      >
    </NuxtLink>
    <div class="article-card-copy">
      <p v-if="post.date" class="article-meta">
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <rect x="3" y="5" width="14" height="12" rx="1.5" />
          <path d="M6.5 3v4M13.5 3v4M3 8.5h14M6.5 11.5h.01M10 11.5h.01M13.5 11.5h.01" />
        </svg>
        <time :datetime="post.date">{{ formatDate(post.date) }}</time>
      </p>
      <h3>
        <NuxtLink :to="postHref">{{ post.title }}</NuxtLink>
      </h3>
      <NuxtLink class="text-link" :to="postHref">
        {{ t('blog_page.read_link') }} <span aria-hidden="true">›</span>
      </NuxtLink>
    </div>
  </article>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'
import { formatDate } from '~/utils/formatters'
import { normalizeImageUrl } from '~/utils/imageHelper'
import { getDefaultPostImage } from '~/composables/useBlog'
import type { ArticleSummary } from './BlogFeaturedCard.vue'
import { computed } from 'vue'

const props = defineProps<{
  post: ArticleSummary
}>()

const { t } = useI18n()
const postHref = computed(() => props.post.slug ? `/tin-tuc/${props.post.slug}` : '/tin-tuc')

function onImgError(e: Event) {
  const target = e.target as HTMLImageElement
  if (target && !target.dataset.fallbackApplied) {
    target.dataset.fallbackApplied = 'true'
    target.src = getDefaultPostImage(props.post.id || props.post.slug)
  }
}
</script>

<style scoped>
.article-card {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.article-image {
  position: relative;
  display: block;
  overflow: hidden;
  background: #222;
  aspect-ratio: 1.48;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.article-image:hover img {
  transform: scale(1.025);
}

.article-card-copy {
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.article-card h3 {
  margin-top: 7px;
  font-family: var(--font-heading);
  font-size: var(--type-h3);
  font-weight: 600;
  line-height: 1.55;
}

.article-card h3 a {
  display: -webkit-box;
  overflow: hidden;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: var(--color-text);
  text-decoration: none;
  transition: color 0.25s ease;
}

.article-card h3 a:hover {
  color: var(--color-gold);
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 0;
  color: #b7bbc0;
  font-size: 11px;
  line-height: 1.4;
}

.article-meta svg {
  width: 17px;
  height: 17px;
  flex: 0 0 17px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.2;
}

.article-card .text-link {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: 7px;
  margin-top: 17px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(245, 242, 235, .75);
  color: #f5f2eb;
  font-family: var(--font-serif);
  font-size: 14px;
  font-weight: 400;
  text-decoration: none;
  transition: gap 0.25s ease, color 0.25s ease, border-color 0.25s ease;
}

.article-card .text-link:hover {
  gap: 10px;
  border-color: var(--color-gold);
  color: var(--color-champagne);
}

@media (max-width: 600px) {
  .article-card {
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
  }
  .article-image {
    aspect-ratio: 1.5;
    flex: 12;
    height: fit-content;
  }
  .article-image > img {
    width: 120px;
    height: 60px;
  }
  .article-card .article-card-copy {
    padding-left: 12px;
    padding-top: 0;
    flex-grow: 1;
    width: 70%;
  }
  .article-card .article-card-copy h3 a {
    font-size: var(--type-h3);
  }
  .article-card .text-link {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .article-image img {
    transition: none;
  }
}
</style>
