export const useContent = () => {
  const { fetchApi } = useApi()

  const getSettings = async () => {
    return await fetchApi('settings')
  }

  const getPages = async () => {
    return await fetchApi('pages')
  }

  const getPage = async (slug: string) => {
    return await fetchApi(`pages/${slug}`)
  }

  const getMenus = async (slug = 'main-menu') => {
    return await fetchApi(`menus?slug=${encodeURIComponent(slug)}`)
  }

  const getSliders = async () => {
    return await fetchApi('sliders')
  }

  const getTestimonials = async () => {
    return await fetchApi('testimonials')
  }

  const submitContact = async (data: { name: string; email: string; phone?: string; subject?: string; content: string }) => {
    return await fetchApi('contacts', {
      method: 'POST',
      body: data,
    })
  }

  return {
    getSettings,
    getPages,
    getPage,
    getMenus,
    getSliders,
    getTestimonials,
    submitContact,
  }
}
