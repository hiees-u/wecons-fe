<template>
  <section class="about-values" aria-labelledby="about-values-title">
    <div class="section-heading">
      <h2 id="about-values-title">
        {{ t('about_page.values_title') }} {{ t('about_page.values_title_accent') }}
      </h2>
    </div>
    <ol class="about-value-list">
      <li v-for="(value, index) in values" :key="value.number">
        <span class="about-value-icon" aria-hidden="true">
          <i :class="valueIcons[index]" aria-hidden="true"></i>
          <i :class="valueOutlineIcons[index]" class="about-value-icon-mobile" aria-hidden="true"></i>
        </span>
        <h3>{{ value.title }}</h3>
        <p v-if="value.description">{{ value.description }}</p>
      </li>
    </ol>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'
import type { CompanyValue } from '~/types/content'

defineProps<{
  values: CompanyValue[]
}>()

const { t } = useI18n()
const valueIcons = [
  'fa-solid fa-award',
  'fa-solid fa-compass-drafting',
  'fa-solid fa-comments',
  'fa-solid fa-screwdriver-wrench',
  'fa-solid fa-piggy-bank',
  'fa-solid fa-house-circle-check',
]
const valueOutlineIcons = [
  'fa-regular fa-compass',
  'fa-regular fa-pen-to-square',
  'fa-regular fa-comments',
  'fa-regular fa-clock',
  'fa-regular fa-credit-card',
  'fa-regular fa-building',
]
</script>

<style scoped>
.about-values {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: clamp(36px, 5vw, 72px) 0;
  background: #292929;
}

.about-values > .section-heading {
  justify-content: center;
  align-items: center;
}

.section-heading {
  margin: 0 auto 26px;
  text-align: center;
}

.section-heading h2 {
  margin: 0;
  color: var(--color-text);
  font-family: var(--font-serif);
  font-size: clamp(30px, 3.5vw, 60px);
  font-weight: 400;
  letter-spacing: -1px;
  line-height: 1.2;
  text-wrap: balance;
  padding: 15px;
}

.about-value-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: min(var(--about-content-width, 1515px), 100%);
  margin: 0 auto;
  list-style: none;
  padding: 0;
  border: 1px solid rgba(214, 179, 106, .26);
  background: #141414;
}

.about-value-list li {
  position: relative;
  min-height: 175px;
  padding: 22px 26px 18px;
  border-right: 1px solid rgba(214, 179, 106, .2);
  border-bottom: 1px solid rgba(214, 179, 106, .2);
}

.about-value-list li:nth-child(3n) {
  border-right: 0;
}

.about-value-list li:nth-last-child(-n + 3) {
  border-bottom: 0;
}

.about-value-icon {
  display: inline-flex;
  width: 42px;
  height: 42px;
  align-items: center;
  color: rgba(245, 242, 235, .9);
  font-size: 32px;
}

.about-value-icon-mobile {
  display: none;
}

.about-value-list h3 {
  max-width: 340px;
  margin-top: 12px;
  color: var(--color-text);
  font-size: 14px;
  font-weight: 400;
  line-height: 1.55;
}

.about-value-list p {
  max-width: 330px;
  margin-top: 10px;
  color: var(--color-muted);
  font-size: 11px;
  line-height: 1.8;
}

@media (max-width: 760px) {
  .about-values {
    padding-right: var(--page-gutter);
    padding-left: var(--page-gutter);
  }

  .about-value-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .about-value-list li:nth-child(3n) {
    border-right: 1px solid rgba(214, 179, 106, .2);
  }

  .about-value-list li:nth-child(2n) {
    border-right: 0;
  }

  .about-value-list li:nth-last-child(-n + 3) {
    border-bottom: 1px solid rgba(214, 179, 106, .2);
  }

  .about-value-list li:nth-last-child(-n + 2) {
    border-bottom: 0;
  }
}

@media (max-width: 600px) {
  .about-values {
    padding: 28px 16px 34px;
  }

  .section-heading {
    margin-bottom: 12px;
  }

  .section-heading h2 {
    padding: 0;
    font-size: clamp(26px, 7.5vw, 32px);
    letter-spacing: -.5px;
  }

  .about-value-list {
    grid-template-columns: 1fr;
  }

  .about-value-list li,
  .about-value-list li + li {
    display: flex;
    min-height: 0;
    align-items: center;
    gap: 12px;
    padding: 13px 12px;
    border-left: 0;
    border-right: 0 !important;
  }

  .about-value-icon {
    width: 48px;
    height: 48px;
    flex: 0 0 24px;
    align-items: center;
    font-size: 19px;
    min-width: 50px;
    max-width: 30%;
    margin-left: 15px;
  }

  .about-value-icon > i:not(.about-value-icon-mobile) {
    display: none;
  }

  .about-value-icon-mobile {
    display: inline-flex;
    font-size: 38px;
  }

  .about-value-list li:nth-last-child(-n + 2) {
    border-bottom: 1px solid rgba(214, 179, 106, .2);
  }

  .about-value-list li:last-child {
    border-bottom: 0;
  }

  .about-value-list h3 {
    display: -webkit-box;
    overflow: hidden;
    max-width: none;
    margin-top: 0;
    font-size: 13px;
    line-height: 1.45;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .about-value-list p {
    display: none;
  }
}
</style>
