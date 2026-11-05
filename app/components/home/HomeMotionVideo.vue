<template>
  <section id="work-in-motion" class="work-motion" aria-labelledby="work-motion-title">
    <p class="work-motion-eyebrow">{{ t('home.motion.eyebrow') }}</p>
    <div class="work-motion-frame">
      <video
        ref="videoElement"
        class="work-motion-video"
        :autoplay="!prefersReducedMotion"
        muted
        loop
        playsinline
        preload="none"
        :poster="videoPoster"
        :aria-label="t('home.motion.video_label')"
        @canplay="startPlayback"
      ></video>
      <div class="work-motion-overlay">
        <div class="work-motion-copy">
          <h2 id="work-motion-title">{{ t('home.motion.title') }}</h2>
          <p class="work-motion-description">
            {{ t('home.motion.desc') }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useSiteSettings } from '~/composables/useSiteSettings'

const { t } = useI18n()
const { heroVideoUrl } = useSiteSettings()
const videoSource = heroVideoUrl.value
const videoElement = ref<HTMLVideoElement | null>(null)
const prefersReducedMotion = ref(false)

const videoPoster = computed(() => {
  if (import.meta.client && window.innerWidth > 768) {
    return '/images/pg.webp'
  }
  return '/images/pg-mobile.webp'
})

let observer: IntersectionObserver | undefined
let motionPreference: MediaQueryList | undefined
let hasLoadedSource = false

function loadVideo(): void {
  const video = videoElement.value
  if (!video || hasLoadedSource) return

  hasLoadedSource = true
  video.src = videoSource
  video.load()
}

function observeVideo(): void {
  const video = videoElement.value
  if (!video) return

  if (!('IntersectionObserver' in window)) {
    loadVideo()
    return
  }

  observer?.disconnect()
  observer = new IntersectionObserver((entries) => {
    if (entries.some(entry => entry.isIntersecting)) {
      loadVideo()
      observer?.disconnect()
    }
  }, { rootMargin: '320px 0px' })

  observer.observe(video)
}

function startPlayback(): void {
  const video = videoElement.value
  if (!video || prefersReducedMotion.value) return

  video.muted = true
  void video.play().catch(() => {
    video.pause()
  })
}

function updateMotionPreference(event: MediaQueryListEvent): void {
  prefersReducedMotion.value = event.matches

  if (event.matches) {
    videoElement.value?.pause()
    return
  }

  if (hasLoadedSource) {
    startPlayback()
  } else {
    observeVideo()
  }
}

onMounted(() => {
  motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReducedMotion.value = motionPreference.matches
  motionPreference.addEventListener('change', updateMotionPreference)

  if (!prefersReducedMotion.value) observeVideo()
})

onBeforeUnmount(() => {
  observer?.disconnect()
  motionPreference?.removeEventListener('change', updateMotionPreference)
})
</script>

<style scoped>
.work-motion {
  width: min(1320px, calc(100% - var(--home-gutter) * 2));
  margin: 0 auto;
  padding: clamp(78px, 9vw, 128px) 0;
}

.work-motion-frame {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  border: 1px solid rgba(214, 179, 106, 0.2);
  border-radius: 4px;
  background: #141414;
}

.work-motion-video {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.work-motion-overlay {
  position: absolute;
  z-index: 1;
  inset: 0;
  display: flex;
  align-items: flex-end;
  padding: clamp(30px, 5.5vw, 76px);
  background:
    linear-gradient(90deg, rgba(9, 9, 9, 0.3), transparent 74%),
    linear-gradient(0deg, rgba(9, 9, 9, 0.84) 0%, rgba(9, 9, 9, 0.54) 30%, rgba(9, 9, 9, 0.08) 76%);
  pointer-events: none;
}

.work-motion-copy {
  max-width: 760px;
}

.work-motion-eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
  color: var(--color-champagne);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 1.8px;
  line-height: 1.5;
}

.work-motion > .work-motion-eyebrow {
  margin-bottom: 16px;
}

.work-motion-eyebrow::before {
  width: 30px;
  flex: 0 0 30px;
  height: 1px;
  background: var(--color-champagne);
  content: '';
}

.work-motion-copy h2 {
  max-width: 720px;
  margin: 0;
  color: #f5f2eb;
  font-family: var(--font-heading);
  font-size: var(--type-h2);
  font-weight: 600;
  letter-spacing: -0.5px;
  line-height: 1.13;
  text-wrap: balance;
}

.work-motion-description {
  max-width: 520px;
  margin-top: 16px;
  color: rgba(245, 242, 235, 0.86);
  font-size: 13px;
  line-height: 1.8;
}

@media (max-width: 820px) {
  .work-motion-overlay {
    padding: 38px;
    background:
      linear-gradient(90deg, rgba(9, 9, 9, 0.36), transparent 82%),
      linear-gradient(0deg, rgba(9, 9, 9, 0.88) 0%, rgba(9, 9, 9, 0.56) 38%, rgba(9, 9, 9, 0.12) 82%);
  }

  .work-motion-copy { max-width: 600px; }
}

@media (max-width: 600px) {
  .work-motion {
    padding-top: 78px;
    padding-bottom: 78px;
  }

  .work-motion-frame {
    aspect-ratio: 4 / 3;
  }

  .work-motion-overlay {
    padding: 22px;
    background:
      linear-gradient(90deg, rgba(9, 9, 9, 0.4), transparent 95%),
      linear-gradient(0deg, rgba(9, 9, 9, 0.92) 0%, rgba(9, 9, 9, 0.62) 45%, rgba(9, 9, 9, 0.14) 100%);
  }

  .work-motion > .work-motion-eyebrow { margin-bottom: 12px; font-size: 8px; }
  .work-motion-copy h2 { font-size: var(--type-h2); letter-spacing: -0.5px; }
  .work-motion-description { max-width: 430px; margin-top: 12px; font-size: 11px; line-height: 1.7; }
}

@media (prefers-reduced-motion: reduce) {
  .work-motion-copy, .work-motion-video { animation: none; transition: none; }
}
</style>
