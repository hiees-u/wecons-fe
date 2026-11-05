export interface BlogPost {
  id: number | string
  name?: string
  title?: string
  slug?: string
  slugable?: { key?: string }
  description?: string
  excerpt?: string
  content?: string
  body?: string
  image?: string | { url?: string; thumb?: string } | null
  feature_image?: string | { url?: string; thumb?: string } | null
  thumbnail?: string
  categories?: Array<{ id?: number | string; name?: string; slug?: string; slugable?: { key?: string } }> | null
  created_at?: string
  published_at?: string
  author?: string | { name?: string; first_name?: string; last_name?: string } | null
  views?: number
}

export interface BlogCategory {
  id: number | string
  name?: string
  parent_id?: number | string | null
  description?: string | null
  posts_count?: number | string | null
  slug?: string
  slugable?: { key?: string }
}

interface PostsApiResponse {
  success?: boolean
  error?: boolean
  message?: string | null
  data: BlogPost[]
  meta?: {
    current_page?: number
    last_page?: number
    per_page?: number
    total?: number
    has_more?: boolean
    [key: string]: unknown
  }
}

interface PostApiResponse {
  success?: boolean
  error?: boolean
  message?: string | null
  data: BlogPost
}

import { normalizeImageUrl } from '~/utils/imageHelper'

export const DEFAULT_POST_IMAGES = [
  'image-1.webp',
  'image-2.webp',
  'image-3.webp',
  'image-4.webp',
  'image-5.webp',
  'image-6.webp',
  'image-7.webp',
]

export function getDefaultPostImage(seed?: number | string): string {
  let relativePath = DEFAULT_POST_IMAGES[0]
  if (seed !== undefined && seed !== null && seed !== '') {
    if (typeof seed === 'number' && !isNaN(seed)) {
      relativePath = DEFAULT_POST_IMAGES[Math.abs(seed) % DEFAULT_POST_IMAGES.length]
    } else {
      const str = String(seed)
      let hash = 0
      for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i)
        hash |= 0
      }
      relativePath = DEFAULT_POST_IMAGES[Math.abs(hash) % DEFAULT_POST_IMAGES.length]
    }
  }
  return `/images/${relativePath}`
}

function normalizePostImage(post: BlogPost): BlogPost {
  const seed = post.id ?? post.slug ?? post.slugable?.key ?? post.name ?? ''

  // Try image fields in priority order; each can be string or {url, thumb}
  function extractUrl(val: any): string {
    if (!val) return ''
    if (typeof val === 'object') return (val.url || val.thumb || '').trim()
    return typeof val === 'string' ? val.trim() : ''
  }

  const raw = extractUrl(post.image) || extractUrl(post.feature_image) || extractUrl(post.thumbnail)

  if (!raw) {
    return { ...post, image: getDefaultPostImage(seed) }
  }

  const normalized = normalizeImageUrl(raw)
  return {
    ...post,
    image: normalized || getDefaultPostImage(seed),
  }
}

export const useBlog = () => {
  const { fetchApi } = useApi()

  const getPosts = async (params: Record<string, string | number> = {}) => {
    const response = await $fetch<PostsApiResponse>('/blog-api/posts', { query: params })
    const meta = response.meta ?? {}
    const currentPage = Number(meta.current_page ?? params.page ?? 1)
    const lastPage = Number(meta.last_page ?? 0)

    return {
      ...response,
      success: response.success ?? !response.error,
      data: response.data.map(normalizePostImage),
      meta: {
        ...meta,
        has_more: meta.has_more ?? (lastPage > 0 && currentPage < lastPage),
      },
    }
  }

  const getPost = async (idOrSlug: string | number) => {
    const response = await $fetch<PostApiResponse>(`/blog-api/posts/${encodeURIComponent(String(idOrSlug))}`)
    return {
      ...response,
      success: response.success ?? !response.error,
      data: normalizePostImage(response.data),
    }
  }

  const getCategories = async () => {
    return await fetchApi<BlogCategory[]>('post-categories')
  }

  const getTags = async () => {
    return await fetchApi('tags')
  }

  return {
    getPosts,
    getPost,
    getCategories,
    getTags,
  }
}
