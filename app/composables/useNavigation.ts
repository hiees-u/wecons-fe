import { computed, ref } from 'vue'
import { useContent } from './useContent'
import { useI18n } from './useI18n'
import { useSiteSettings } from './useSiteSettings'

export interface NavItem {
  id?: number | string
  title: string
  url: string
  target?: string
  icon?: string
  children?: NavItem[]
}

export const useNavigation = () => {
  const config = useRuntimeConfig()
  const { getMenus } = useContent()
  const { t } = useI18n()
  const { headerNav } = useSiteSettings()

  const apiBase = config.public.apiBase || 'https://api.wecons.vn/api/v1'
  const adminUrl = config.public.adminUrl || 'https://admin.wecons.vn'
  const siteUrl = config.public.siteUrl || 'https://wecons.vn'
  const siteName = config.public.siteName || 'WE Construction'
  const menuSlug = config.public.menuSlug || 'main-menu'

  const defaultNavItems = computed<NavItem[]>(() => {
    if (headerNav.value && headerNav.value.length > 0) {
      return headerNav.value.map(item => ({ title: item.label, url: item.pageHref }))
    }
    return [
      { title: t('nav.home', 'Trang Chủ'), url: '/' },
      { title: t('nav.about', 'Giới Thiệu'), url: '/gioi-thieu' },
      { title: t('nav.services', 'Dịch Vụ'), url: '/danh-muc-dich-vu' },
      { title: t('nav.products', 'Mẫu nhà đẹp'), url: '/danh-muc-san-pham' },
      { title: t('nav.news', 'Tin tức'), url: '/tin-tuc' },
      { title: t('nav.contact', 'Liên Hệ'), url: '/lien-he' },
    ]
  })

  const navItems = ref<NavItem[]>(defaultNavItems.value)
  const loadingNav = ref(false)

  const parseNodes = (nodes: any[]): NavItem[] => {
    if (!Array.isArray(nodes)) return []
    return nodes.map((node) => ({
      id: node.id,
      title: node.title || node.name || '',
      url: node.url || '#',
      target: node.target || '_self',
      icon: node.icon_font || '',
      children: node.child && node.child.length ? parseNodes(node.child) : [],
    }))
  }

  const fetchNavigation = async () => {
    loadingNav.value = true
    try {
      const res = await getMenus(menuSlug)
      if (res && res.success && res.data) {
        const menuData = res.data
        const nodes = menuData.menuNodes || menuData.menu_nodes || (Array.isArray(menuData) ? menuData : [])
        if (Array.isArray(nodes) && nodes.length > 0) {
          navItems.value = parseNodes(nodes)
        } else {
          navItems.value = defaultNavItems.value
        }
      } else {
        navItems.value = defaultNavItems.value
      }
    } catch {
      navItems.value = defaultNavItems.value
    } finally {
      loadingNav.value = false
    }
  }

  return {
    apiBase,
    adminUrl,
    siteUrl,
    siteName,
    menuSlug,
    navItems,
    loadingNav,
    fetchNavigation,
  }
}
