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

function normalizeApiBase(base: string): string {
  return `${base.replace(/(?:\/v1)+\/?$/i, '').replace(/\/$/, '')}/v1`
}

function normalizeCmsImageUrl(image: string | null | undefined, storageBase: string): string | null {
  if (!image || typeof image !== 'string') return image || null
  return image
    .replace(/(?:https?:)?\/\/(?:backend(?::\d+)?|localhost(?::\d+)?|127\.0\.0\.1(?::\d+)?)\/storage\//gi, `${storageBase}/`)
    .replace(/(?:https?:)?\/\/(?:backend(?::\d+)?|localhost(?::\d+)?|127\.0\.0\.1(?::\d+)?)\//gi, `${storageBase}/`)
    .replace(/^\/?storage\//gi, `${storageBase}/`)
}

export default defineCachedEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id || !/^\d+$/.test(id)) {
    return { data: null, error: true, message: 'Invalid CMS page ID' }
  }

  const config = useRuntimeConfig(event)
  const internalBase = normalizeApiBase(process.env.BACKEND_API_INTERNAL_URL || 'http://backend:80/api')
  const publicBase = normalizeApiBase(String(config.cmsApiBase || process.env.NUXT_CMS_API_BASE || 'https://api.wecons.vn/api/v1'))
  const apiKey = String(config.blogApiKey || process.env.KEY_API || 'NhNtFVfBbYu0LHeRQKj8W0NyE9bZSTz7')
  const backendHost = process.env.BACKEND_HOST || (config?.public?.adminUrl ? new URL(config.public.adminUrl as string).host : 'admin.wecons.vn')
  const storageBase = (config?.public?.storageBaseUrl || process.env.NUXT_PUBLIC_STORAGE_BASE_URL || (config?.public?.adminUrl ? `${config.public.adminUrl}/storage` : 'https://admin.wecons.vn/storage')).replace(/\/$/, '')

  const candidateUrls = [
    `${internalBase}/pages/${id}`,
    `${publicBase}/pages/${id}`,
  ]

  let firstPageResponse: CmsPageResponse | null = null

  for (const url of candidateUrls) {
    try {
      const isInternal = url.startsWith(internalBase)
      const headers: Record<string, string> = { Accept: 'application/json' }
      if (apiKey) {
        headers['X-API-KEY'] = apiKey
      }
      if (isInternal) {
        headers['Host'] = backendHost
      }

      const res = await $fetch<CmsPageResponse>(url, {
        headers,
        timeout: 5000,
      })
      if (res && res.data) {
        res.data.image = normalizeCmsImageUrl(res.data.image, storageBase)
        console.info(`Successfully fetched CMS page from ${url}`)
        firstPageResponse ||= res

        if (typeof res.data.image === 'string' && res.data.image.trim()) {
          return res
        }
      }
    } catch {
      // try next candidate
      console.warn(`Failed to fetch CMS page from ${url}, trying next candidate...`)
    }
  }

  if (firstPageResponse) {
    if (firstPageResponse.data) {
      firstPageResponse.data.image = normalizeCmsImageUrl(firstPageResponse.data.image, storageBase)
    }
    return firstPageResponse
  }

  // Graceful fallback to avoid crashing SSR with 502
  return { data: null, error: true, message: 'CMS page unavailable, using default fallback metadata' }
}, {
  name: 'cms-page',
  maxAge: 60 * 5,
  swr: true,
  getKey: event => getRouterParam(event, 'id') || 'invalid',
})
