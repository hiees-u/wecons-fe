import { computed, shallowRef, toValue, watch } from 'vue'
import type { ComputedRef } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import type { CmsPageKey } from '~/data/cmsPageIds'
import { cmsPageIds } from '~/data/cmsPageIds'

interface CmsPageMetaFallback {
  title?: MaybeRefOrGetter<string>
  description?: MaybeRefOrGetter<string>
}

interface CmsPage {
  description?: string | null
  content?: string | null
  image?: string | null
}

interface CmsPageResponse {
  data?: CmsPage
  error?: boolean
  message?: string | null
}

function stripHtml(value: string): string {
  const decodeCodePoint = (code: number): string =>
    code > 0 && code <= 0x10ffff && (code < 0xd800 || code > 0xdfff)
      ? String.fromCodePoint(code)
      : ''

  return value
    .replace(/<\s*br\s*\/?\s*>/gi, ' ')
    .replace(/<\/(?:p|div|li|h[1-6]|blockquote)\s*>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&apos;|&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#(\d+);/g, (_, code: string) => decodeCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code: string) => decodeCodePoint(Number.parseInt(code, 16)))
    .replace(/\s+/g, ' ')
    .trim()
}

function getMetaContent(content: string, key: string): string {
  const plainContent = stripHtml(content)
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = plainContent.match(
    new RegExp(`\\{\\s*(?:name|property)\\s*:\\s*${escapedKey}\\s*,\\s*content\\s*:\\s*([^}]*)\\}`, 'i'),
  )

  return match?.[1]?.trim() || ''
}

export function useCmsPageMeta(
  pageKey: CmsPageKey,
  fallback: CmsPageMetaFallback = {},
): Promise<ComputedRef<CmsPage | null>> {
  const { locale } = useI18n()
  const configuredPageId = cmsPageIds[pageKey]
  const pageId = computed(() => typeof configuredPageId === 'number'
    ? configuredPageId
    : configuredPageId[locale.value])
  const pageResponse = shallowRef<CmsPageResponse | null>(null)

  useHead(() => {
    const page = pageResponse.value?.data
    const content = page?.content || ''
    const fallbackTitle = toValue(fallback.title) || ''
    const fallbackDescription = toValue(fallback.description) || ''
    const pageTitle = page?.description || fallbackTitle
    const plainContent = stripHtml(content)
    const pageDescription = getMetaContent(content, 'description') || plainContent || fallbackDescription
    const ogTitle = getMetaContent(content, 'og:title') || pageTitle
    const ogDescription = getMetaContent(content, 'og:description') || pageDescription || fallbackDescription

    return {
      title: pageTitle || undefined,
      meta: [
        ...(pageDescription ? [{ name: 'description', content: pageDescription }] : []),
        ...(ogTitle ? [{ property: 'og:title', content: ogTitle }] : []),
        ...(ogDescription ? [{ property: 'og:description', content: ogDescription }] : []),
      ],
    }
  })

  return useAsyncData(
    `cms-page-meta-${pageKey}-${locale.value}`,
    () => $fetch<CmsPageResponse>(`/cms-page-api/pages/${pageId.value}`),
    { server: true, watch: [locale] },
  ).then(({ data, error }) => {
    const reportResult = () => {
      pageResponse.value = data.value || null

      if (error.value) {
        console.error(`[CMS page metadata] Failed to load "${pageKey}" (ID ${pageId.value}):`, error.value)
      } else if (data.value?.error || !data.value?.data) {
        console.log(`[CMS page metadata] No page returned for "${pageKey}" (ID ${pageId.value}):`, pageResponse.value)
      }
    }

    reportResult()
    watch([data, error], reportResult)
    return computed(() => pageResponse.value?.data || null)
  })
}
