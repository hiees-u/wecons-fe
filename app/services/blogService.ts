import { useBlog } from '~/composables/useBlog'

export interface PostItem {
  id: number
  name: string
  slug?: string
  description?: string
  image?: string
  categoryName?: string
  createdAt?: string
}

export const fetchLatestPosts = async (limit = 3): Promise<{ success: boolean; posts: PostItem[] }> => {
  const { getPosts } = useBlog()
  try {
    const res = await getPosts({ per_page: limit })
    if (res && res.success && Array.isArray(res.data)) {
      return {
        success: true,
        posts: res.data.map((item: any) => ({
          id: item.id,
          name: item.name || item.title || '',
          slug: item.slug || String(item.id),
          description: item.description || '',
          image: item.image || item.thumbnail || '',
          categoryName: item.categories && item.categories.length ? item.categories[0].name : '',
          createdAt: item.created_at || '',
        })),
      }
    }
  } catch (err) {
    console.error('[blogService Error]:', err)
  }

  return { success: false, posts: [] }
}
