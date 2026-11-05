<template>
  <section
    id="projects"
    class="projects-section"
    aria-labelledby="featured-projects-title"
  >
    <h2 id="featured-projects-title">{{ t("home.projects.title") }}</h2>

    <div
      ref="projectSlider"
      class="project-slider"
      role="region"
      :aria-label="t('home.projects.title')"
    >
      <button
        class="project-slider-button project-slider-button-prev"
        type="button"
        :aria-label="t('home.projects.previous')"
        @click="navigateProjects(-1)"
      >
        <span aria-hidden="true"><i class="fa-solid fa-chevron-left"></i></span>
      </button>
      <div
        ref="projectTrack"
        class="project-slider-track"
        tabindex="0"
        :aria-label="t('home.projects.slider_instructions')"
        @keydown.left.prevent="navigateProjects(-1)"
        @keydown.right.prevent="navigateProjects(1)"
        @pointerdown="interruptProgrammaticScroll"
        @wheel.passive="interruptProgrammaticScroll"
        @scroll.passive="onProjectScroll"
        @scrollend.passive="onProjectScrollEnd"
      >
        <article
          v-for="(project, index) in loopedProjects"
          :key="`${project.title}-${index}`"
          class="project-card"
          :class="{ 'is-active': index === activeProjectCard }"
          :aria-hidden="Math.abs(index - activeProjectCard) > 1"
        >
          <NuxtLink
            class="project-image"
            :to="project.slug ? `/du-an/${project.slug}` : '/du-an'"
            :tabindex="Math.abs(index - activeProjectCard) <= 1 ? 0 : -1"
            :aria-label="t('home.projects.view_project', { name: project.title })"
          >
            <img
              :src="getOptimizedImageUrl(project.image, 900)"
              :srcset="getImageSrcset(project.image, [480, 800, 1100])"
              sizes="(max-width: 767px) 78vw, (max-width: 1023px) min(40.6vw, 350px), min(48.52vw, 786px)"
              :alt="project.alt"
              :loading="index === safeProjects.length ? 'eager' : 'lazy'"
              :fetchpriority="index === safeProjects.length ? 'high' : 'auto'"
              width="1200"
              height="900"
              @error="onImgError"
            >
            <div class="project-copy">
              <p class="card-kicker">{{ project.category }}</p>
              <h3>{{ project.title }}</h3>
            </div>
          </NuxtLink>
        </article>
      </div>
      <button
        class="project-slider-button project-slider-button-next"
        type="button"
        :aria-label="t('home.projects.next')"
        @click="navigateProjects(1)"
      >
        <span aria-hidden="true"><i class="fa-solid fa-chevron-right"></i></span>
      </button>
    </div>

    <NuxtLink class="projects-cta" to="/du-an">
      {{ t("common.view_all") }} <span aria-hidden="true">↗</span>
    </NuxtLink>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import type { HomeImageItem } from '~/types/content'
import { useI18n } from '~/composables/useI18n'
import { getImageSrcset, getOptimizedImageUrl } from '~/utils/imageHelper'

const props = withDefaults(
  defineProps<{ projects?: HomeImageItem[] }>(),
  {
    projects: () => [],
  },
)
const { t } = useI18n()
const projectSlider = ref<HTMLElement | null>(null)
const projectTrack = ref<HTMLElement | null>(null)
const safeProjects = computed(() => props.projects ?? [])
const loopedProjects = computed(() => [...safeProjects.value, ...safeProjects.value, ...safeProjects.value])

function onImgError(e: Event) {
  const target = e.target as HTMLImageElement
  if (!target) return
  if (target.src.includes('-640xauto.webp')) {
    target.src = target.src.replace('-640xauto.webp', '.webp')
  } else if (!target.dataset.fallbackApplied) {
    target.dataset.fallbackApplied = 'true'
    target.src = '/images/pg.webp'
  }
}
const activeProjectCard = ref(safeProjects.value.length)
const AUTO_SLIDE_DELAY = 5000
let autoSlideTimer: ReturnType<typeof setTimeout> | undefined
let scrollSettleTimer: ReturnType<typeof setTimeout> | undefined
let activeCardFrame = 0
let scrollAnimationFrame = 0
let navigationRevision = 0
let isProgrammaticNavigation = false
let isProjectSliderVisible = false
let prefersReducedMotion = false
let motionPreference: MediaQueryList | undefined
let projectSliderObserver: IntersectionObserver | undefined

function clearAutoSlideTimer(): void {
  if (autoSlideTimer) clearTimeout(autoSlideTimer)
  autoSlideTimer = undefined
}

function scheduleAutoSlide(): void {
  clearAutoSlideTimer()
  if (!isProjectSliderVisible || prefersReducedMotion || document.hidden || safeProjects.value.length < 2) return

  autoSlideTimer = setTimeout(() => {
    autoSlideTimer = undefined
    void navigateProjects(1)
  }, AUTO_SLIDE_DELAY)
}

function getProjectScrollPosition(track: HTMLElement, card: HTMLElement): number {
  const cardCenter = card.getBoundingClientRect().left + card.getBoundingClientRect().width / 2
  const trackCenter = track.getBoundingClientRect().left + track.clientWidth / 2
  return track.scrollLeft + cardCenter - trackCenter
}

async function navigateProjects(direction: number): Promise<void> {
  const track = projectTrack.value
  if (!track || safeProjects.value.length === 0) return

  clearAutoSlideTimer()
  if (scrollAnimationFrame) cancelAnimationFrame(scrollAnimationFrame)
  scrollAnimationFrame = 0
  isProgrammaticNavigation = true
  track.classList.add('is-programmatic-scrolling')

  const projectCount = safeProjects.value.length
  let targetIndex = activeProjectCard.value + direction
  const totalCards = loopedProjects.value.length
  if (targetIndex < 0 || targetIndex >= totalCards) {
    targetIndex = projectCount + ((targetIndex % projectCount) + projectCount) % projectCount
  }

  activeProjectCard.value = targetIndex
  const revision = ++navigationRevision
  await nextTick()
  if (revision !== navigationRevision || projectTrack.value !== track) return

  const card = track.querySelectorAll<HTMLElement>('.project-card')[targetIndex]
  if (!card) {
    isProgrammaticNavigation = false
    track.classList.remove('is-programmatic-scrolling')
    return
  }

  if (scrollSettleTimer) clearTimeout(scrollSettleTimer)
  scrollSettleTimer = undefined

  const startLeft = track.scrollLeft
  const targetLeft = getProjectScrollPosition(track, card)
  if (prefersReducedMotion) {
    track.scrollLeft = targetLeft
    void finishProjectScroll()
    return
  }

  const duration = 520
  let startTime = 0
  const animateScroll = (timestamp: number) => {
    if (!startTime) startTime = timestamp
    const progress = Math.min((timestamp - startTime) / duration, 1)
    const easedProgress = 1 - (1 - progress) ** 3
    track.scrollLeft = startLeft + (targetLeft - startLeft) * easedProgress

    if (progress < 1) {
      scrollAnimationFrame = requestAnimationFrame(animateScroll)
      return
    }

    scrollAnimationFrame = 0
    track.scrollLeft = targetLeft
    void finishProjectScroll()
  }

  scrollAnimationFrame = requestAnimationFrame(animateScroll)
}

function interruptProgrammaticScroll(): void {
  const track = projectTrack.value
  if (!isProgrammaticNavigation || !track) return

  if (scrollAnimationFrame) cancelAnimationFrame(scrollAnimationFrame)
  scrollAnimationFrame = 0
  isProgrammaticNavigation = false
  track.classList.remove('is-programmatic-scrolling')
  if (scrollSettleTimer) clearTimeout(scrollSettleTimer)
  scrollSettleTimer = setTimeout(() => void finishProjectScroll(), 250)
}

function updateActiveProject(track: HTMLElement): number {
  const cards = track.querySelectorAll<HTMLElement>('.project-card')
  const trackCenter = track.getBoundingClientRect().left + track.clientWidth / 2
  let closestIndex = activeProjectCard.value
  let closestDistance = Number.POSITIVE_INFINITY

  cards.forEach((card, index) => {
    const cardCenter = card.getBoundingClientRect().left + card.getBoundingClientRect().width / 2
    const distance = Math.abs(trackCenter - cardCenter)
    if (distance < closestDistance) {
      closestDistance = distance
      closestIndex = index
    }
  })

  activeProjectCard.value = closestIndex
  return closestIndex
}

function updateProjectCardScales(track: HTMLElement): void {
  const cards = track.querySelectorAll<HTMLElement>('.project-card')
  if (!cards.length) return

  const trackCenter = track.getBoundingClientRect().left + track.clientWidth / 2
  const cardCenters = Array.from(cards, (card) => {
    const bounds = card.getBoundingClientRect()
    return bounds.left + bounds.width / 2
  })
  const cardStep = cardCenters.length > 1
    ? Math.abs(cardCenters[1] - cardCenters[0])
    : cards[0].getBoundingClientRect().width
  if (!cardStep) return

  cards.forEach((card, index) => {
    const progress = Math.min(Math.abs(cardCenters[index] - trackCenter) / cardStep, 1)
    card.style.setProperty('--project-card-scale', String(1 - progress * 0.14))
    card.style.setProperty('--project-card-dim', String(progress * 0.56))
  })
}

async function finishProjectScroll(): Promise<void> {
  scrollSettleTimer = undefined
  const track = projectTrack.value
  if (!track) return

  const currentIndex = updateActiveProject(track)
  const projectCount = safeProjects.value.length
  const normalizedIndex = currentIndex < projectCount
    ? currentIndex + projectCount
    : currentIndex >= projectCount * 2
      ? currentIndex - projectCount
      : currentIndex

  if (normalizedIndex !== currentIndex) {
    activeProjectCard.value = normalizedIndex
    await nextTick()
    const card = track.querySelectorAll<HTMLElement>('.project-card')[normalizedIndex]
    if (card) track.scrollLeft = getProjectScrollPosition(track, card)
  }

  updateProjectCardScales(track)
  isProgrammaticNavigation = false
  track.classList.remove('is-programmatic-scrolling')
  scheduleAutoSlide()
}

function getProjectSetWidth(track: HTMLElement): number {
  const cards = track.querySelectorAll<HTMLElement>('.project-card')
  const firstCard = cards[0]
  const nextSetFirstCard = cards[safeProjects.value.length]
  if (!firstCard || !nextSetFirstCard) return 0
  return nextSetFirstCard.getBoundingClientRect().left - firstCard.getBoundingClientRect().left
}

function onProjectScroll(): void {
  const track = projectTrack.value
  if (!track) return
  clearAutoSlideTimer()
  if (!activeCardFrame) {
    activeCardFrame = requestAnimationFrame(() => {
      activeCardFrame = 0
      if (projectTrack.value !== track) return
      updateProjectCardScales(track)
      if (!isProgrammaticNavigation) updateActiveProject(track)
    })
  }
  if (isProgrammaticNavigation) return
  if (scrollSettleTimer) clearTimeout(scrollSettleTimer)
  scrollSettleTimer = setTimeout(() => void finishProjectScroll(), 250)
}

function onProjectScrollEnd(): void {
  if (isProgrammaticNavigation) return
  if (scrollSettleTimer) clearTimeout(scrollSettleTimer)
  void finishProjectScroll()
}

function onMotionPreferenceChange(event: MediaQueryListEvent): void {
  prefersReducedMotion = event.matches
  if (prefersReducedMotion) {
    clearAutoSlideTimer()
    interruptProgrammaticScroll()
    return
  }
  scheduleAutoSlide()
}

function onDocumentVisibilityChange(): void {
  scheduleAutoSlide()
}

onMounted(async () => {
  await nextTick()
  const track = projectTrack.value
  if (track && safeProjects.value.length) {
    track.scrollLeft = getProjectSetWidth(track)
    updateActiveProject(track)
    updateProjectCardScales(track)
  }

  motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReducedMotion = motionPreference.matches
  motionPreference.addEventListener('change', onMotionPreferenceChange)
  document.addEventListener('visibilitychange', onDocumentVisibilityChange)

  if (projectSlider.value && 'IntersectionObserver' in window) {
    projectSliderObserver = new IntersectionObserver(([entry]) => {
      isProjectSliderVisible = entry.isIntersecting
      if (isProjectSliderVisible) scheduleAutoSlide()
      else clearAutoSlideTimer()
    }, { threshold: 0.1 })
    projectSliderObserver.observe(projectSlider.value)
  } else {
    isProjectSliderVisible = true
    scheduleAutoSlide()
  }
})

function onImageError(e: Event): void {
  const target = e.target as HTMLImageElement
  if (target && !target.dataset.fallbackApplied) {
    target.dataset.fallbackApplied = 'true'
    target.src = '/images/pg.webp'
  }
}

onBeforeUnmount(() => {
  projectSliderObserver?.disconnect()
  motionPreference?.removeEventListener('change', onMotionPreferenceChange)
  document.removeEventListener('visibilitychange', onDocumentVisibilityChange)
  clearAutoSlideTimer()
  if (scrollSettleTimer) clearTimeout(scrollSettleTimer)
  if (scrollAnimationFrame) cancelAnimationFrame(scrollAnimationFrame)
  if (activeCardFrame) cancelAnimationFrame(activeCardFrame)
})
</script>
