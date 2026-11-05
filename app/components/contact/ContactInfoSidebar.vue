<template>
  <aside class="contact-details" :aria-label="t('contact_page.section_title')">
    <ul class="contact-details-list">
      <li>
        <span class="contact-detail-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>
        </span>
        <p><strong>{{ t('contact_page.address_title') }}</strong><span>{{ address }}</span></p>
      </li>
      <li>
        <span class="contact-detail-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M21 16.5v3a1.5 1.5 0 0 1-1.65 1.5A18.9 18.9 0 0 1 11.1 18a18.6 18.6 0 0 1-5.7-5.7 18.9 18.9 0 0 1-3-8.3A1.5 1.5 0 0 1 3.9 2.3h3A1.5 1.5 0 0 1 8.4 3.6c.1.9.4 1.8.7 2.6a1.5 1.5 0 0 1-.3 1.6L7.5 9.1a15 15 0 0 0 7.4 7.4l1.3-1.3a1.5 1.5 0 0 1 1.6-.3c.8.3 1.7.6 2.6.7a1.5 1.5 0 0 1 .6.9Z" /></svg>
        </span>
        <p><strong>{{ t('contact_page.hotline_title') }}</strong><a :href="`tel:${hotline.replace(/\s+/g, '')}`">{{ hotline }}</a></p>
      </li>
      <li>
        <span class="contact-detail-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>
        </span>
        <p><strong>{{ t('contact_page.email_title') }}</strong><a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a></p>
      </li>
      <li>
        <span class="contact-detail-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
        </span>
        <p><strong>{{ t('contact_page.working_hours_title') }}</strong><span>{{ workingHours }}</span></p>
      </li>
    </ul>
    <img
      class="contact-interior-image"
      :src="image || '/images/image-3.webp'"
      :alt="t('contact_page.interior_image_alt')"
      loading="lazy"
      width="1400"
      height="900"
    >
  </aside>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'
import { useSiteSettings } from '~/composables/useSiteSettings'

defineProps<{
  image?: string
}>()

const { t } = useI18n()
const { hotline, contactEmail, address, workingHours } = useSiteSettings()
</script>

<style scoped>
.contact-details {
  display: flex;
  flex-direction: column;
  gap: 36px;
}

.contact-details-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.contact-details-list li {
  display: flex;
  align-items: center;
  gap: 16px;
}

.contact-detail-icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(245, 242, 235, .06);
  color: var(--color-gold, #c5a880);
}

.contact-detail-icon svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.75;
}

.contact-details-list p {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;
  font-size: 18px;
  line-height: 1.5;
}

.contact-details-list strong {
  color: var(--color-gold, #c5a880);
  font-family: var(--font-serif);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: .05em;
  text-transform: uppercase;
}

.contact-details-list span,
.contact-details-list a {
  color: var(--color-text, #f5f2eb);
  text-decoration: none;
}

.contact-details-list a:hover {
  color: var(--color-gold, #c5a880);
}

.contact-interior-image {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 4px;
  object-fit: cover;
  box-shadow: 0 10px 30px rgba(0, 0, 0, .3);
}
</style>
