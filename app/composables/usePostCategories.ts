import { computed } from 'vue'
import { useBlog } from '~/composables/useBlog'

export async function usePostCategories() {
  const { getCategories } = useBlog()
  const { data: response, error } = await useAsyncData('blog-post-categories', async () => {
    const result = await getCategories()
    if (!result.success || !Array.isArray(result.data)) {
      throw new Error(result.message || 'The post categories API returned an invalid response.')
    }

    return result.data
  }, {
    default: () => [],
  })

  const categories = computed(() => (response.value || [])
    .filter(category => category.parent_id == null || Number(category.parent_id) === 0)
    .filter(category => typeof category.name === 'string' && category.name.trim())
    .filter(category => typeof category.slugable?.key === 'string' && category.slugable.key.trim())
    .map(category => ({
      id: category.id,
      name: category.name!.trim(),
      slug: category.slugable!.key!.trim(),
      description: category.description?.trim() || '',
      postsCount: Number(category.posts_count) || 0,
    }))
  )

  return {
    categories,
    error,
  }
}
