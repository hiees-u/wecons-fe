<template>
  <main class="house-models-page">
    <EditorialPageHero
      title-id="models-title"
      compact
      :breadcrumb-home="t('house_models_page.breadcrumb_home')"
      :breadcrumb-label="t('house_models_page.breadcrumb_current')"
      :eyebrow="t('house_models_page.hero_eyebrow')"
      :title="t('house_models_page.hero_title')"
      :description="t('house_models_page.collection_desc')"
      :image="props.image"
      :image-mobile="props.imageMobile"
      :image-alt="t('house_models_page.hero_image_alt')"
    />

    <FeaturedProjectsSlider :projects="featuredProjects" />

    <section class="collection-section" aria-labelledby="collection-title">
      <div class="collection-heading">
        <p class="section-kicker">{{ t('house_models_page.collection_eyebrow') }}</p>
        <h2 id="collection-title">{{ t('house_models_page.collection_title') }}</h2>
        <p class="collection-description">{{ t('house_models_page.collection_desc') }}</p>
      </div>

      <div class="category-tabs" role="tablist" :aria-label="t('house_models_page.category_filter')">
        <button
          v-for="category in categories"
          :key="category.id"
          class="category-tab"
          :class="{ 'is-active': activeCategory === category.id }"
          type="button"
          role="tab"
          :aria-selected="activeCategory === category.id"
          @click="selectCategory(category.id)"
        >
          {{ category.label }}
        </button>
      </div>
      <p v-if="categoriesError" class="category-load-error" role="alert">
        {{ t('house_models_page.categories_error') }}
      </p>

      <div v-if="paginatedDesigns.length" class="models-grid" role="tabpanel">
        <ModelCard
          v-for="(model, index) in paginatedDesigns"
          :key="`${model.title}-${index}`"
          :model="model"
          :index="(currentPage - 1) * pageSize + index"
        />
      </div>
      <p v-else class="models-empty">{{ t('house_models_page.category_empty') }}</p>

      <nav v-if="pageCount > 1" class="pagination" :aria-label="t('house_models_page.pagination_label')">
        <button
          class="page-control"
          type="button"
          :disabled="currentPage === 1"
          :aria-label="t('house_models_page.previous_page')"
          @click="changePage(currentPage - 1)"
        >
          ‹
        </button>
        <button
          v-for="page in pageCount"
          :key="page"
          class="page-number"
          :class="{ 'is-active': page === currentPage }"
          type="button"
          :aria-current="page === currentPage ? 'page' : undefined"
          @click="changePage(page)"
        >
          {{ page }}
        </button>
        <span v-if="pageCount > 3" class="page-ellipsis" aria-hidden="true">…</span>
        <span v-if="pageCount > 3" class="page-total">{{ pageCount }}</span>
        <button
          class="page-control"
          type="button"
          :disabled="currentPage === pageCount"
          :aria-label="t('house_models_page.next_page')"
          @click="changePage(currentPage + 1)"
        >
          ›
        </button>
      </nav>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppBreadcrumb from '~/components/common/AppBreadcrumb.vue'
import ModelCard from '~/components/catalog/ModelCard.vue'
import EditorialPageHero from '~/components/EditorialPageHero.vue'
import FeaturedProjectsSlider from '~/components/project/FeaturedProjectsSlider.vue'
import homeData from '~/data/homeContent.json'
import type { HomeImageItem } from '~/types/content'
import { useI18n } from '~/composables/useI18n'
import { useHouseModelCategories } from '~/composables/useHouseModelCategories'

interface DesignItem extends HomeImageItem {
  categorySlug: string
}

const { t } = useI18n()
const route = useRoute()
const breadcrumbItems = computed(() => [
  { label: t('house_models_page.breadcrumb_home'), to: '/' },
  { label: t('house_models_page.breadcrumb_current') },
])
const featuredProjects = homeData.projects as HomeImageItem[]
const designs = homeData.designs as DesignItem[]
const activeCategory = ref('all')
const currentPage = ref(1)
const pageSize = 12

const props = withDefaults(defineProps<{
  image: string
  imageMobile?: string
}>(), {
  image: '/images/pg.webp',
  imageMobile: '/images/pg-mobile.webp',
})

const { categories, error: categoriesError } = await useHouseModelCategories()

watch(
  () => route.query.category,
  (categoryId) => {
    const category = categories.value.find(item => item.id === categoryId)
    activeCategory.value = category?.id || 'all'
    currentPage.value = 1
  },
  { immediate: true },
)

const filteredDesigns = computed(() =>
  activeCategory.value === 'all'
    ? designs
    : designs.filter((design) => {
        const category = categories.value.find(item => item.id === activeCategory.value)
        const normalizedCategoryName = category?.label
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
        const normalizedDesignCategory = design.category
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()

        return design.categorySlug === activeCategory.value
          || Boolean(normalizedCategoryName && normalizedDesignCategory.includes(normalizedCategoryName))
      }),
)
const pageCount = computed(() => Math.ceil(filteredDesigns.value.length / pageSize))
const paginatedDesigns = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredDesigns.value.slice(start, start + pageSize)
})

function selectCategory(categoryId: string): void {
  activeCategory.value = categoryId
  currentPage.value = 1
}

function changePage(page: number): void {
  if (page < 1 || page > pageCount.value) return
  currentPage.value = page
}
</script>

<style scoped>
.house-models-page {
  --page-gutter: clamp(20px, 5vw, 76px);
  overflow: clip;
  background: #111;
  color: var(--color-text);
}


.section-kicker {
  color: var(--color-gold);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 1.8px;
}

.collection-section {
  width: min(1515px, calc(100% - var(--page-gutter) * 2));
  margin: 0 auto;
  padding: clamp(58px, 7vw, 90px) 0 clamp(70px, 8vw, 100px);
}

.collection-heading { text-align: center; }
.collection-heading h2 {
  margin-top: 9px;
  color: var(--color-text);
  font-family: var(--font-serif);
  font-size: clamp(30px, 4vw, 46px);
  font-weight: 400;
  line-height: 1.2;
}

.collection-description {
  max-width: 650px;
  margin: 14px auto 0;
  color: var(--color-muted);
  font-size: 12px;
  line-height: 1.7;
}

.category-tabs {
  display: flex;
  justify-content: center;
  gap: 0;
  margin: 30px 0 26px;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--color-gold) #222;
}

.category-tab {
  flex: 0 0 auto;
  padding: 10px 13px;
  border: 0;
  border-bottom: 1px solid transparent;
  background: transparent;
  color: #c7c3bb;
  font-size: 10px;
  white-space: nowrap;
  cursor: pointer;
  transition: color 180ms ease, border-color 180ms ease;
}

.category-tab + .category-tab::before {
  content: "|";
  margin-right: 13px;
  color: #666;
}

.category-tab:hover,
.category-tab:focus-visible,
.category-tab.is-active {
  border-bottom-color: var(--color-gold);
  color: var(--color-gold);
}

.category-load-error,
.models-empty {
  padding: 18px;
  border: 1px solid rgba(223, 223, 223, .24);
  color: var(--color-muted);
  text-align: center;
}

.models-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 32px;
  color: var(--color-text);
}

.page-control,
.page-number {
  display: grid;
  min-width: 30px;
  height: 34px;
  place-items: center;
  border: 0;
  border-bottom: 1px solid transparent;
  background: transparent;
  color: inherit;
  font-size: 11px;
  cursor: pointer;
}

.page-control { font-size: 20px; }
.page-control:disabled { color: #62605b; cursor: default; }
.page-number:hover,
.page-number.is-active { border-bottom-color: var(--color-gold); color: var(--color-gold); }
.page-ellipsis,
.page-total { color: var(--color-muted); font-size: 11px; }

@media (max-width: 900px) {
  .category-tabs { justify-content: flex-start; scrollbar-width: none; }
  .models-grid { grid-template-columns: minmax(0, 1fr); }
}

@media (max-width: 600px) {
  .collection-section { padding-top: 52px; }
  .models-grid { gap: 22px; }
  .category-tabs { margin-right: calc(var(--page-gutter) * -1); margin-left: calc(var(--page-gutter) * -1); padding: 0 var(--page-gutter); }
  .category-tab { padding-right: 9px; padding-left: 9px; }
  .category-tab + .category-tab::before { margin-right: 9px; }
}

@media (prefers-reduced-motion: reduce) {
  .category-tab,
  .page-number { transition: none; }
}
</style>
