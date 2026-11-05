<template>
  <section class="consultation-values" aria-labelledby="consultation-values-title">
    <div class="consultation-section-heading">
      <p class="consultation-eyebrow"><span></span> {{ t('consultation_page.values_eyebrow') }}</p>
      <h2 id="consultation-values-title">
        {{ t('consultation_page.values_title_1') }}<br>
        <em>{{ t('consultation_page.values_title_2') }}</em>
      </h2>
    </div>
    <div class="consultation-values-layout">
      <p class="consultation-values-intro">
        {{ t('consultation_page.values_intro') }}
      </p>
      <ol class="consultation-topics">
        <li v-for="topic in topics" :key="topic.number">
          <span>{{ topic.number }}</span>
          <div>
            <h3>{{ topic.title }}</h3>
            <p>{{ topic.desc }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()

const topics = computed(() => [
  {
    number: '01',
    title: t('consultation_page.topic_1_title'),
    desc: t('consultation_page.topic_1_desc'),
  },
  {
    number: '02',
    title: t('consultation_page.topic_2_title'),
    desc: t('consultation_page.topic_2_desc'),
  },
  {
    number: '03',
    title: t('consultation_page.topic_3_title'),
    desc: t('consultation_page.topic_3_desc'),
  },
  {
    number: '04',
    title: t('consultation_page.topic_4_title'),
    desc: t('consultation_page.topic_4_desc'),
  },
  {
    number: '05',
    title: t('consultation_page.topic_5_title'),
    desc: t('consultation_page.topic_5_desc'),
  },
])
</script>

<style scoped>
.consultation-values {
  width: min(1320px, calc(100% - var(--consultation-gutter) * 2));
  margin: 0 auto;
  padding: clamp(75px, 9vw, 125px) 0;
  border-bottom: 1px solid var(--color-border);
}

.consultation-eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--color-gold);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 1.8px;
}

.consultation-eyebrow > span {
  width: 32px;
  height: 1px;
  background: currentColor;
}

.consultation-section-heading h2 {
  margin-top: 18px;
  color: var(--color-text);
  font-size: clamp(34px, 4.2vw, 56px);
  font-weight: 400;
  line-height: 1.14;
  letter-spacing: -1.4px;
}

.consultation-section-heading h2 em {
  color: var(--color-champagne);
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
}

.consultation-values-layout {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: clamp(40px, 6vw, 90px);
  margin-top: 48px;
  align-items: start;
}

.consultation-values-intro {
  color: var(--color-muted);
  font-size: clamp(14px, 1.2vw, 16px);
  line-height: 1.85;
}

.consultation-topics {
  display: grid;
  gap: 24px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.consultation-topics li {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr);
  gap: 18px;
  padding-bottom: 22px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.consultation-topics li:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.consultation-topics span {
  color: var(--color-gold);
  font-family: var(--font-serif);
  font-size: 20px;
}

.consultation-topics h3 {
  color: var(--color-text);
  font-size: 16px;
  font-weight: 500;
}

.consultation-topics p {
  margin-top: 6px;
  color: var(--color-muted);
  font-size: 13px;
  line-height: 1.7;
}

@media (max-width: 820px) {
  .consultation-values-layout {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}
</style>
