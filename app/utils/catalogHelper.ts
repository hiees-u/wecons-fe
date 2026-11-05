import type { HomeImageItem } from '~/types/content'
import { articleContentToBlocks } from '~/utils/articleContent'
import { getImageUrl } from '~/utils/formatters'

export interface ApiProperty {
  [key: string]: unknown
  data?: ApiProperty
}

export interface DetailModel {
  title: string
  projectName: string
  category: string
  image: string
  imageAlt: string
  images: string[]
  description: string
  content: string
  area: string
  floors: string
  type: string
  heroStyle: string
  style: string
  year: string
  materials: string
  location: string
}

export interface ProductDetailFallback {
  title?: string
  title_en?: string
  project_name?: string
  project_name_en?: string
  area?: string
  floors?: string
  floors_en?: string
  type?: string
  type_en?: string
  year?: string
  style?: string
  style_en?: string
  hero_style?: string
  hero_style_en?: string
  materials?: string
  materials_en?: string
  location?: string
  location_en?: string
  story?: string[]
  story_en?: string[]
  description?: string[]
  description_en?: string[]
  feature_images?: Array<{ src: string; caption?: string; caption_en?: string }>
  architecture_documents?: string[]
  architecture_documents_en?: string[]
  documents_note?: string
  documents_note_en?: string
  documents_title?: string
  documents_title_en?: string
  cta_image?: string
  cta_description?: string
  cta_description_en?: string
  closing_paragraphs?: string[]
  closing_paragraphs_en?: string[]
}

export function getString(value: unknown): string {
  if (typeof value === 'string' || typeof value === 'number') return String(value).trim()
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    return getString(record.label || record.name || record.value || record.title)
  }
  return ''
}

export function getImage(value: unknown): string {
  if (typeof value === 'string') return getImageUrl(value, '')
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    return getImage(record.url || record.thumb || record.value)
  }
  return ''
}

export function localizedFallback(locale: string, vietnamese?: string, english?: string): string {
  return locale === 'en' ? english || vietnamese || '' : vietnamese || ''
}

export function localizedFallbackList(locale: string, vietnamese?: string[], english?: string[]): string[] {
  return locale === 'en' ? english || vietnamese || [] : vietnamese || []
}

export function normalizeProperty(
  item: ApiProperty,
  fallback: (HomeImageItem & { slug?: string; categorySlug: string }) | null,
  specific: ProductDetailFallback | null,
  locale: string,
  localGallery: string[],
  slugValue: string,
): DetailModel {
  const categories = Array.isArray(item.categories) ? item.categories.map(getString).filter(Boolean) : []
  const content = getString(item.content)
  const contentImages = articleContentToBlocks(content)
    .filter(block => block.kind === 'image')
    .map(block => block.text)
    .filter(Boolean)
  const apiImages = Array.isArray(item.images) ? item.images.map(getImage).filter(Boolean) : []
  const images = [...new Set([...apiImages, ...contentImages])]
  const image = getImage(item.image || item.thumbnail || item.feature_image)
    || images[0]
    || localGallery[0]
    || (fallback ? getImageUrl(fallback.image, '') : '')
  const areaValue = getString(item.square || item.area)
  const areaNumber = Number(areaValue.replace(/[,\s]/g, ''))
  const area = areaValue && !/[a-z²]/i.test(areaValue) && Number.isFinite(areaNumber)
    ? `${new Intl.NumberFormat(locale === 'vi' ? 'vi-VN' : 'en-US').format(areaNumber)} m²`
    : areaValue

  return {
    title: getString(item.name || item.title) || localizedFallback(locale, specific?.title, specific?.title_en) || fallback?.title || slugValue,
    projectName: getString(item.name || item.title) || localizedFallback(locale, specific?.project_name, specific?.project_name_en) || fallback?.title || slugValue,
    category: categories.join(' · ') || fallback?.category || localizedFallback(locale, specific?.type, specific?.type_en),
    image,
    imageAlt: getString(item.name || item.title) || fallback?.alt || localizedFallback(locale, specific?.title, specific?.title_en) || slugValue,
    images: [...new Set([image, ...images].filter(Boolean))],
    description: getString(item.description),
    content,
    area: area || specific?.area || '',
    floors: getString(item.number_floor || item.number_floors || item.floors) || localizedFallback(locale, specific?.floors, specific?.floors_en),
    type: getString(item.building_type || item.project_type || item.property_type) || categories[0] || localizedFallback(locale, specific?.type, specific?.type_en) || fallback?.category || '',
    heroStyle: getString(item.style || item.architectural_style || item.style_name) || localizedFallback(locale, specific?.hero_style, specific?.hero_style_en),
    style: getString(item.style || item.architectural_style || item.style_name) || localizedFallback(locale, specific?.style, specific?.style_en),
    year: getString(item.year || item.completion_year) || specific?.year || '',
    materials: getString(item.materials || item.material) || localizedFallback(locale, specific?.materials, specific?.materials_en),
    location: getString(item.city || item.location) || localizedFallback(locale, specific?.location, specific?.location_en),
  }
}
