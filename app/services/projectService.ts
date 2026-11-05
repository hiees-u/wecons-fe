import { useRealEstate } from '~/composables/useRealEstate'

export interface ProjectItem {
  id: number
  name: string
  slug?: string
  description?: string
  image?: string
  location?: string
  status?: string
}

export const fetchFeaturedProjects = async (limit = 6): Promise<{ success: boolean; projects: ProjectItem[] }> => {
  const { getProjects } = useRealEstate()
  try {
    const res = await getProjects({ per_page: limit })
    if (res && res.success && Array.isArray(res.data)) {
      return {
        success: true,
        projects: res.data.map((item: any) => ({
          id: item.id,
          name: item.name || item.title || '',
          slug: item.slug || String(item.id),
          description: item.description || '',
          image: item.image || item.thumbnail || '',
          location: item.location || '',
          status: item.status || 'Đang thi công',
        })),
      }
    }
  } catch (err) {
    console.error('[projectService Error]:', err)
  }

  return { success: false, projects: [] }
}
