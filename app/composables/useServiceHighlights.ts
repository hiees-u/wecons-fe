import { computed } from 'vue'
import defaultServiceOverview from '~/data/services-overview.default.json'
import { useSiteSettings } from '~/composables/useSiteSettings'
import { normalizeImageUrl } from '~/utils/imageHelper'

export interface SharedServiceItem {
  id: number
  title: string
  description: string
  image: string
  alt: string
  category: string
  slug: string
  href: string
}

const defaultItems = defaultServiceOverview.items as SharedServiceItem[]

function toSafeText(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

export function normalizeServices(apiData: unknown, defaults: SharedServiceItem[] = defaultItems): SharedServiceItem[] {
  if (!Array.isArray(apiData) || apiData.length === 0) return defaults

  const firstDefault = defaults[0]
  if (!firstDefault) return []

  return apiData.map((value, index) => {
    const item: Record<string, unknown> = value && typeof value === 'object'
      ? value as Record<string, unknown>
      : {}
    const fallback = defaults[index] ?? firstDefault

    return {
      id: fallback.id,
      title: toSafeText(item.title, fallback.title),
      description: toSafeText(item.description, fallback.description),
      image: toSafeText(item.image, fallback.image),
      alt: toSafeText(item.alt, fallback.alt || fallback.title),
      category: toSafeText(item.category, fallback.category),
      slug: toSafeText(item.slug, fallback.slug),
      href: toSafeText(item.href, fallback.href),
    }
  })
}

export function useServiceHighlights() {
  const { apiServiceHighlights, isLoaded } = useSiteSettings()

  return computed(() => normalizeServices(
    isLoaded.value ? apiServiceHighlights.value : null,
  ).map((service, index) => ({
    ...service,
    image: normalizeImageUrl(service.image)
      || normalizeImageUrl(defaultItems[index]?.image)
      || normalizeImageUrl(defaultItems[0]?.image),
  })))
}
