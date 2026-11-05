import type { Locale } from '~/composables/useI18n'

type CmsPageId = number | Record<Locale, number>

export const cmsPageIds = {
  home: { en: 19, vi: 17 },
  articles: 25,
  articleDetail: 9999,
  articleCategory: 9999,
  quote: 9999,
  consultation: 23,
  serviceCategories: 9999,
  serviceCategoryDetail: 9999,
  productCategories: 20,
  productCategoryDetail: 9999,
  services: 22,
  serviceDetail: 9999,
  projects: 9999,
  projectDetail: 9999,
  about: 21,
  contact: 26,
  pricing: 24,
  process: 9999,
  products: 9999,
  productDetail: 9999,
} as const satisfies Record<string, CmsPageId>

export type CmsPageKey = keyof typeof cmsPageIds
