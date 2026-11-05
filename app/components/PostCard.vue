<template>
  <NuxtLink :to="`/tin-tuc/${post.slug || post.id}`" class="card">
    <div class="card-media">
      <img :src="getImageUrl(post.image)" :alt="post.name" loading="lazy" width="600" height="400" @error="onImgError" />
      <span class="card-badge" v-if="post.categoryName">{{ post.categoryName }}</span>
    </div>
    <div class="card-body">
      <h3 class="card-title">{{ post.name }}</h3>
      <p class="card-desc">{{ truncateText(post.description, 100) }}</p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { PostItem } from '~/services/blogService'
import { getImageUrl, truncateText } from '~/utils/formatters'

defineProps<{
  post: PostItem
}>()

function onImgError(e: Event) {
  const target = e.target as HTMLImageElement
  if (target && !target.dataset.fallbackApplied) {
    target.dataset.fallbackApplied = 'true'
    target.src = '/images/pg.webp'
  }
}
</script>

<style scoped>
.card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.1);
}

.card-media {
  position: relative;
  height: 200px;
  background-color: #e2e8f0;
}

.card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(15, 23, 42, 0.8);
  color: #ffffff;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(4px);
}

.card-body {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
}

.card-desc {
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
  margin-top: auto;
}
</style>
