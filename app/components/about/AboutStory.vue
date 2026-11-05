<template>
  <section class="about-story" aria-label="Tầm nhìn và sứ mệnh WECONS">
    <article class="about-story-column about-vision">
      <div class="about-story-copy">
        <p class="about-story-kicker">{{ aboutStory.vision_badge || t('about_page.vision_label') }}<span></span></p>
        <h2 id="about-story-title">{{ aboutStory.vision_title || t('about_page.vision_title') }}</h2>
        <p>{{ aboutStory.vision_description || t('about_page.vision_description') }}</p>
      </div>
      <img
        :src="aboutStory.vision_image || '/images/imae-home-1.webp'"
        :alt="t('about_page.vision_image_alt')"
        loading="lazy"
        width="780"
        height="665"
      >
    </article>
    <article class="about-story-column about-mission">
      <img
        :src="aboutStory.mission_image || '/images/image-1.webp'"
        :alt="t('about_page.mission_image_alt')"
        loading="lazy"
        width="780"
        height="665"
      >
      <div class="about-story-copy">
        <p class="about-story-kicker">{{ aboutStory.mission_badge || t('about_page.mission_label') }}<span></span></p>
        <h2>{{ aboutStory.mission_title || t('about_page.mission_title') }}</h2>
        <p>{{ aboutStory.mission_description || t('about_page.mission_description') }}</p>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'
import { useSiteSettings } from '~/composables/useSiteSettings'

const { t } = useI18n()
const { aboutStory } = useSiteSettings()
</script>

<style scoped>
.about-story {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: start;
  gap: clamp(24px, 2.2vw, 32px);
  width: 100%;
  margin: 0 auto;
  padding: clamp(40px, 5vw, 72px)
    max(var(--page-gutter, 22px), calc((100% - var(--about-content-width, 1515px)) / 2));
  background: #292929;
}

.about-story-column {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.about-story-column > img {
  display: block;
  width: 100%;
  aspect-ratio: 780 / 665;
  object-fit: cover;
}

.about-vision > img {
  margin-top: 22px;
}

.about-mission > img {
  margin-top: 0;
}

.about-mission .about-story-copy {
  margin-top: 18px;
}

.about-story-kicker {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 12px;
  color: var(--color-gold);
  font-family: var(--font-serif);
  font-size: 19px;
  font-style: italic;
}

.about-story-kicker span {
  height: 1px;
  flex: 1;
  background: rgba(245, 242, 235, .32);
}

.about-story-copy h2 {
  color: var(--color-text);
  font-family: var(--font-serif);
  font-size: clamp(30px, 2.2vw, 34px);
  font-weight: 400;
  letter-spacing: -.6px;
  line-height: 1.2;
  text-wrap: balance;
}

.about-story-copy > p:last-child {
  margin-top: 10px;
  color: rgba(245, 242, 235, .78);
  font-size: 16px;
  line-height: 1.75;
}

@media (max-width: 760px) {
  .about-story {
    grid-template-columns: 1fr;
    gap: 28px;
    padding-top: 28px;
    padding-bottom: 32px;
  }

  .about-story-column > img {
    aspect-ratio: 1.18;
  }

  .about-mission .about-story-copy {
    margin-top: 12px;
  }
}

@media (max-width: 600px) {
  .about-story {
    gap: 30px;
    padding: 26px 16px 30px;
  }

  .about-story-kicker {
    gap: 10px;
    margin-bottom: 10px;
    font-size: 15px;
  }

  .about-story-copy h2 {
    font-size: clamp(24px, 7vw, 29px);
    letter-spacing: -.4px;
    line-height: 1.22;
  }

  .about-story-copy > p:last-child {
    margin-top: 9px;
    font-size: 13px;
    line-height: 1.72;
  }

  .about-story-column > img,
  .about-mission > img {
    order: 1;
    margin-top: 10px;
    width: auto;
    height: fit-content;
  }

  .about-mission .about-story-copy {
    order: 0;
  }
}
</style>
