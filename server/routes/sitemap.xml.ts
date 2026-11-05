import { defineEventHandler, setResponseHeaders } from 'h3'
import homeData from '../../app/data/homeContent.json'
import pageData from '../../app/data/pageContent.json'
import seoArticles from '../../app/data/seoArticles.json'

interface SitemapItem {
  loc: string
  lastmod?: string
  changefreq: 'daily' | 'weekly' | 'monthly'
  priority: number
}

interface ApiItem {
  id?: number | string
  slug?: string
  slugable?: { key?: string }
  updated_at?: string
  created_at?: string
}

interface PaginatedApiResponse<T> {
  success?: boolean
  data?: T[]
  meta?: {
    current_page?: number
    last_page?: number
  }
}

const itemsPerPage = 50
const maxPages = 1_000
const maxUrls = 50_000

function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, (character) => {
    switch (character) {
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '&': return '&amp;'
      case '\'': return '&apos;'
      case '"': return '&quot;'
      default: return character
    }
  })
}

function formatDate(value?: string): string | undefined {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString().slice(0, 10)
}

function getSlug(item: ApiItem): string | undefined {
  const slug = item.slugable?.key || item.slug || item.id
  return slug === undefined || slug === null || String(slug).trim() === ''
    ? undefined
    : String(slug)
}

async function fetchPage<T>(url: string, apiKey: string): Promise<PaginatedApiResponse<T>> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 6_000)

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        ...(apiKey ? { 'X-API-KEY': apiKey } : {}),
      },
      signal: controller.signal,
    })

    if (!response.ok) {
      return { success: false, data: [] }
    }

    const payload = await response.json() as PaginatedApiResponse<T>
    if (payload.success === false || !Array.isArray(payload.data)) {
      return { success: false, data: [] }
    }

    return payload
  } catch {
    return { success: false, data: [] }
  } finally {
    clearTimeout(timeout)
  }
}

async function fetchAllPages<T>(endpoint: string, apiKey: string): Promise<T[]> {
  try {
    const firstUrl = `${endpoint}?per_page=${itemsPerPage}&page=1`
    const firstPage = await fetchPage<T>(firstUrl, apiKey)
    if (!firstPage.data || !firstPage.data.length) return []

    const lastPage = Math.min(Number(firstPage.meta?.last_page ?? 1), 10)
    if (lastPage <= 1) return firstPage.data

    const pages = await Promise.all(
      Array.from({ length: lastPage - 1 }, (_, index) =>
        fetchPage<T>(`${endpoint}?per_page=${itemsPerPage}&page=${index + 2}`, apiKey),
      ),
    )

    return [firstPage, ...pages].flatMap(page => page.data || [])
  } catch {
    return []
  }
}

let sitemapCache: { timestamp: number; xml: string } | null = null
const SITEMAP_CACHE_TTL = 3_600_000 // 1 hour

export default defineEventHandler(async (event) => {
  if (sitemapCache && (Date.now() - sitemapCache.timestamp < SITEMAP_CACHE_TTL)) {
    setResponseHeaders(event, {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=14400, stale-while-revalidate=86400',
    })
    return sitemapCache.xml
  }

  const config = useRuntimeConfig()
  const siteUrl = (config.public.siteUrl || 'https://wecons.vn').replace(/\/+$/, '')
  const rawApiBase = process.env.BACKEND_API_INTERNAL_URL || (config.public.apiBase as string) || 'http://backend:80/api'
  const apiBase = rawApiBase.replace(/(?:\/v1)+\/?$/i, '').replace(/\/$/, '') + '/v1'
  const apiKey = (config.blogApiKey || process.env.KEY_API || 'NhNtFVfBbYu0LHeRQKj8W0NyE9bZSTz7') as string

  // Danh mục trang tĩnh cốt lõi
  const staticRoutes: SitemapItem[] = [
    { loc: `${siteUrl}/`, changefreq: 'daily', priority: 1.0 },
    { loc: `${siteUrl}/gioi-thieu`, changefreq: 'monthly', priority: 0.8 },
    { loc: `${siteUrl}/dich-vu`, changefreq: 'weekly', priority: 0.9 },
    { loc: `${siteUrl}/du-an`, changefreq: 'daily', priority: 0.9 },
    { loc: `${siteUrl}/danh-muc-san-pham`, changefreq: 'weekly', priority: 0.8 },
    { loc: `${siteUrl}/bao-gia`, changefreq: 'weekly', priority: 0.8 },
    { loc: `${siteUrl}/process`, changefreq: 'monthly', priority: 0.7 },
    { loc: `${siteUrl}/tin-tuc`, changefreq: 'daily', priority: 0.9 },
    { loc: `${siteUrl}/lien-he`, changefreq: 'monthly', priority: 0.7 },
  ]

  const urls = new Map<string, SitemapItem>(staticRoutes.map(item => [item.loc, item]))

  // 1. Thêm 48 bài viết Programmatic SEO từ seoArticles.json (Khắc phục lỗi Indexable page not in sitemap)
  if (Array.isArray(seoArticles)) {
    for (const article of seoArticles as Array<{ clean_slug?: string; slug?: string }>) {
      const cleanSlug = article.clean_slug || article.slug?.replace(/^\/|\/$/g, '')
      if (!cleanSlug) continue
      const loc = `${siteUrl}/tin-tuc/${encodeURIComponent(cleanSlug)}`
      urls.set(loc, {
        loc,
        lastmod: '2026-03-01',
        changefreq: 'weekly',
        priority: 0.8,
      })
    }
  }

  // 2. Thêm dịch vụ và mẫu thiết kế nội bộ
  for (const service of pageData.serviceHighlights) {
    if (!service.slug) continue
    const loc = `${siteUrl}/dich-vu/${encodeURIComponent(service.slug)}`
    urls.set(loc, { loc, changefreq: 'monthly', priority: 0.7 })
  }

  for (const design of homeData.designs) {
    if (!design.slug) continue
    const loc = `${siteUrl}/danh-muc-san-pham/${encodeURIComponent(design.slug)}`
    urls.set(loc, { loc, changefreq: 'monthly', priority: 0.7 })
  }

  // 3. Thêm các dự án thiết kế & thi công từ homeContent
  if (Array.isArray(homeData.projects)) {
    for (const project of homeData.projects) {
      const slug = project.idProject
      if (!slug) continue
      const loc = `${siteUrl}/du-an/${encodeURIComponent(slug)}`
      urls.set(loc, { loc, changefreq: 'weekly', priority: 0.8 })
    }
  }

  // 4. Tải thêm từ RESTful API nếu có
  const [posts, projects, properties] = await Promise.all([
    fetchAllPages<ApiItem>(`${apiBase}/posts`, apiKey),
    fetchAllPages<ApiItem>(`${apiBase}/projects`, apiKey),
    fetchAllPages<ApiItem>(`${apiBase}/properties`, apiKey),
  ])

  for (const [content, prefix, priority] of [
    [posts, '/tin-tuc', 0.8],
    [projects, '/du-an', 0.8],
    [properties, '/danh-muc-san-pham', 0.7],
  ] as const) {
    for (const item of content) {
      const slug = getSlug(item)
      if (!slug) continue
      const loc = `${siteUrl}${prefix}/${encodeURIComponent(slug)}`
      urls.set(loc, {
        loc,
        lastmod: formatDate(item.updated_at || item.created_at),
        changefreq: 'weekly',
        priority,
      })
    }
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...Array.from(urls.values()).flatMap(item => [
      '  <url>',
      `    <loc>${escapeXml(item.loc)}</loc>`,
      ...(item.lastmod ? [`    <lastmod>${item.lastmod}</lastmod>`] : []),
      `    <changefreq>${item.changefreq}</changefreq>`,
      `    <priority>${item.priority.toFixed(1)}</priority>`,
      '  </url>',
    ]),
    '</urlset>',
  ]

  setResponseHeaders(event, {
    'Content-Type': 'application/xml; charset=utf-8',
    'Cache-Control': 'public, max-age=3600, s-maxage=14400, stale-while-revalidate=86400',
  })

  const resultXml = xml.join('\n')
  sitemapCache = { timestamp: Date.now(), xml: resultXml }
  return resultXml
})
