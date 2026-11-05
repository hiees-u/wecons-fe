<template>
  <main class="process-page">
    <EditorialPageHero
      title-id="process-title"
      :eyebrow="t('process_page.hero_eyebrow')"
      :title="t('process_page.hero_title')"
      :title-accent="t('process_page.hero_title_accent')"
      :description="t('process_page.hero_desc')"
      :image="settings?.default_page_banner || '/images/pg.webp'"
      :image-mobile="settings?.default_page_banner_mobile || '/images/pg-mobile.webp'"
      :image-alt="t('process_page.hero_image_alt')"
      :cta-label="t('process_page.hero_cta')"
      cta-to="/lien-he#consultation-form"
      :caption="t('process_page.hero_caption')"
    />

    <section class="process-content">
      <div class="process-heading">
        <p class="eyebrow"><span></span> {{ t('process_page.section_eyebrow') }}</p>
        <h2>{{ t('process_page.section_title') }}<br><em>{{ t('process_page.section_title_accent') }}</em></h2>
        <p>{{ t('process_page.section_desc') }}</p>
      </div>
      <ProcessTimeline :steps="processDetails" />
    </section>

    <section class="process-end">
      <p>{{ t('process_page.end_text') }}</p>
      <NuxtLink class="text-link" to="/lien-he#consultation-form">
        {{ t('process_page.end_cta') }} <span aria-hidden="true">↗</span>
      </NuxtLink>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import EditorialPageHero from '~/components/EditorialPageHero.vue'
import ProcessTimeline from '~/components/process/ProcessTimeline.vue'
import pageData from '~/data/pageContent.json'
import type { ProcessDetail } from '~/types/content'
import { useNavigation } from '~/composables/useNavigation'
import { useI18n } from '~/composables/useI18n'
import { useSiteSettings } from '~/composables/useSiteSettings'

const { t } = useI18n()
const { processSteps, settings } = useSiteSettings()
const processDetails = computed(() => (processSteps.value?.length ? processSteps.value : pageData.processDetails as ProcessDetail[]))

const { siteUrl } = useNavigation()
const title = t('process_page.meta_title')
const description = t('process_page.meta_desc')
const canonicalUrl = `${siteUrl.replace(/\/$/, '')}/process`

useHead({
  meta: [
    { property: 'og:url', content: canonicalUrl },
  ],
  link: [{ rel: 'canonical', href: canonicalUrl }],
  script: [
    {
      type: 'application/ld+json',
      textContent: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: title,
        description: description,
        url: canonicalUrl,
        publisher: {
          '@id': 'https://wecons.vn/#organization',
        },
      }),
    },
  ],
})

await useCmsPageMeta('process', { title, description })
</script>

<style scoped>
.process-page { --page-gutter: clamp(22px,5.4vw,78px); overflow: clip; background: var(--color-bg); color: var(--color-text); }
.process-content { display: grid; grid-template-columns: minmax(240px,.72fr) minmax(0,1.28fr); gap: clamp(45px,9vw,125px); width: min(1280px,calc(100% - var(--page-gutter)*2)); margin: 0 auto; padding: clamp(85px,10vw,140px) 0; }
.eyebrow { display: flex; align-items: center; gap: 12px; color: var(--color-gold); font-size: 9px; font-weight: 600; letter-spacing: 1.7px; }
.eyebrow > span { width: 30px; height: 1px; background: currentColor; }
.process-heading h2 { margin-top: 18px; color: var(--color-text); font-size: clamp(36px,4.4vw,58px); font-weight: 500; letter-spacing: -1.8px; line-height: 1.13; }
.process-heading h2 em { color: var(--color-champagne); font-family: var(--font-serif); font-weight: 400; }
.process-heading > p:last-child { max-width: 390px; margin-top: 19px; color: var(--color-muted); font-size: 12px; line-height: 1.9; }
.process-end { display: flex; justify-content: space-between; align-items: center; gap: 24px; padding: 35px max(var(--page-gutter),calc((100vw - 1280px)/2)); border-top: 1px solid var(--color-border); background: #141414; }
.process-end > p { color: var(--color-text); font-size: 16px; }
@media(max-width:760px) { .process-content { grid-template-columns: 1fr; gap: 35px; } }
@media(max-width:600px) { .process-end { align-items: flex-start; flex-direction: column; } }
</style>
