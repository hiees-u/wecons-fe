<template>
  <div class="article-body">
    <p v-if="lead" class="article-lead">{{ lead }}</p>
    <template v-for="(block, index) in blocks" :key="`${block.kind}-${index}`">
      <component
        :is="block.level && block.level > 3 ? 'h4' : block.level && block.level > 2 ? 'h3' : 'h2'"
        v-if="block.kind === 'heading'"
        :id="headingIds[index]"
      >
        {{ block.text }}
      </component>
      <blockquote v-else-if="block.kind === 'quote'">{{ block.text }}</blockquote>
      <div v-else-if="block.kind === 'video'" class="article-video">
        <iframe
          :src="block.text"
          :title="t('article_detail.video_title')"
          loading="lazy"
          referrerpolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        />
      </div>
      <figure v-else-if="block.kind === 'image'" class="article-inline-image">
        <img :src="normalizeImageUrl(block.text)" :alt="block.alt || ''" loading="lazy" @error="onImgError">
        <figcaption v-if="block.caption">{{ block.caption }}</figcaption>
      </figure>
      <ul v-else-if="block.kind === 'list-item'">
        <li><template v-for="(segment, segmentIndex) in block.segments || [{ text: block.text }]" :key="segmentIndex"><a v-if="segment.href" :href="segment.href">{{ segment.text }}</a><template v-else>{{ segment.text }}</template></template></li>
      </ul>
      <p v-else>
        <template v-for="(segment, segmentIndex) in block.segments || [{ text: block.text }]" :key="segmentIndex"><a v-if="segment.href" :href="segment.href">{{ segment.text }}</a><template v-else>{{ segment.text }}</template></template>
      </p>
    </template>
    <NuxtLink class="text-link article-consult-cta" to="/lien-he#consultation-form">
      {{ t('article_detail.consult_cta') }} <span aria-hidden="true">↗</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'
import type { ArticleBlock } from '~/utils/articleContent'
import { normalizeImageUrl } from '~/utils/imageHelper'

defineProps<{
  lead?: string
  blocks: ArticleBlock[]
  headingIds: string[]
}>()

const { t } = useI18n()

function onImgError(e: Event) {
  const target = e.target as HTMLImageElement
  if (target && !target.dataset.fallbackApplied) {
    target.dataset.fallbackApplied = 'true'
    target.src = '/images/pg.webp'
  }
}
</script>

<style scoped>
.article-body {
  display: flex;
  flex-direction: column;
  gap: 22px;
  color: var(--color-muted);
  font-size: var(--type-article-body);
  font-weight: 400;
  line-height: 1.8;
}

.article-lead {
  color: var(--color-text);
  font-size: var(--type-article-body);
  font-weight: 400;
  line-height: 1.8;
  padding-bottom: 8px;
}

.article-body h2,
.article-body h3,
.article-body h4 {
  margin-top: 18px;
  color: var(--color-text);
  font-size: var(--type-h2);
  font-weight: 600;
  line-height: 1.35;
}

.article-body h3 {
  font-size: var(--type-h3);
  font-weight: 600;
}

.article-body h4 {
  font-size: var(--type-h4);
  font-weight: 600;
}

.article-body a {
  color: var(--color-champagne);
  text-decoration: underline;
  text-decoration-color: var(--color-border);
  text-underline-offset: 3px;
}

.article-body ul {
  margin-left: 1.25em;
  padding-left: 0.5em;
}

.article-body li {
  padding-left: 0.25em;
}

.article-body blockquote {
  margin: 10px 0;
  padding: 18px 24px;
  border-left: 2px solid var(--color-gold);
  background: var(--color-surface);
  color: var(--color-champagne);
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 15px;
  line-height: 1.8;
}

.article-body p {
  margin: 0;
}

.article-video {
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--color-surface);
}

.article-video iframe {
  width: 100%;
  height: 100%;
  border: 0;
}

.article-inline-image {
  width: 100%;
  margin: 0;
}

.article-inline-image figcaption {
  margin-top: 8px;
  color: var(--color-subtle);
  font-size: var(--type-caption);
  font-weight: 400;
}

.article-inline-image img {
  display: block;
  width: 100%;
  height: auto;
}

.article-consult-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 25px;
  padding: 14px 22px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-champagne);
  font-size: var(--type-cta);
  font-weight: 600;
  letter-spacing: 1.2px;
  text-decoration: none;
  width: fit-content;
  transition: border-color 0.25s ease, background-color 0.25s ease, color 0.25s ease;
}

.article-consult-cta:hover {
  border-color: var(--color-gold);
  background: #141414;
  color: var(--color-gold);
}
</style>
