<template>
  <main
    ref="consultationPage"
    class="consultation-page"
    :class="{ 'motion-reveal-enabled': revealEnabled }"
  >
    <EditorialPageHero
      title-id="contact-title"
      compact
      :breadcrumb-home="t('nav.home')"
      :breadcrumb-label="t('consultation_page.banner_title')"
      :eyebrow="t('consultation_page.hero_eyebrow')"
      :title="t('consultation_page.banner_title')"
      :description="t('consultation_page.hero_desc')"
      :image="cmsPage?.image || settings?.contact_banner || '/images/pg.webp'"
      :image-mobile="cmsPage?.image || settings?.default_page_banner_mobile || '/images/pg-mobile.webp'"
      :image-alt="t('consultation_page.hero_title_1')"
    />

    <section class="consultation-form-section" aria-labelledby="consultation-form-title">
      <div class="consultation-form-layout">
        <div class="consultation-form-copy">
          <header class="contact-form-heading contact-reveal-target">
            <h2 id="consultation-form-title">{{ t('contact_page.form_title') }}</h2>
            <p>{{ t('contact_page.form_intro') }}</p>
          </header>
          <ConsultationLeadForm />
        </div>

        <ContactInfoSidebar :image="settings?.contact_sidebar_image || '/images/image-3.webp'" />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import EditorialPageHero from '~/components/EditorialPageHero.vue'
import ConsultationLeadForm from '~/components/consultation/ConsultationLeadForm.vue'
import ContactInfoSidebar from '~/components/contact/ContactInfoSidebar.vue'
import { useNavigation } from '~/composables/useNavigation'
import { useI18n } from '~/composables/useI18n'
import { useSiteSettings } from '~/composables/useSiteSettings'
import { buildOrganizationJsonLd } from '~/utils/seoHelper'

const { t } = useI18n()
const { siteUrl } = useNavigation()
const { settings, hotline, contactEmail, address, footerCompanyName, footerTaxId, logo } = useSiteSettings()
const consultationPage = ref<HTMLElement | null>(null)
const revealEnabled = ref(false)
let revealObserver: IntersectionObserver | undefined
let motionPreference: MediaQueryList | undefined

const canonicalUrl = `${siteUrl.replace(/\/$/, '')}/lien-he`
const pageTitle = computed(() => t('consultation_page.meta_title'))
const pageDescription = computed(() => t('consultation_page.meta_desc'))

useHead({
  meta: [
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: canonicalUrl },
  ],
  link: [
    { rel: 'canonical', href: canonicalUrl },
  ],
  script: [
    {
      type: 'application/ld+json',
      textContent: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: pageTitle.value,
        description: pageDescription.value,
        url: canonicalUrl,
        mainEntity: {
          '@id': 'https://wecons.vn/#organization',
        },
      }),
    },
  ],
})

const cmsPage = await useCmsPageMeta('consultation', {
  title: pageTitle,
  description: pageDescription,
})

function setupContactReveal(): void {
  const page = consultationPage.value
  if (!page || !('IntersectionObserver' in window) || motionPreference?.matches) return

  revealObserver?.disconnect()
  const targets = page.querySelectorAll<HTMLElement>([
    '.editorial-hero-copy',
    '.consultation-form-copy',
    '.contact-form-heading',
    '.consultation-field',
    '.consultation-submit',
    '.contact-details-list li',
    '.contact-interior-image',
  ].join(', '))
  const parentIndexes = new Map<HTMLElement, number>()

  targets.forEach((target) => {
    target.classList.add('contact-reveal-target')
    const parent = target.parentElement
    if (!parent) return

    const index = parentIndexes.get(parent) ?? 0
    parentIndexes.set(parent, index + 1)
    target.style.setProperty('--contact-reveal-delay', `${Math.min(index, 4) * 80}ms`)
  })

  revealEnabled.value = true
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed')
        revealObserver?.unobserve(entry.target)
      }
    })
  }, { threshold: 0, rootMargin: '0px 0px 100px 0px' })

  targets.forEach(target => revealObserver?.observe(target))
}

function updateMotionPreference(event: MediaQueryListEvent): void {
  if (event.matches) {
    revealObserver?.disconnect()
    revealEnabled.value = false
    return
  }

  setupContactReveal()
}

onMounted(() => {
  motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
  motionPreference.addEventListener('change', updateMotionPreference)
  setupContactReveal()
})

onBeforeUnmount(() => {
  revealObserver?.disconnect()
  motionPreference?.removeEventListener('change', updateMotionPreference)
})
</script>

<style scoped>
.consultation-page {
  --contact-width: 1515px;
  --contact-gutter: clamp(22px, 5.4vw, 78px);
  overflow: clip;
  background: var(--color-bg);
  color: var(--color-text);
}

.consultation-form-section {
  padding: clamp(30px, 4.2vw, 64px) 0;
  background: #292929;
}

.consultation-form-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(24px, 3vw, 44px);
  width: min(var(--contact-width), calc(100% - var(--contact-gutter) * 2));
  margin: 0 auto;
  align-items: start;
  padding: clamp(24px, 3vw, 46px);
  background: #111110;
}

.consultation-form-copy,
.contact-details {
  min-width: 0;
}

.contact-details {
  background: #2b2b2b;
  padding: 40px;
}

.contact-form-heading {
  margin-bottom: 24px;
}

.contact-form-heading h2 {
  color: var(--color-gold);
  font-family: var(--font-serif);
  font-size: clamp(26px, 3.1vw, 60px);
  font-weight: 400;
  line-height: 1.2;
}

.contact-form-heading p {
  max-width: 620px;
  margin-top: 10px;
  color: var(--color-muted);
  font-size: 18px;
  line-height: 1.7;
}

.consultation-page.motion-reveal-enabled :deep(.contact-reveal-target) {
  opacity: 0;
  transform: translate3d(0, 20px, 0);
  transition:
    opacity 700ms ease,
    transform 700ms cubic-bezier(0.2, 0.65, 0.3, 1);
  transition-delay: var(--contact-reveal-delay, 0ms);
}

.consultation-page.motion-reveal-enabled :deep(.contact-reveal-target.is-revealed) {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

@media (max-width: 900px) {
  .consultation-form-layout {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  @media (prefers-reduced-motion: reduce) {
    .consultation-page.motion-reveal-enabled :deep(.contact-reveal-target) {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }
}

@media (max-width: 600px) {
  .consultation-form-section {
    padding: 24px 0;
  }

  .consultation-form-layout {
    padding: 22px 18px;
  }
}

@media (max-width: 767px) {
  .consultation-form-section {
    padding: 14px 0 24px;
  }

  .consultation-form-layout {
    width: calc(100% - 24px);
    gap: 18px;
    padding: 16px 14px;
    border: 1px solid rgba(214, 179, 106, 0.45);
    background: #141414;
  }

  .contact-form-heading {
    margin-bottom: 14px;
  }

  .contact-form-heading h2 {
    font-size: clamp(21px, 6vw, 26px);
    line-height: 1.25;
  }

  .contact-form-heading p {
    margin-top: 7px;
    font-size: 11px;
    line-height: 1.65;
    text-align: left;
  }

  :deep(.editorial-hero--compact) {
    min-height: clamp(350px, 56svh, 440px);
  }

  :deep(.editorial-hero--compact .editorial-hero-copy) {
    padding: 105px 22px 34px;
  }

  :deep(.editorial-hero--compact h1) {
    color: #fff;
    font-size: clamp(36px, 9vw, 46px);
    letter-spacing: -1.2px;
    text-align: left;
  }

  :deep(.editorial-breadcrumb) {
    gap: 7px;
    margin-bottom: 9px;
    font-size: 10px;
    font-weight: 300;
    letter-spacing: 0;
    text-transform: none;
  }

  :deep(.editorial-breadcrumb a .fa-house) {
    display: none;
  }

  :deep(.editorial-breadcrumb > span[aria-hidden="true"]) {
    font-size: 0;
  }

  :deep(.editorial-breadcrumb > span[aria-hidden="true"]::after) {
    color: rgba(255, 255, 255, 0.72);
    content: "•";
    font-size: 10px;
  }

  :deep(.editorial-breadcrumb [aria-current="page"]) {
    color: rgba(255, 255, 255, 0.86);
  }

  :deep(.consultation-lead-form) {
    gap: 9px;
  }

  :deep(.consultation-field label) {
    margin-bottom: 3px;
    font-size: 10px;
  }

  :deep(.consultation-field-grid) {
    grid-template-columns: 1fr;
    gap: 9px;
  }

  :deep(.consultation-field input),
  :deep(.consultation-field textarea) {
    min-height: 38px;
    padding: 7px 0;
    font-size: 11px;
  }

  :deep(.consultation-field textarea) {
    min-height: 58px;
  }

  :deep(.consultation-submit) {
    min-height: 46px;
    margin-top: 2px;
    padding: 0 14px;
    border-radius: 2px;
    font-size: 10px;
  }

  :deep(.contact-details) {
    gap: 16px;
  }

  :deep(.contact-details-list) {
    gap: 11px;
  }

  :deep(.contact-details-list li) {
    align-items: center;
    gap: 10px;
  }

  :deep(.contact-detail-icon) {
    width: 31px;
    height: 31px;
    border: 1px solid rgba(245, 242, 235, 0.38);
    background: transparent;
  }

  :deep(.contact-detail-icon svg) {
    width: 15px;
    height: 15px;
  }

  :deep(.contact-details-list p) {
    gap: 2px;
    min-width: 0;
    font-size: 11px;
    line-height: 1.45;
    overflow-wrap: anywhere;
  }

  :deep(.contact-details-list strong) {
    font-size: 10px;
    letter-spacing: 0;
    text-transform: none;
  }

  :deep(.contact-interior-image) {
    aspect-ratio: 1.18;
    border: 1px solid rgba(245, 242, 235, 0.22);
    border-radius: 2px;
    object-fit: cover;
  }
}
</style>
