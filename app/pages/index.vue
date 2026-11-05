<template>
  <div ref="homePage" class="home-page" :class="{ 'motion-reveal-enabled': revealEnabled }">
    <HomeHero />
    <HomeServicesProjects />
    <div class="home-journal-estimate">
      <LazyHomeGalleryJournal />
      <LazyHomeEstimateCalculator />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useSiteSettings } from '~/composables/useSiteSettings'
import { useNavigation } from '~/composables/useNavigation'
import { buildOrganizationJsonLd } from '~/utils/seoHelper'
import HomeHero from '~/components/home/HomeHero.vue'
import HomeServicesProjects from '~/components/home/HomeServicesProjects.vue'

const { t } = useI18n()
const homePage = ref<HTMLElement | null>(null)
const revealEnabled = ref(false)
let revealObserver: IntersectionObserver | undefined
let revealMutationObserver: MutationObserver | undefined
let serviceCardRevealObserver: IntersectionObserver | undefined
let motionPreference: MediaQueryList | undefined

const revealTargetSelector = [
  '.trust-strip',
  '.section:not(.hero-section):not(.services-section)',
  '.services-section > .section-heading',
  '.services-section > .services-mobile-title',
  '.services-section > .services-section-intro',
  '.work-motion',
  '.consultation-section',
  '.projects-section',
  '.completed-project-section',
  '.trust-item',
  '.metric-note',
  '.intro-image-wrap',
  '.intro-copy',
  '.value-item',
  '.benefits-heading',
  '.benefit-item',
  '.completed-project-list',
  '.completed-project-item',
  '.completed-project-preview',
  '.completed-project-selected-title',
  '.projects-section > h2',
  '.projects-section > .project-slider',
  '.projects-section > .projects-cta',
  '.work-motion > .work-motion-eyebrow',
  '.work-motion-frame',
  '.consultation-inner > *',
  '.home-estimate-section > .section-heading',
  '.home-estimate-panel > *',
  '.home-estimate-field',
  '.calculator-fieldset',
  '.journal-section .section-heading',
  '.journal-category-nav',
  '.journal-card',
].join(', ')

function markRevealTargets(root: ParentNode, reset = false): HTMLElement[] {
  const targets = [...root.querySelectorAll<HTMLElement>(revealTargetSelector)]
  if (root instanceof HTMLElement && root.matches(revealTargetSelector)) {
    targets.unshift(root)
  }
  const siblingIndexes = new Map<HTMLElement, number>()

  targets.forEach((target) => {
    if (reset) target.classList.remove('is-revealed')
    target.classList.add('motion-reveal-target')

    const parent = target.parentElement
    if (!parent) return

    const index = siblingIndexes.get(parent) ?? 0
    siblingIndexes.set(parent, index + 1)
    target.style.setProperty('--motion-reveal-delay', `${Math.min(index, 4) * 80}ms`)
  })

  return targets
}

function markServiceCards(root: ParentNode, reset = false): HTMLElement[] {
  const cards = [...root.querySelectorAll<HTMLElement>('.service-grid > .service-card')]
  if (root instanceof HTMLElement && root.matches('.service-grid > .service-card')) {
    cards.unshift(root)
  }

  cards.forEach((card) => {
    if (reset) card.classList.remove('is-revealed')
    card.classList.add('motion-reveal-target')
    card.style.setProperty('--motion-reveal-delay', '0ms')
  })

  return cards
}

function setupSectionReveal(): void {
  const page = homePage.value
  if (!page || !('IntersectionObserver' in window) || motionPreference?.matches) return

  revealObserver?.disconnect()
  revealMutationObserver?.disconnect()
  serviceCardRevealObserver?.disconnect()
  const targets = markRevealTargets(page, true)
  const serviceCards = markServiceCards(page, true)
  revealEnabled.value = true

  void nextTick(() => {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed')
          revealObserver?.unobserve(entry.target)
        }
      })
    }, { threshold: 0, rootMargin: '0px 0px 100px 0px' })

    targets.forEach(target => revealObserver?.observe(target))
    serviceCardRevealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio >= 0.08) {
          entry.target.classList.add('is-revealed')
          serviceCardRevealObserver?.unobserve(entry.target)
        }
      })
    }, { threshold: 0.08 })

    serviceCards.forEach(card => serviceCardRevealObserver?.observe(card))
    revealMutationObserver = new MutationObserver((records) => {
      records.forEach(({ addedNodes }) => {
        addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            markRevealTargets(node).forEach(target => revealObserver?.observe(target))
            markServiceCards(node).forEach(card => serviceCardRevealObserver?.observe(card))
          }
        })
      })
    })
    revealMutationObserver.observe(page, { childList: true, subtree: true })
  })
}

function updateMotionPreference(event: MediaQueryListEvent): void {
  if (event.matches) {
    revealObserver?.disconnect()
    revealMutationObserver?.disconnect()
    serviceCardRevealObserver?.disconnect()
    revealEnabled.value = false
    return
  }

  setupSectionReveal()
}

onMounted(() => {
  motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
  motionPreference.addEventListener('change', updateMotionPreference)
  setupSectionReveal()
})

onBeforeUnmount(() => {
  revealObserver?.disconnect()
  revealMutationObserver?.disconnect()
  serviceCardRevealObserver?.disconnect()
  motionPreference?.removeEventListener('change', updateMotionPreference)
})

const { siteUrl } = useNavigation()
const { footerCompanyName, hotline, address, footerTaxId, logo } = useSiteSettings()

useHead({
  script: [
    {
      type: 'application/ld+json',
      textContent: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: footerCompanyName.value || 'WECONS',
        url: `${siteUrl.replace(/\/$/, '')}/`,
        publisher: {
          '@id': 'https://wecons.vn/#organization',
        },
      }),
    },
  ],
})

const cmsPage = await useCmsPageMeta('home', {
  title: computed(() => t('home.meta_title')),
  description: computed(() => t('home.meta_desc')),
})
</script>
