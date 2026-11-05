export interface SeoMetadataOptions {
  title: string
  description: string
  image?: string
  url?: string
  type?: 'website' | 'article'
  keywords?: string
  publishedTime?: string
  modifiedTime?: string
}

export function buildSeoMeta(options: SeoMetadataOptions) {
  const {
    title,
    description,
    image = '/images/logo.png',
    url = '/',
    type = 'website',
    keywords = 'wecons, xây dựng, kiến trúc, nội thất, thiết kế thi công',
    publishedTime,
    modifiedTime,
  } = options

  return {
    title,
    meta: [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      // Open Graph
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: type },
      { property: 'og:url', content: url },
      { property: 'og:image', content: image },
      { property: 'og:site_name', content: 'WECONS' },
      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
      ...(publishedTime ? [{ property: 'article:published_time', content: publishedTime }] : []),
      ...(modifiedTime ? [{ property: 'article:modified_time', content: modifiedTime }] : []),
    ],
    link: [
      { rel: 'canonical', href: url },
    ],
  }
}

export function buildOrganizationJsonLd(settings?: {
  name?: string
  url?: string
  logo?: string
  hotline?: string
  address?: string
  taxId?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    name: settings?.name || 'CÔNG TY CỔ PHẦN XÂY DỰNG WECONS',
    alternateName: 'WECONS JSC',
    url: settings?.url || '/',
    logo: settings?.logo || '/images/logo.png',
    telephone: settings?.hotline || '+84 353 34 93 92',
    taxID: settings?.taxId || '0305361561',
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings?.address || '148-B Cống Quỳnh, Phường Phạm Ngũ Lão, Quận 1',
      addressLocality: 'Hồ Chí Minh',
      addressCountry: 'VN',
    },
    sameAs: [
      'https://www.facebook.com/',
      'https://zalo.me/0903006985',
    ],
  }
}
