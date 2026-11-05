<template>
  <section class="services-note">
    <p>{{ t('services_page.note_text') }}</p>
    <NuxtLink class="button-gold" to="/lien-he#consultation-form">
      {{ t('services_page.note_cta') }} <span aria-hidden="true">↗</span>
    </NuxtLink>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()
</script>

<style scoped>
.services-note {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
  padding: 65px max(var(--page-gutter), calc((100vw - 1280px) / 2));
  border-top: 1px solid var(--color-border);
  background: #141414;
}

.services-note > p {
  max-width: 580px;
  color: var(--color-text);
  font-size: var(--type-service-body);
  font-weight: 400;
  line-height: 1.8;
}

.services-note .button-gold {
  display: inline-flex;
  min-height: 48px;
  align-items: center;
  gap: 20px;
  padding: 0 24px;
  background: var(--color-gold);
  color: #100f0d;
  font-size: var(--type-cta);
  font-weight: 600;
  letter-spacing: 0;
  text-decoration: none;
  flex-shrink: 0;
  transition: background-color 0.25s ease, transform 0.25s ease;
}

.services-note .button-gold:hover {
  background: var(--color-champagne);
  transform: translateY(-2px);
}

.services-note .button-gold span {
  font-size: 15px;
}

@media (max-width: 760px) {
  .services-note {
    align-items: flex-start;
    flex-direction: column;
    padding-top: 55px;
    padding-bottom: 55px;
  }
}
</style>
