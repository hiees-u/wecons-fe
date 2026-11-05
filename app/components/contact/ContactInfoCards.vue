<template>
  <div class="contact-cards-grid">
    <div class="contact-card">
      <div class="card-icon">📍</div>
      <h3>{{ t('contact_page.address_title') }}</h3>
      <p>{{ address || t('footer.address_val') }}</p>
    </div>

    <div class="contact-card">
      <div class="card-icon">📞</div>
      <h3>{{ t('contact_page.hotline_title') }}</h3>
      <p>
        <a :href="'tel:' + hotline.replace(/\s+/g, '')" class="contact-link">{{ hotline }}</a>
      </p>
      <small v-if="phoneSecondary">{{ phoneSecondary }}</small>
    </div>

    <div class="contact-card">
      <div class="card-icon">✉️</div>
      <h3>{{ t('contact_page.email_title') }}</h3>
      <p>
        <a :href="'mailto:' + contactEmail" class="contact-link">{{ contactEmail }}</a>
      </p>
      <small v-if="emailSupport">{{ emailSupport }}</small>
    </div>

    <div class="contact-card">
      <div class="card-icon">🕒</div>
      <h3>{{ t('contact_page.working_hours_title') }}</h3>
      <p>{{ workingHours || t('contact_page.working_hours_val') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'
import { useSiteSettings } from '~/composables/useSiteSettings'

const { t } = useI18n()
const { hotline, phoneSecondary, contactEmail, address, workingHours, settings } = useSiteSettings()
const emailSupport = computed(() => settings.value.email_support || 'chanh.pth76@gmail.com')
</script>

<style scoped>
.contact-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

.contact-card {
  padding: 32px 28px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  transition: border-color 0.25s ease;
}

.contact-card:hover {
  border-color: var(--color-gold);
}

.card-icon {
  font-size: 24px;
  margin-bottom: 16px;
}

.contact-card h3 {
  color: var(--color-text);
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
}

.contact-card p {
  color: var(--color-muted);
  font-size: 13px;
  line-height: 1.7;
}

.contact-card small {
  margin-top: 6px;
  color: var(--color-subtle);
  font-size: 10px;
}

.contact-link {
  color: var(--color-gold);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.25s ease;
}

.contact-link:hover {
  color: var(--color-champagne);
}

@media (max-width: 600px) {
  .contact-cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>
