<template>
  <section class="completed-project-section" aria-labelledby="completed-project-title">
    <div class="completed-project-list">
      <h2 id="completed-project-title">
        {{ t('home.projects.completed_title_1') }} {{ t('home.projects.completed_title_2') }}
      </h2>
      <div class="completed-project-items" :aria-label="t('home.projects.title')">
        <button
          v-for="project in projects"
          :key="project.idProject"
          class="completed-project-item"
          :class="{ 'is-active': isActive(project.idProject) }"
          type="button"
          :aria-pressed="isActive(project.idProject)"
          :aria-label="project.title"
          @click="selectProject(project.idProject)"
        >
          <img :src="getOptimizedImageUrl(project.image, 120)" :alt="project.alt" loading="lazy" width="64" height="38" @error="onThumbnailError">
          <span class="completed-project-item-copy">
            <span class="completed-project-item-title">{{ project.title }}</span>
            <span class="completed-project-item-detail">{{ project.detail }}</span>
          </span>
        </button>
      </div>
      <NuxtLink class="completed-project-all-link" to="/du-an">
        {{ t('common.view_all') }} <span aria-hidden="true">↗</span>
      </NuxtLink>
    </div>

    <div class="completed-project-preview">
      <img
        v-if="showProjectImage"
        class="completed-project-poster"
        :src="getOptimizedImageUrl(selectedProject.image, 1000)"
        :srcset="getImageSrcset(selectedProject.image, [640, 960, 1200])"
        sizes="(max-width: 768px) 100vw, 900px"
        :alt="selectedProject.alt"
        width="1200"
        height="675"
        loading="lazy"
      >
      <video
        ref="projectVideo"
        class="completed-project-video"
        v-show="!showProjectImage"
        :src="heroVideoUrl"
        :poster="getOptimizedImageUrl(selectedProject.image, 900)"
        muted
        loop
        playsinline
        preload="none"
        width="1200"
        height="675"
        :aria-label="t('home.projects.video_project_aria', { title: selectedProject.title })"
        @play="videoIsPlaying = true"
        @pause="videoIsPlaying = false"
      ></video>
      <button
        class="completed-project-play"
        type="button"
        :aria-label="videoIsPlaying ? t('home.projects.pause_video') : t('home.projects.play_video')"
        @click="toggleVideoPlayback"
      >
        <svg v-if="videoIsPlaying" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 5h3v14H8zm5 0h3v14h-3z" />
        </svg>
        <svg v-else viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>
    </div>
    <h3 class="completed-project-selected-title" aria-live="polite">
      {{ selectedProject.title }}
    </h3>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { HomeImageItem } from '~/types/content'
import { useI18n } from '~/composables/useI18n'
import { useSiteSettings } from '~/composables/useSiteSettings'
import { getImageSrcset, getOptimizedImageUrl } from '~/utils/imageHelper'

interface HomeCompletedProject extends HomeImageItem {
  idProject: string
}

const props = defineProps<{
  projects: HomeCompletedProject[]
}>()

const { t } = useI18n()
const { heroVideoUrl } = useSiteSettings()
const projectVideo = ref<HTMLVideoElement | null>(null)
const initialProject: HomeCompletedProject = props.projects[0] || {
  idProject: '',
  title: '',
  category: '',
  image: '',
  alt: '',
  detail: '',
}
const selectedProject = ref<HomeCompletedProject>(initialProject)
const videoIsPlaying = ref(false)
const showProjectImage = ref(false)
const isMobileLayout = ref(false)
const isActive = computed(() => (idProject: string) => selectedProject.value.idProject === idProject)

watch(() => props.projects, (projects) => {
  if (projects.length && !projects.some(project => project.idProject === selectedProject.value.idProject)) {
    selectedProject.value = projects[0]
  }
}, { immediate: true })

async function selectProject(idProject: string): Promise<void> {
  const project = props.projects.find(item => item.idProject === idProject)
  if (!project) {
    console.error('[HomeCompletedProjects] Unknown project id:', idProject)
    return
  }

  selectedProject.value = project
  showProjectImage.value = isMobileLayout.value
  if (isMobileLayout.value) return

  await nextTick()

  const video = projectVideo.value
  if (!video) return

  video.currentTime = 0
  video.play().catch((error: unknown) => {
    showProjectImage.value = true
    console.error('[HomeCompletedProjects] Unable to play project video:', error)
  })
}

function onThumbnailError(e: Event) {
  const target = e.target as HTMLImageElement;
  if (!target) return;
  if (target.src.includes('-150x150.webp')) {
    target.src = target.src.replace('-150x150.webp', '.webp');
  } else if (!target.dataset.fallbackApplied) {
    target.dataset.fallbackApplied = 'true';
    target.src = '/images/pg.webp';
  }
}

function toggleVideoPlayback(): void {
  const video = projectVideo.value
  if (!video) return

  if (video.paused) {
    showProjectImage.value = false
    void video.play().catch((error: unknown) => {
      showProjectImage.value = true
      console.error('[HomeCompletedProjects] Unable to play project video:', error)
    })
  } else {
    video.pause()
    showProjectImage.value = true
  }
}

let videoObserver: IntersectionObserver | null = null
let updateMobileLayout: (() => void) | undefined

onMounted(async () => {
  updateMobileLayout = () => {
    const isMobile = window.matchMedia('(max-width: 600px)').matches
    if (isMobile === isMobileLayout.value) return

    isMobileLayout.value = isMobile
    const video = projectVideo.value
    if (isMobile) {
      video?.pause()
      showProjectImage.value = true
    } else {
      showProjectImage.value = false
    }
  }

  updateMobileLayout()
  window.addEventListener('resize', updateMobileLayout, { passive: true })
  await nextTick()
  if (!('IntersectionObserver' in window) || !projectVideo.value) return

  videoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = projectVideo.value
      if (entry.isIntersecting && video) {
        if (isMobileLayout.value) return
        video.play().catch(() => {})
      } else if (video && !video.paused) {
        video.pause()
      }
    })
  }, { threshold: 0.25 })

  videoObserver.observe(projectVideo.value)
})

onBeforeUnmount(() => {
  if (updateMobileLayout) window.removeEventListener('resize', updateMobileLayout)
  videoObserver?.disconnect()
})
</script>
