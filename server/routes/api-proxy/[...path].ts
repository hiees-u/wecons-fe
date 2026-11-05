function normalizeApiBase(base: string): string {
  return `${base.replace(/(?:\/v1)+\/?$/i, '').replace(/\/$/, '')}/v1`
}

const IMAGE_KEYS = new Set(['image', 'thumbnail', 'feature_image', 'logo', 'icon', 'banner', 'avatar', 'thumb'])

/**
 * Recursively walk a parsed API response and rewrite any internal Docker/localhost
 * image URLs to the public storageBase.  Handles both string values and
 * object shapes like { url, thumb }.
 */
function rewriteInternalUrls(obj: any, storageBase: string): any {
  if (!obj || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(item => rewriteInternalUrls(item, storageBase))

  const copy: Record<string, any> = {}
  for (const [k, v] of Object.entries(obj)) {
    if (IMAGE_KEYS.has(k)) {
      copy[k] = rewriteImageField(v, storageBase)
    } else if (v && typeof v === 'object') {
      copy[k] = rewriteInternalUrls(v, storageBase)
    } else if (typeof v === 'string') {
      copy[k] = rewriteStringUrl(v, storageBase)
    } else {
      copy[k] = v
    }
  }
  return copy
}

function rewriteImageField(val: any, storageBase: string): any {
  if (!val) return val
  if (typeof val === 'string') return rewriteStringUrl(val, storageBase)
  if (typeof val === 'object') {
    const copy: Record<string, any> = {}
    for (const [k, v] of Object.entries(val)) {
      copy[k] = typeof v === 'string' ? rewriteStringUrl(v, storageBase) : v
    }
    return copy
  }
  return val
}

const INTERNAL_STORAGE_RE = /(?:https?:)?\/\/(?:backend(?::\d+)?|localhost(?::\d+)?|127\.0\.0\.1(?::\d+)?)\/storage\//gi
const INTERNAL_HOST_RE = /(?:https?:)?\/\/(?:backend(?::\d+)?|localhost(?::\d+)?|127\.0\.0\.1(?::\d+)?)(?=\/)/gi
const RELATIVE_STORAGE_RE = /^\/?storage\//i

function rewriteStringUrl(v: string, storageBase: string): string {
  if (!v.trim()) return v
  return v
    .replace(INTERNAL_STORAGE_RE, `${storageBase}/`)
    .replace(INTERNAL_HOST_RE, storageBase)
    .replace(RELATIVE_STORAGE_RE, `${storageBase}/`)
}

const PROXY_CACHE_TTL_MS = 300_000 // 5 minutes
const proxyServerCache = new Map<string, { timestamp: number; data: any }>()

export const clearApiProxyCache = () => {
  proxyServerCache.clear()
}

export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path')
  const method = getMethod(event)

  // API endpoint nội bộ để xóa cache từ manage.sh
  if (path === 'purge-cache') {
    proxyServerCache.clear()
    return { success: true, message: 'Server API proxy cache cleared successfully' }
  }

  if (!path || path.split('/').some(segment => segment === '.' || segment === '..')) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid API path' })
  }

  const isGetOrHead = ['GET', 'HEAD'].includes(method)
  const requestUrl = getRequestURL(event)
  const bypassCache = requestUrl.searchParams.has('_nocache') || getHeader(event, 'x-cache-purge') === '1'
  const cacheKey = `${method}:${path}:${requestUrl.search}`

  if (isGetOrHead && !bypassCache) {
    const cached = proxyServerCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < PROXY_CACHE_TTL_MS) {
      return cached.data
    }
  }

  const config = useRuntimeConfig(event)
  const internalBase = normalizeApiBase(process.env.BACKEND_API_INTERNAL_URL || 'http://backend:80/api')
  const publicBase = normalizeApiBase(String(config.public.apiBase || 'https://api.wecons.vn/api/v1'))
  const apiKey = String(config.blogApiKey || process.env.KEY_API || '')
  const body = ['GET', 'HEAD'].includes(method) ? undefined : await readBody(event)
  const headers: Record<string, string> = { Accept: 'application/json' }

  if (apiKey) {
    headers['X-API-KEY'] = apiKey
  }

  const backendHost = process.env.BACKEND_HOST || (config?.public?.adminUrl ? new URL(config.public.adminUrl as string).host : 'admin.wecons.vn')
  const storageBase = (config?.public?.storageBaseUrl || process.env.NUXT_PUBLIC_STORAGE_BASE_URL || (config?.public?.adminUrl ? `${config.public.adminUrl}/storage` : 'https://admin.wecons.vn/storage')).replace(/\/$/, '')

  let lastError: unknown
  for (const base of [...new Set([internalBase, publicBase])]) {
    try {
      const isInternal = base.includes('://backend')
      const reqHeaders = { ...headers }
      if (isInternal) {
        reqHeaders['Host'] = backendHost
      }

      const res: any = await $fetch(`${base}/${path}${requestUrl.search}`, {
        method,
        headers: reqHeaders,
        body,
      })
      const result = rewriteInternalUrls(res, storageBase)
      if (isGetOrHead && result) {
        proxyServerCache.set(cacheKey, { timestamp: Date.now(), data: result })
      }
      return result
    } catch (error) {
      lastError = error
      console.warn(`[API proxy] Request to ${base}/${path} failed; trying next API endpoint.`, error)
    }
  }

  console.error(`[API proxy] All API endpoints failed for ${path}.`, lastError)
  if (isGetOrHead) {
    return { success: true, data: [] }
  }
  throw createError({
    statusCode: 502,
    statusMessage: 'API request failed',
    cause: lastError,
  })
})
