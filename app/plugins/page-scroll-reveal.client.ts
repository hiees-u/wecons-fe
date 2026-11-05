const revealTargetSelector = [
  'main > section',
  'main > article > header',
  'main > article > figure',
  'main > article > section',
  'main > article > aside',
  '.editorial-hero-copy',
  '.quote-content > .quote-section',
  '.quote-calc-field',
  '.quote-calc-summary',
  '.service-list > *',
  '.desktop-service-accordion-item',
  '.service-accordion-item',
  '.projects-grid > *',
  '.article-grid > *',
  '.models-grid > *',
  '.process-timeline > *',
  '.reasons-list > *',
  '.gallery-small-grid > *',
  '.gallery-mobile-grid > *',
  '.article-layout > *',
  '.contact-cards-grid > *',
].join(', ')

export default defineNuxtPlugin((nuxtApp) => {
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
  let revealObserver: IntersectionObserver | undefined
  let mutationObserver: MutationObserver | undefined
  let activePage: HTMLElement | null = null
  let setupFrame = 0
  let secondSetupFrame = 0

  function disconnect(): void {
    revealObserver?.disconnect()
    mutationObserver?.disconnect()
    activePage?.classList.remove('page-reveal-enabled')
    activePage = null
  }

  function markTargets(root: ParentNode, reset = false): HTMLElement[] {
    const targets = [...root.querySelectorAll<HTMLElement>(revealTargetSelector)]
    if (root instanceof HTMLElement && root.matches(revealTargetSelector)) {
      targets.unshift(root)
    }

    targets.forEach((target) => {
      if (reset) target.classList.remove('is-revealed')
      target.classList.add('page-reveal-target')
      const siblingIndex = target.parentElement
        ? Array.prototype.indexOf.call(target.parentElement.children, target)
        : 0
      target.style.setProperty('--page-reveal-delay', `${Math.min(siblingIndex, 4) * 90}ms`)
    })

    return targets
  }

  function observeTargets(root: ParentNode): void {
    markTargets(root).forEach(target => revealObserver?.observe(target))
  }

  function setup(): void {
    setupFrame = 0
    secondSetupFrame = 0
    disconnect()

    if (motionPreference.matches || !('IntersectionObserver' in window)) return

    const page = document.querySelector<HTMLElement>(
      'main:not(.home-page):not(.consultation-page):not(.editorial-page)',
    )
    if (!page) return

    activePage = page
    const targets = markTargets(page, true)
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed')
          revealObserver?.unobserve(entry.target)
        }
      })
    }, { threshold: 0, rootMargin: '0px 0px 100px 0px' })

    page.classList.add('page-reveal-enabled')
    targets.forEach(target => revealObserver?.observe(target))

    mutationObserver = new MutationObserver((records) => {
      records.forEach(({ addedNodes }) => {
        addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) observeTargets(node)
        })
      })
    })
    mutationObserver.observe(page, { childList: true, subtree: true })
  }

  function scheduleSetup(): void {
    if (setupFrame) window.cancelAnimationFrame(setupFrame)
    if (secondSetupFrame) window.cancelAnimationFrame(secondSetupFrame)
    setupFrame = window.requestAnimationFrame(() => {
      secondSetupFrame = window.requestAnimationFrame(setup)
    })
  }

  function updateMotionPreference(): void {
    if (motionPreference.matches) {
      disconnect()
      return
    }
    scheduleSetup()
  }

  motionPreference.addEventListener('change', updateMotionPreference)
  nuxtApp.hook('app:mounted', scheduleSetup)
  nuxtApp.hook('page:finish', scheduleSetup)

  nuxtApp.hook('app:beforeUnmount', () => {
    if (setupFrame) window.cancelAnimationFrame(setupFrame)
    if (secondSetupFrame) window.cancelAnimationFrame(secondSetupFrame)
    motionPreference.removeEventListener('change', updateMotionPreference)
    disconnect()
  })
})
