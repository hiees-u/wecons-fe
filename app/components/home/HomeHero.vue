<template>
  <div ref="heroScrollTrack" class="hero-scroll-track">
    <section
      ref="heroViewport"
      class="hero-section"
      aria-labelledby="hero-title"
    >
      <video
        class="hero-image"
        :src="heroVideoUrl"
        :poster="heroPoster"
        autoplay
        muted
        loop
        playsinline
        preload="none"
        aria-hidden="true"
        tabindex="-1"
        width="1920"
        height="1080"
      ></video>
      <div class="hero-shade"></div>
      <div class="hero-content-container">
        <div class="hero-content-group">
          <div class="hero-content-top">
            <p class="eyebrow hero-eyebrow">
              <span></span>
              <span class="hero-eyebrow-copy">{{ t('home.hero.eyebrow') }}</span>
            </p>
            <h1
              id="hero-title"
              :aria-label="`${t('home.hero.title_1')} ${t('home.hero.title_2')}`"
            >
              <span class="hero-heading-desktop" aria-hidden="true">
                <span
                  v-for="(word, wordIndex) in headingFirstLine"
                  :key="`first-${wordIndex}`"
                  class="hero-heading-word"
                >
                  <span
                    v-for="character in word.characters"
                    :key="character.index"
                    class="hero-character"
                  >{{ character.value }}</span>
                </span>
                <br>
                <em aria-hidden="true">
                  <span
                    v-for="(word, wordIndex) in headingSecondLine"
                    :key="`second-${wordIndex}`"
                    class="hero-heading-word"
                  >
                    <span
                      v-for="character in word.characters"
                      :key="character.index"
                      class="hero-character"
                    >{{ character.value }}</span>
                  </span>
                </em>
              </span>
              <span class="hero-heading-mobile" aria-hidden="true">{{ headingMobile }}</span>
            </h1>
          </div>
          <div class="hero-content-bottom" :inert="!detailVisible">
            <p class="hero-description">
              <span
                v-for="(word, wordIndex) in descriptionWords"
                :key="`description-${wordIndex}`"
                class="hero-description-word"
              ><span
                  v-for="character in word.characters"
                  :key="character.index"
                  class="hero-description-char"
                  :style="getDescriptionCharStyle(character.index)"
                >{{ character.value }}</span></span>
            </p>
            <NuxtLink class="button-line hero-intro-button" to="/gioi-thieu" :inert="!buttonVisible">
              {{ t('home.hero.btn_intro') }} <span aria-hidden="true">↗</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useSiteSettings } from '~/composables/useSiteSettings'

const { t } = useI18n()
const { heroVideoUrl } = useSiteSettings()
const heroScrollTrack = ref<HTMLElement | null>(null)
const heroViewport = ref<HTMLElement | null>(null)
const detailVisible = ref(false)
const buttonVisible = ref(false)
let scrollFrame = 0
let motionPreference: MediaQueryList | undefined
let prefersReducedMotion = false

const heroPoster = computed(() => {
  if (import.meta.client && window.innerWidth > 768) {
    return '/images/pg.webp'
  }
  return '/images/pg-mobile.webp'
})

const createHeadingWords = (text: string, initialIndex = 0) => {
  let characterIndex = initialIndex

  return text.split(' ').map((word, wordIndex) => {
    if (wordIndex) characterIndex += 1
    return {
      characters: Array.from(word, (value) => ({
        value,
        index: characterIndex++,
      })),
    }
  })
}

const headingFirstLine = computed(() => createHeadingWords(t('home.hero.title_1')))
const headingSecondLine = computed(() =>
  createHeadingWords(
    t('home.hero.title_2'),
    Array.from(t('home.hero.title_1') + ' ').length,
  ),
)
const headingMobile = computed(() => `${t('home.hero.title_1')} ${t('home.hero.title_2')}`)
const descriptionText = computed(() => t('home.hero.desc'))
const descriptionWords = computed(() => createHeadingWords(descriptionText.value))
const descriptionCharacters = computed(() => Array.from(descriptionText.value))
const scrollProgress = ref(0)

const clampProgress = (value: number) => Math.max(0, Math.min(1, value))

const getDescriptionCharStyle = (index: number) => {
  const characterProgress = scrollProgress.value * descriptionCharacters.value.length - index
  const revealProgress = clampProgress(characterProgress)

  return {
    opacity: prefersReducedMotion ? 1 : 0.6 + revealProgress * 0.3,
  }
}

const updateScrollProgress = () => {
  scrollFrame = 0
  const track = heroScrollTrack.value
  const viewport = heroViewport.value
  if (!track || !viewport) return

  if (prefersReducedMotion) {
    scrollProgress.value = 1
    detailVisible.value = true
    buttonVisible.value = true
    viewport.style.removeProperty('--hero-scroll-y')
    viewport.style.setProperty('--hero-eyebrow-opacity', '1')
    viewport.style.setProperty('--hero-detail-progress', '1')
    viewport.style.setProperty('--hero-button-progress', '1')
    viewport.style.setProperty('--hero-detail-y', '0px')
    viewport.style.setProperty('--hero-button-y', '0px')
    return
  }

  const scrollDistance = Math.max(0, track.offsetHeight - window.innerHeight)
  const progress = scrollDistance === 0
    ? 0
    : clampProgress(-track.getBoundingClientRect().top / scrollDistance)
  scrollProgress.value = progress

  const detailProgress = clampProgress(progress / 0.3)
  const buttonStart = 0.18
  const buttonDuration = 0.3
  const buttonProgress = clampProgress((progress - buttonStart) / buttonDuration)

  detailVisible.value = progress > 0.01
  buttonVisible.value = buttonProgress >= 0.95
  viewport.style.setProperty('--hero-scroll-y', `${-progress * scrollDistance * 0.55}px`)
  viewport.style.setProperty('--hero-eyebrow-opacity', `${clampProgress(progress / 0.2)}`)
  viewport.style.setProperty('--hero-detail-progress', `${detailProgress}`)
  viewport.style.setProperty('--hero-button-progress', `${buttonProgress}`)
  viewport.style.setProperty('--hero-detail-y', `${(1 - detailProgress) * 24}px`)
  viewport.style.setProperty('--hero-button-y', `${(1 - buttonProgress) * 24}px`)
}

const scheduleScrollUpdate = () => {
  if (scrollFrame) return
  scrollFrame = window.requestAnimationFrame(updateScrollProgress)
}

const onMotionPreferenceChange = (event: MediaQueryListEvent) => {
  prefersReducedMotion = event.matches
  scheduleScrollUpdate()
}

onMounted(() => {
  motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReducedMotion = motionPreference.matches
  motionPreference.addEventListener('change', onMotionPreferenceChange)
  window.addEventListener('scroll', scheduleScrollUpdate, { passive: true })
  window.addEventListener('resize', scheduleScrollUpdate, { passive: true })
  scheduleScrollUpdate()
})

onBeforeUnmount(() => {
  motionPreference?.removeEventListener('change', onMotionPreferenceChange)
  window.removeEventListener('scroll', scheduleScrollUpdate)
  window.removeEventListener('resize', scheduleScrollUpdate)
  if (scrollFrame) window.cancelAnimationFrame(scrollFrame)
})
</script>
