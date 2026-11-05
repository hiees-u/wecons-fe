/**
 * Image optimization & responsive srcset helper for Nuxt & Unsplash
 */

function getStorageBase(): string {
  try {
    const config = useRuntimeConfig()
    if (config?.public?.storageBaseUrl) {
      return (config.public.storageBaseUrl as string).replace(/\/$/, '')
    }
    if (config?.public?.adminUrl) {
      return `${(config.public.adminUrl as string).replace(/\/$/, '')}/storage`
    }
  } catch {
    // SSR context or outside Nuxt setup
  }

  if (typeof process !== 'undefined' && process.env?.NUXT_PUBLIC_STORAGE_BASE_URL) {
    return process.env.NUXT_PUBLIC_STORAGE_BASE_URL.replace(/\/$/, '')
  }
  if (typeof process !== 'undefined' && process.env?.NUXT_PUBLIC_ADMIN_URL) {
    return `${process.env.NUXT_PUBLIC_ADMIN_URL.replace(/\/$/, '')}/storage`
  }

  return 'https://admin.wecons.vn/storage'
}

/**
 * Normalizes any image URL, replacing internal Docker hostnames
 * (backend, localhost) or relative storage paths with the public storage URL.
 */
export function normalizeImageUrl(src?: string | null): string {
  if (!src) return ''
  const trimmed = String(src).trim()
  if (!trimmed) return ''
  if (/600x600|resido\.local|16905b33848b0b61228ec93d6c21619b024eea1f|^[a-f0-9]{32,40}\.(?:png|jpg|jpeg|webp)$/i.test(trimmed)) {
    return ''
  }

  const storageBase = getStorageBase()

  // Replace internal docker hostnames or localhost
  if (/(?:https?:)?\/\/(?:backend(?::\d+)?|localhost(?::\d+)?|127\.0\.0\.1(?::\d+)?)\/storage\/(.*)/i.test(trimmed)) {
    return `${storageBase}/${trimmed.replace(/(?:https?:)?\/\/(?:backend(?::\d+)?|localhost(?::\d+)?|127\.0\.0\.1(?::\d+)?)\/storage\//i, '')}`
  }

  if (/^backend(?::\d+)?\/storage\/(.*)/i.test(trimmed)) {
    return `${storageBase}/${trimmed.replace(/^backend(?::\d+)?\/storage\//i, '')}`
  }

  if (/^\/?storage\/(.*)/i.test(trimmed)) {
    return `${storageBase}/${trimmed.replace(/^\/?storage\//i, '')}`
  }

  if (/(?:https?:)?\/\/(?:backend(?::\d+)?|localhost(?::\d+)?|127\.0\.0\.1(?::\d+)?)\/(.*)/i.test(trimmed)) {
    return `${storageBase}/${trimmed.replace(/(?:https?:)?\/\/(?:backend(?::\d+)?|localhost(?::\d+)?|127\.0\.0\.1(?::\d+)?)\//i, '')}`
  }

  // Already absolute URL or inline data URI
  if (/^(?:https?:)?\/\//i.test(trimmed) || trimmed.startsWith('data:')) {
    return trimmed
  }

  // Local frontend static assets (starts with /images/ or /assets/)
  if (trimmed.startsWith('/images/') || trimmed.startsWith('/assets/')) {
    return trimmed
  }

  // Any relative path from CMS media (e.g. baiviet/..., news/..., projects/...)
  return `${storageBase}/${trimmed.replace(/^\//, '')}`
}

export function getOptimizedImageUrl(src?: string, width = 800, quality = 80): string {
  const normalized = normalizeImageUrl(src)
  if (!normalized || /600x600|resido\.local/i.test(normalized)) return '/images/pg.webp'

  // If local pg.png, map to WebP version
  if (normalized.includes('/images/pg.png') || normalized.includes('images/pg.png')) {
    return width <= 800 ? '/images/pg-mobile.webp' : '/images/pg.webp'
  }

  // Optimize Unsplash images dynamically
  if (normalized.includes('images.unsplash.com')) {
    const cleanUrl = normalized
      .replace(/([?&])w=\d+/, '')
      .replace(/([?&])q=\d+/, '')
      .replace(/([?&])auto=[^&]+/, '')
      .replace(/([?&])fit=[^&]+/, '')
      .replace(/\?&/, '?')
      .replace(/[?&]$/, '')

    const sep = cleanUrl.includes('?') ? '&' : '?'
    return `${cleanUrl}${sep}auto=format&fit=crop&w=${width}&q=${quality}`
  }

  // Only convert local /images/ assets to WebP (not storage URLs from backend)
  const isLocalImage = /^\/images\//.test(normalized)
  if (isLocalImage && /\.(png|jpg|jpeg)$/i.test(normalized) && !normalized.includes('logo.png') && !normalized.includes('favicon')) {
    return normalized.replace(/\.(png|jpg|jpeg)$/i, '.webp')
  }

  // Optimize storage project/property/news/baiviet images based on requested width
  if (/\/storage\/(projects|properties|news|baiviet)\/(.+)\.(webp|jpg|jpeg|png)$/i.test(normalized)) {
    const base = normalized.replace(/(-150x150|-400xauto|-640xauto|-1024xauto)?\.(webp|jpg|jpeg|png)$/i, '')
    if (width <= 200) {
      return `${base}-150x150.webp`
    }
    if (width <= 640) {
      return `${base}-640xauto.webp`
    }
    return `${base}.webp`
  }

  return normalized
}

export function getImageSrcset(src?: string, widths = [480, 800, 1100], quality = 80): string | undefined {
  const normalized = normalizeImageUrl(src)
  if (!normalized) return undefined

  if (normalized.includes('/images/pg.png') || normalized.includes('/images/pg.webp')) {
    return '/images/pg-mobile.webp 800w, /images/pg.webp 1920w'
  }

  if (/\/storage\/(projects|properties|news|baiviet)\/(.+)\.(webp|jpg|jpeg|png)$/i.test(normalized)) {
    const base = normalized.replace(/(-150x150|-400xauto|-640xauto|-1024xauto)?\.(webp|jpg|jpeg|png)$/i, '')
    return `${base}-640xauto.webp 640w, ${base}.webp 1280w`
  }

  if (normalized.includes('images.unsplash.com')) {
    return widths
      .map(w => `${getOptimizedImageUrl(normalized, w, quality)} ${w}w`)
      .join(', ')
  }

  return undefined
}

