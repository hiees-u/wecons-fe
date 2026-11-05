import { computed } from 'vue'
import defaultSettingsJson from '~/data/defaultSettings.json'
import { useContent } from './useContent'

export interface SiteSettings {
  hotline?: string
  phone_secondary?: string
  contact_email?: string
  email_support?: string
  address?: string
  working_hours?: string
  map_iframe?: string
  social_zalo?: string
  social_facebook?: string
  social_tiktok?: string
  social_youtube?: string
  logo?: string
  logo_dark?: string
  favicon?: string
  header_cta_text?: string
  header_cta_link?: string
  header_nav?: Array<{ label: string; pageHref: string }>
  footer_company_name?: string
  footer_tax_id?: string
  footer_about_text?: string
  footer_copyright?: string
  footer_explore_links?: Array<{ label: string; url: string }>
  footer_services_links?: Array<{ label: string; url: string }>
  site_title?: string
  site_description?: string
  seo_keywords?: string
  seo_og_image?: string
  hero_title?: string
  hero_subtitle?: string
  hero_banner_image?: string | null
  hero_video_url?: string
  trust_intro_image?: string
  default_page_banner?: string
  default_page_banner_mobile?: string
  about_banner?: string
  projects_banner?: string
  services_banner?: string
  pricing_banner?: string
  news_banner?: string
  contact_banner?: string
  contact_sidebar_image?: string
  home_values?: Array<{ title: string; subtitle: string; description: string }> | string[]
  about_overview?: { title: string; subtitle?: string; description: string; image: string }
  about_portfolio?: { title: string; description: string; image: string }
  about_story?: Partial<{
    history_title: string
    history_badge: string
    history_description: string
    history_image: string
    milestones: Array<{ year: string; title: string; description: string }>
    vision_badge: string
    vision_label: string
    vision_title: string
    vision_description: string
    vision_image: string
    mission_badge: string
    mission_label: string
    mission_title: string
    mission_description: string
    mission_image: string
  }>
  company_values?: Array<{ title: string; description: string; icon: string }>
  service_highlights?: Array<{ slug?: string; title: string; description: string; image: string; alt: string; category: string }>
  process_steps?: Array<{ title: string; description: string }>
  metrics?: Array<{ value: string; label: string }>
  general_settings?: Record<string, any>
  ahrefs_analytics_key?: string
  ahrefs_analytics_enabled?: boolean | number | string
  ahrefs_analytics_src?: string
  ahrefs_custom_script?: string
  featured_project_slugs?: string[]
  featured_post_slugs?: string[]
}

const defaultSettings: SiteSettings = defaultSettingsJson as unknown as SiteSettings

export const useSiteSettings = () => {
  const { getSettings } = useContent()
  const settingsState = useState<SiteSettings>('site_settings', () => defaultSettings)
  const isLoaded = useState<boolean>('site_settings_loaded', () => false)
  const isFetching = useState<boolean>('site_settings_fetching', () => false)
  const apiServiceHighlights = useState<SiteSettings['service_highlights'] | null>(
    'site_service_highlights',
    () => null,
  )

  const fetchSettings = async () => {
    if (isLoaded.value || isFetching.value) return
    isFetching.value = true
    try {
      const res = await getSettings()
      if (res && res.success && res.data) {
        settingsState.value = { ...defaultSettings, ...res.data }
        apiServiceHighlights.value = Array.isArray(res.data.service_highlights)
          ? res.data.service_highlights
          : null
        isLoaded.value = true
      }
    } catch (e) {
      console.warn('[useSiteSettings] Failed to fetch settings, using defaults.', e)
    } finally {
      isFetching.value = false
    }
  }

  // Tự động tải dữ liệu cấu hình qua RESTful API trong quá trình SSR và Client
  if (!isLoaded.value) {
    useAsyncData('site_settings_async_load', async () => {
      if (isLoaded.value) return settingsState.value
      try {
        const res = await getSettings()
        if (res && res.success && res.data) {
          settingsState.value = { ...defaultSettings, ...res.data }
          apiServiceHighlights.value = Array.isArray(res.data.service_highlights)
            ? res.data.service_highlights
            : null
          isLoaded.value = true
          return res.data
        }
      } catch (e) {
        console.warn('[useSiteSettings] Failed to fetch settings in SSR, using defaults.', e)
      }
      return null
    })
  }

  const hotline = computed(() => settingsState.value.hotline || defaultSettings.hotline!)
  const phoneSecondary = computed(() => settingsState.value.phone_secondary || defaultSettings.phone_secondary!)
  const contactEmail = computed(() => settingsState.value.contact_email || defaultSettings.contact_email!)
  const address = computed(() => settingsState.value.address || defaultSettings.address!)
  const workingHours = computed(() => settingsState.value.working_hours || defaultSettings.working_hours!)
  const mapIframe = computed(() => settingsState.value.map_iframe || defaultSettings.map_iframe!)
  const socialZalo = computed(() => settingsState.value.social_zalo || defaultSettings.social_zalo!)
  const socialFacebook = computed(() => settingsState.value.social_facebook || defaultSettings.social_facebook!)
  const socialTiktok = computed(() => settingsState.value.social_tiktok || defaultSettings.social_tiktok!)
  const socialYoutube = computed(() => settingsState.value.social_youtube || defaultSettings.social_youtube!)
  const logo = computed(() => settingsState.value.logo || defaultSettings.logo!)
  const logoDark = computed(() => settingsState.value.logo_dark || defaultSettings.logo_dark!)
  const headerCtaText = computed(() => settingsState.value.header_cta_text || defaultSettings.header_cta_text!)
  const headerCtaLink = computed(() => settingsState.value.header_cta_link || defaultSettings.header_cta_link!)
  const headerNav = computed(() => settingsState.value.header_nav || defaultSettings.header_nav!)
  const footerCompanyName = computed(() => settingsState.value.footer_company_name || defaultSettings.footer_company_name!)
  const footerTaxId = computed(() => settingsState.value.footer_tax_id || defaultSettings.footer_tax_id!)
  const footerAboutText = computed(() => settingsState.value.footer_about_text || defaultSettings.footer_about_text!)
  const footerCopyright = computed(() => settingsState.value.footer_copyright || defaultSettings.footer_copyright!)
  const footerExploreLinks = computed(() => settingsState.value.footer_explore_links || defaultSettings.footer_explore_links!)
  const footerServicesLinks = computed(() => settingsState.value.footer_services_links || defaultSettings.footer_services_links!)
  const generalSettings = computed(() => settingsState.value.general_settings || {})
  const siteTitle = computed(() => generalSettings.value?.site_title || settingsState.value.site_title || defaultSettings.site_title!)
  const siteDescription = computed(() => generalSettings.value?.meta_description || settingsState.value.site_description || defaultSettings.site_description!)
  const seoKeywords = computed(() => generalSettings.value?.meta_keywords || settingsState.value.seo_keywords || defaultSettings.seo_keywords!)
  const seoOgImage = computed(() => generalSettings.value?.og_image || settingsState.value.seo_og_image || defaultSettings.seo_og_image!)
  const metaAuthor = computed(() => generalSettings.value?.meta_author || 'CÔNG TY CỔ PHẦN ĐẦU TƯ XÂY DỰNG WECONS')
  const ogSiteName = computed(() => generalSettings.value?.og_site_name || 'WECONS JSC - wecons.vn')
  const ogTitle = computed(() => generalSettings.value?.og_title || siteTitle.value)
  const ogDescription = computed(() => generalSettings.value?.og_description || siteDescription.value)
  const ogImage = computed(() => generalSettings.value?.og_image || seoOgImage.value || '/images/logo.png')
  const twitterCard = computed(() => generalSettings.value?.twitter_card || 'summary_large_image')
  const twitterTitle = computed(() => generalSettings.value?.twitter_title || ogTitle.value)
  const twitterDescription = computed(() => generalSettings.value?.twitter_description || ogDescription.value)
  const twitterImage = computed(() => generalSettings.value?.twitter_image || ogImage.value)
  const geoPlacename = computed(() => generalSettings.value?.geo_placename || 'Quận 1, Thành phố Hồ Chí Minh')
  const geoRegion = computed(() => generalSettings.value?.geo_region || 'VN-SG')
  const geoPosition = computed(() => generalSettings.value?.geo_position || '10.7678;106.6859')
  const geoIcbm = computed(() => generalSettings.value?.geo_icbm || '10.7678, 106.6859')
  const gtagId = computed(() => generalSettings.value?.gtag_id || 'G-1JMDD7P3N3')
  const ahrefsKey = computed(() => generalSettings.value?.ahrefs_analytics_key || settingsState.value.ahrefs_analytics_key || '1inyAPLurw5U9kqE9BIvuQ')
  const ahrefsEnabled = computed(() => {
    const val = generalSettings.value?.ahrefs_analytics_enabled ?? settingsState.value.ahrefs_analytics_enabled
    if (val === undefined || val === null || val === '') return true
    return val === true || val === 1 || val === '1' || val === 'true'
  })
  const ahrefsSrc = computed(() => generalSettings.value?.ahrefs_analytics_src || settingsState.value.ahrefs_analytics_src || 'https://analytics.ahrefs.com/analytics.js')
  const ahrefsCustomScript = computed(() => generalSettings.value?.ahrefs_custom_script || settingsState.value.ahrefs_custom_script || '')
  const heroTitle = computed(() => settingsState.value.hero_title || defaultSettings.hero_title!)
  const heroSubtitle = computed(() => settingsState.value.hero_subtitle || defaultSettings.hero_subtitle!)
  const heroBannerImage = computed(() => settingsState.value.hero_banner_image || null)
  const heroVideoUrl = computed(() => settingsState.value.hero_video_url || defaultSettings.hero_video_url!)
  const trustIntroImage = computed(() => settingsState.value.trust_intro_image || defaultSettings.trust_intro_image!)
  const homeValues = computed(() => settingsState.value.home_values || defaultSettings.home_values!)
  const aboutOverview = computed(() => settingsState.value.about_overview || defaultSettings.about_overview!)
  const aboutPortfolio = computed(() => settingsState.value.about_portfolio || defaultSettings.about_portfolio!)
  const aboutStory = computed(() => settingsState.value.about_story || defaultSettings.about_story!)
  const companyValues = computed(() => settingsState.value.company_values || defaultSettings.company_values!)
  const serviceHighlights = computed(() => settingsState.value.service_highlights || defaultSettings.service_highlights!)
  const processSteps = computed(() => settingsState.value.process_steps || defaultSettings.process_steps!)
  const metrics = computed(() => settingsState.value.metrics || defaultSettings.metrics!)
  const defaultPageBanner = computed(() => settingsState.value.default_page_banner || defaultSettings.default_page_banner || '/images/pg.webp')
  const defaultPageBannerMobile = computed(() => settingsState.value.default_page_banner_mobile || defaultSettings.default_page_banner_mobile || '/images/pg-mobile.webp')
  const aboutBanner = computed(() => settingsState.value.about_banner || defaultSettings.about_banner || '/images/bg-3.webp')
  const projectsBanner = computed(() => settingsState.value.projects_banner || defaultSettings.projects_banner || '/images/pg.webp')
  const servicesBanner = computed(() => settingsState.value.services_banner || defaultSettings.services_banner || '/images/pg.webp')
  const pricingBanner = computed(() => settingsState.value.pricing_banner || defaultSettings.pricing_banner || '/images/pg.webp')
  const newsBanner = computed(() => settingsState.value.news_banner || defaultSettings.news_banner || '/images/pg.webp')
  const contactBanner = computed(() => settingsState.value.contact_banner || defaultSettings.contact_banner || '/images/pg.webp')
  const contactSidebarImage = computed(() => settingsState.value.contact_sidebar_image || defaultSettings.contact_sidebar_image || '/images/image-3.webp')

  return {
    settings: settingsState,
    isLoaded,
    apiServiceHighlights,
    fetchSettings,
    hotline,
    phoneSecondary,
    contactEmail,
    address,
    workingHours,
    mapIframe,
    socialZalo,
    socialFacebook,
    socialTiktok,
    socialYoutube,
    logo,
    logoDark,
    headerCtaText,
    headerCtaLink,
    headerNav,
    footerCompanyName,
    footerTaxId,
    footerAboutText,
    footerCopyright,
    footerExploreLinks,
    footerServicesLinks,
    siteTitle,
    siteDescription,
    seoKeywords,
    seoOgImage,
    generalSettings,
    metaAuthor,
    ogSiteName,
    ogTitle,
    ogDescription,
    ogImage,
    twitterCard,
    twitterTitle,
    twitterDescription,
    twitterImage,
    geoPlacename,
    geoRegion,
    geoPosition,
    geoIcbm,
    gtagId,
    ahrefsKey,
    ahrefsEnabled,
    ahrefsSrc,
    ahrefsCustomScript,
    heroTitle,
    heroSubtitle,
    heroBannerImage,
    heroVideoUrl,
    trustIntroImage,
    homeValues,
    aboutOverview,
    aboutPortfolio,
    aboutStory,
    companyValues,
    serviceHighlights,
    processSteps,
    metrics,
    defaultPageBanner,
    defaultPageBannerMobile,
    aboutBanner,
    projectsBanner,
    servicesBanner,
    pricingBanner,
    newsBanner,
    contactBanner,
    contactSidebarImage,
  }
}
