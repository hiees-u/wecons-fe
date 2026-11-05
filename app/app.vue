<template>
  <div class="we-app font-pair-be-vietnam-inter">
    <NuxtLoadingIndicator color="#D4AF37" :height="2" :throttle="50" />
    <AppHeader />
    <main class="main-content">
      <NuxtPage />
    </main>
    <AppFooter />
    <AppFloatingContacts />
    <AppScrollToTop />
    <CustomCursor />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useSiteSettings } from '~/composables/useSiteSettings'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import AppFloatingContacts from './components/AppFloatingContacts.vue'
import AppScrollToTop from './components/AppScrollToTop.vue'
import CustomCursor from './components/CustomCursor.vue'

const { initLocale, t } = useI18n()
const route = useRoute()
const siteUrl = 'https://wecons.vn'
const canonicalUrl = computed(() => {
  const rawPath = route.path || '/'
  if (rawPath === '/' || rawPath === '') {
    return `${siteUrl}/`
  }
  const cleanPath = rawPath.replace(/\/+$/, '')
  return `${siteUrl}${cleanPath}`
})

const {
  siteTitle,
  siteDescription,
  seoKeywords,
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
  ahrefsKey,
  ahrefsEnabled,
  ahrefsSrc,
  generalSettings,
  settings
} = useSiteSettings()

useHead(() => {
  const gs = generalSettings.value || {}
  const companyName = gs.company_name || 'CÔNG TY CỔ PHẦN ĐẦU TƯ XÂY DỰNG WECONS'
  const legalName = gs.company_legal_name || companyName
  const altNames = typeof gs.company_alternate_names === 'string'
    ? gs.company_alternate_names.split('\n').map((s: string) => s.trim()).filter(Boolean)
    : ['WECONS CONSTRUCTION INVESTMENT JOINT STOCK COMPANY', 'WECONS JSC', 'WE Construction']
  const sameAsList = typeof gs.company_same_as === 'string'
    ? gs.company_same_as.split('\n').map((s: string) => s.trim()).filter(Boolean)
    : []

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@id': 'https://wecons.vn/#organization',
    '@type': ['Corporation', 'GeneralContractor'],
    name: companyName,
    legalName: legalName,
    alternateName: altNames.length ? altNames : undefined,
    taxID: gs.company_tax_id || '0305361561',
    foundingDate: gs.company_founding_date || '2007-11-28',
    url: 'https://wecons.vn/',
    logo: ogImage.value || 'https://wecons.vn/images/logo.png',
    image: ogImage.value || 'https://wecons.vn/images/logo.png',
    description: siteDescription.value,
    telephone: gs.company_telephone || '+84903006985',
    faxNumber: gs.company_fax || '+842839208137',
    email: gs.company_email || 'info@wecons.vn',
    priceRange: '$$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: gs.company_street_address || 'Tầng 3, 14B-C Cống Quỳnh, Phường Nguyễn Cư Trinh',
      addressLocality: gs.company_address_locality || 'Quận 1',
      addressRegion: gs.company_address_region || 'Thành phố Hồ Chí Minh',
      postalCode: gs.company_postal_code || '700000',
      addressCountry: gs.company_country || 'VN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: gs.company_latitude || '10.7678',
      longitude: gs.company_longitude || '106.6859'
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: gs.company_telephone || '+84903006985',
        contactType: 'customer service',
        areaServed: 'VN',
        availableLanguage: ['vi', 'en']
      }
    ],
    sameAs: sameAsList.length ? sameAsList : [
      'https://www.facebook.com/',
      'https://zalo.me/0903006985'
    ]
  }

  return {
    titleTemplate: (titleChunk) => {
      if (!titleChunk) return siteTitle.value || 'WECONS | Thiết Kế & Thi Công Xây Dựng Trọn Gói'
      let clean = titleChunk.trim()
      if (clean.length > 60) {
        clean = clean.slice(0, 57).replace(/[\s|–-]+[^\s]*$/, '')
      }
      if (/wecons|we construction/i.test(clean)) return clean
      const combined = `${clean} | WECONS`
      return combined.length <= 60 ? combined : clean
    },
    meta: [
      { name: 'author', content: metaAuthor.value },
      { name: 'description', content: siteDescription.value },
      { name: 'keywords', content: seoKeywords.value || t('common.default_keywords') },
      { property: 'og:site_name', content: ogSiteName.value },
      { property: 'og:url', content: canonicalUrl.value },
      { property: 'og:title', content: ogTitle.value },
      { property: 'og:description', content: ogDescription.value },
      { property: 'og:image', content: ogImage.value },
      { property: 'og:image:secure_url', content: ogImage.value },
      { name: 'twitter:card', content: twitterCard.value },
      { name: 'twitter:title', content: twitterTitle.value },
      { name: 'twitter:description', content: twitterDescription.value },
      { name: 'twitter:image', content: twitterImage.value },
      { name: 'geo.region', content: geoRegion.value },
      { name: 'geo.placename', content: geoPlacename.value },
      { name: 'geo.position', content: geoPosition.value },
      { name: 'ICBM', content: geoIcbm.value },
      { itemprop: 'name', content: companyName } as any,
      { itemprop: 'description', content: siteDescription.value } as any,
      { itemprop: 'image', content: ogImage.value } as any,
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: settings.value?.favicon || '/favicon.ico' },
      { rel: 'canonical', href: canonicalUrl.value },
      { rel: 'alternate', hreflang: 'vi', href: canonicalUrl.value },
      { rel: 'alternate', hreflang: 'x-default', href: canonicalUrl.value },
    ],
    script: [
      ...(ahrefsEnabled.value && ahrefsKey.value ? [{
        src: ahrefsSrc.value || 'https://analytics.ahrefs.com/analytics.js',
        'data-key': ahrefsKey.value,
        async: true
      }] : []),
      {
        type: 'application/ld+json',
        textContent: JSON.stringify(organizationSchema)
      }
    ]
  }
})

onMounted(() => {
  initLocale()
})
</script>

<style>
:root {
  --color-bg: #090909;
  --color-bg-soft: #141414;
  --color-surface: #1b1b1b;
  --color-gold: #d6b36a;
  --color-gold-hover: #e7c986;
  --color-champagne: #e8d6ae;
  --color-text: #f5f2eb;
  --color-muted: #aaa7a0;
  --color-subtle: #77746f;
  --color-border: rgba(214, 179, 106, 0.2);
  /* Typography mac dinh ban dau: Be Vietnam Pro + Inter */
  --font-sans: Inter, "Be Vietnam Pro", "Segoe UI", Arial, sans-serif;
  --font-heading: "Be Vietnam Pro", Inter, "Segoe UI", Arial, sans-serif;
  --font-serif: "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif;
  /* Perkins&Will Stack (Ghi chu tham khao):
     --font-sans: "PWCentraNo2", "PWC-Medium", Inter, "Be Vietnam Pro", "Segoe UI", Arial, sans-serif;
     --font-heading: "PWCentraNo2", "PWC-Bold", "Be Vietnam Pro", Inter, "Segoe UI", Arial, sans-serif;
     --font-serif: "PWSerif", "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif; */
  --type-home-hero: 64px;
  --type-service-hero: 48px;
  --type-article-title: 38px;
  --type-h2: 32px;
  --type-h3: 24px;
  --type-h4: 20px;
  --type-service-body: 18px;
  --type-article-body: 18px;
  --type-nav: 15px;
  --type-nav-mobile: 16px;
  --type-cta: 16px;
  --type-caption: 14px;
}

.font-pair-be-vietnam-inter {
  --font-sans: Inter, "Be Vietnam Pro", "Segoe UI", Arial, sans-serif;
  --font-heading: "Be Vietnam Pro", Inter, "Segoe UI", Arial, sans-serif;
}

.font-pair-inter {
  --font-sans: Inter, "Segoe UI", Arial, sans-serif;
  --font-heading: Inter, "Segoe UI", Arial, sans-serif;
}

@media (max-width: 820px) {
  :root {
    --type-home-hero: 36px;
    --type-service-hero: 32px;
    --type-article-title: 30px;
    --type-h2: 26px;
    --type-h3: 20px;
    --type-h4: 18px;
    --type-service-body: 16px;
    --type-article-body: 16px;
    --type-nav: 16px;
    --type-cta: 16px;
    --type-caption: 13px;
  }
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-padding-top: 92px;
}

body {
  font-family: var(--font-sans);
  color: var(--color-text);
  background-color: var(--color-bg);
  line-height: 1.5;
}

h2,
h3,
h4 {
  font-family: var(--font-heading);
  font-weight: 600;
}

h2 {
  font-size: var(--type-h2);
}

h3 {
  font-size: var(--type-h3);
}

h4 {
  font-size: var(--type-h4);
}

button,
input,
select,
textarea {
  font: inherit;
}

button,
a {
  -webkit-tap-highlight-color: transparent;
}

.we-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}

/* Smooth Page Transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.22s cubic-bezier(0.4, 0, 0.2, 1), transform 0.22s cubic-bezier(0.4, 0, 0.2, 1);
}
.page-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
