import { fileURLToPath } from 'node:url'

const primaryGtagId = (process.env.NUXT_PUBLIC_GTAG_ID || 'G-1JMDD7P3N3')
  .split(',')[0]
  ?.trim() || 'G-1JMDD7P3N3'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  future: {
    compatibilityVersion: 4
  },

  features: {
    inlineStyles: true
  },

  css: ['~/assets/css/home.css'],

  alias: {
    '~/app': fileURLToPath(new URL('./app', import.meta.url)),
    '@/app': fileURLToPath(new URL('./app', import.meta.url))
  },

  devtools: { enabled: false },

  experimental: {
    payloadExtraction: true,
    viewTransition: true
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: {
        id: 'Head1',
        lang: 'vi',
        prefix: 'og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# article: http://ogp.me/ns/article#'
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1.0, maximum-scale=2.0, user-scalable=1',
      meta: [
        { 'http-equiv': 'Content-Type', content: 'text/html; charset=utf-8' },
        { 'http-equiv': 'Cache-control', content: 'public' },
        { name: 'robots', content: 'index,follow' },
        { name: 'googlebot', content: 'index,follow' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'vi_VN' },
        { name: 'distribution', content: 'Global' },
        { name: 'RATING', content: 'GENERAL' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', href: '/images/logo.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400..700&family=Inter:wght@400..700&display=swap'
        },
        {
          rel: 'preload',
          as: 'image',
          type: 'image/webp',
          href: '/images/pg-mobile.webp',
          media: '(max-width: 768px)',
          fetchpriority: 'high'
        },
        {
          rel: 'preload',
          as: 'image',
          type: 'image/webp',
          href: '/images/pg.webp',
          media: '(min-width: 769px)',
          fetchpriority: 'high'
        },
        { rel: 'preconnect', href: 'https://cdnjs.cloudflare.com', crossorigin: '' },
        { rel: 'dns-prefetch', href: 'https://cdnjs.cloudflare.com' },
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css'
        }
      ],
      script: [
        {
          type: 'text/javascript',
          innerHTML: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());function loadGtm(){if(window._gtmLoaded)return;window._gtmLoaded=true;var s=document.createElement('script');s.src='https://www.googletagmanager.com/gtag/js?id=${primaryGtagId}';s.async=true;document.head.appendChild(s);var cd=(window.location.hostname.endsWith('wecons.vn')?'wecons.vn':'auto');gtag('config','${primaryGtagId}',{cookie_domain:cd});}if('requestIdleCallback' in window){requestIdleCallback(loadGtm,{timeout:4000});}else{window.addEventListener('load',function(){setTimeout(loadGtm,3000);});}['scroll','mousemove','touchstart','click','keydown'].forEach(function(e){window.addEventListener(e,loadGtm,{once:true,passive:true});});`
        }
      ]
    }
  },

  runtimeConfig: {
    blogApiKey: process.env.KEY_API || '',
    cmsApiBase: process.env.NUXT_CMS_API_BASE || 'https://api.wecons.vn/api/v1',
    public: {
      gtagId: primaryGtagId,
      ahrefsKey: process.env.NUXT_PUBLIC_AHREFS_KEY || '1inyAPLurw5U9kqE9BIvuQ',
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://api.wecons.vn/api/v1',
      adminUrl: process.env.NUXT_PUBLIC_ADMIN_URL || 'https://admin.wecons.vn',
      storageBaseUrl: process.env.NUXT_PUBLIC_STORAGE_BASE_URL || (process.env.NUXT_PUBLIC_ADMIN_URL ? `${process.env.NUXT_PUBLIC_ADMIN_URL.replace(/\/$/, '')}/storage` : 'https://admin.wecons.vn/storage'),
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://wecons.vn',
      siteName: process.env.NUXT_PUBLIC_SITE_NAME || 'WECONS JSC',
      menuSlug: process.env.NUXT_PUBLIC_MENU_SLUG || 'main-menu'
    }
  },

  nitro: {
    compressPublicAssets: true,
    minify: true
  },

  routeRules: {
    '/': { swr: 1800 },
    '/gioi-thieu': { swr: 3600 },
    '/du-an': { swr: 1800 },
    '/du-an/**': { swr: 1800 },
    '/dich-vu': { swr: 3600 },
    '/dich-vu/**': { swr: 3600 },
    '/tin-tuc': { swr: 1800 },
    '/tin-tuc/**': { swr: 1800 },
    '/bai-viet/**': { swr: 1800 },
    '/bao-gia': { swr: 3600 },
    '/lien-he': { swr: 3600 },
    '/process': { swr: 3600 },
    '/consultation': { swr: 3600 },
    '/pricing': { swr: 3600 },
    '/danh-muc-san-pham/**': { swr: 1800 },
    '/api-proxy/**': {
      cache: {
        maxAge: 300,
        swr: true
      }
    },
    '/blog-api/**': {
      cache: {
        maxAge: 300,
        swr: true
      }
    },
    '/cms-page-api/**': {
      cache: {
        maxAge: 300,
        swr: true
      }
    },
    '/projects': { redirect: { to: '/du-an', statusCode: 301 } },
    '/projects/**': { redirect: { to: '/du-an/**', statusCode: 301 } },
    '/danh-muc-dich-vu': { redirect: { to: '/dich-vu', statusCode: 301 } },
    '/danh-muc-dich-vu/**': { redirect: { to: '/dich-vu/**', statusCode: 301 } },
    '/san-pham': { redirect: { to: '/danh-muc-san-pham', statusCode: 301 } },
    '/san-pham/**': { redirect: { to: '/danh-muc-san-pham/**', statusCode: 301 } },
    '/danh-muc-bai-viet': { redirect: { to: '/tin-tuc', statusCode: 301 } },
    '/danh-muc-bai-viet/**': { redirect: { to: '/tin-tuc', statusCode: 301 } },
    '/bai-viet': { redirect: { to: '/tin-tuc', statusCode: 301 } },
    '/bai-viet/**': { redirect: { to: '/tin-tuc/**', statusCode: 301 } },
    '/blog': { redirect: { to: '/tin-tuc', statusCode: 301 } },
    '/blog/**': { redirect: { to: '/tin-tuc/**', statusCode: 301 } },
    '/sitemap.xml': {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=14400'
      }
    },
    '/_nuxt/**': {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    },
    '/images/**': {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    },
    '/favicon.ico': {
      headers: {
        'Cache-Control': 'public, max-age=604800, s-maxage=2592000'
      }
    },
    '/api/**': {
      proxy: (process.env.BACKEND_API_INTERNAL_URL || 'http://backend:80/api') + '/**'
    }
  }
})
