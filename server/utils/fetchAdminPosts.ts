import type { H3Event } from 'h3'

const DEFAULT_KEY_API = 'NhNtFVfBbYu0LHeRQKj8W0NyE9bZSTz7'
const allowedQueryParams = [
  'per_page',
  'page',
  'category',
  'category_id',
  'tag_id',
  'keyword',
  'featured',
  'is_featured'
]

function normalizeApiBase(base: string): string {
  const normalizedBase = base.replace(/\/+$/, '')
  if (/\/api(?:\/v1)*$/i.test(normalizedBase)) {
    return `${normalizedBase.replace(/(?:\/v1)+$/i, '')}/v1`
  }
  return `${normalizedBase}/api/v1`
}

function getCandidateUrls(config: any, pathSuffix: string): string[] {
  const urls: string[] = []
  const internalBase = process.env.BACKEND_API_INTERNAL_URL
  if (internalBase) {
    urls.push(`${normalizeApiBase(internalBase)}/posts${pathSuffix}`)
  }
  const adminUrl = config?.public?.adminUrl || process.env.NUXT_PUBLIC_ADMIN_URL || 'https://admin.wecons.vn'
  urls.push(`${normalizeApiBase(adminUrl)}/posts${pathSuffix}`)
  return urls
}

export async function fetchAdminPosts(event: H3Event, postId?: string) {
  const config = useRuntimeConfig(event)
  const apiKey = (config.blogApiKey || process.env.KEY_API || DEFAULT_KEY_API) as string

  const query = getQuery(event)
  const queryParams = new URLSearchParams()
  for (const key of allowedQueryParams) {
    const value = query[key]
    if (Array.isArray(value)) {
      value.forEach(item => queryParams.append(key, String(item)))
    } else if (value !== undefined && value !== null && typeof value !== 'object') {
      queryParams.append(key, String(value))
    }
  }

  const queryString = queryParams.toString()
  const pathSuffix = postId
    ? `/${encodeURIComponent(postId)}${queryString ? `?${queryString}` : ''}`
    : (queryString ? `?${queryString}` : '')

  const candidateUrls = getCandidateUrls(config, pathSuffix)
  return await fetchWithFallback(candidateUrls, apiKey, config)
}

/**
 * Resolve an image field which may be a string path/URL or an object {url, thumb}.
 * Replaces internal Docker/localhost hostnames with the public storage base URL.
 */
function resolveImageField(val: any, storageBase: string): string | null {
  if (!val) return null
  // Unwrap object {url, thumb, ...}
  if (typeof val === 'object') {
    val = val.url || val.thumb || ''
  }
  if (typeof val !== 'string' || !val.trim()) return null
  return val.trim()
    .replace(/(?:https?:)?\/\/(?:backend(?::\d+)?|localhost(?::\d+)?|127\.0\.0\.1(?::\d+)?)\/storage\//gi, `${storageBase}/`)
    .replace(/(?:https?:)?\/\/(?:backend(?::\d+)?|localhost(?::\d+)?|127\.0\.0\.1(?::\d+)?)(?=\/)/gi, storageBase)
    .replace(/^\/?storage\//gi, `${storageBase}/`)
}

function normalizePostDataImages(data: any, storageBase: string): any {
  if (!data) return data
  if (Array.isArray(data)) {
    return data.map(item => normalizePostDataImages(item, storageBase))
  }
  if (typeof data === 'object') {
    const copy = { ...data }
    for (const key of ['image', 'thumbnail', 'feature_image']) {
      if (copy[key] !== undefined && copy[key] !== null) {
        copy[key] = resolveImageField(copy[key], storageBase)
      }
    }
    return copy
  }
  return data
}

async function fetchWithFallback(endpoints: string[], apiKey: string, config: any) {
  const backendHost = process.env.BACKEND_HOST || (config?.public?.adminUrl ? new URL(config.public.adminUrl).host : 'admin.wecons.vn')
  const storageBase = (config?.public?.storageBaseUrl || process.env.NUXT_PUBLIC_STORAGE_BASE_URL || (config?.public?.adminUrl ? `${config.public.adminUrl}/storage` : 'https://admin.wecons.vn/storage')).replace(/\/$/, '')

  let lastError: any = null
  for (const endpoint of endpoints) {
    try {
      const isInternal = endpoint.includes('://backend')
      const headers: Record<string, string> = {
        Accept: 'application/json',
        'X-API-KEY': apiKey,
      }
      if (isInternal) {
        headers['Host'] = backendHost
      }

      const res: any = await $fetch(endpoint, {
        headers,
        timeout: 7000,
      })
      if (res && res.data) {
        res.data = normalizePostDataImages(res.data, storageBase)
      }
      return res
    } catch (err: any) {
      lastError = err
      console.warn(`[fetchAdminPosts] Endpoint ${endpoint} failed, trying next fallback...`, err?.message)
    }
  }
  console.error('[fetchAdminPosts] All candidate endpoints failed:', lastError?.message)
  return { success: true, data: [] }
}
