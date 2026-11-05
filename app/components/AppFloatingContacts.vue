<template>
  <nav class="floating-contacts" :aria-label="t('common.quick_contact')">
    <a
      v-if="hotline"
      class="floating-contact contact-phone"
      :href="'tel:' + hotline.replace(/\s+/g, '')"
      :aria-label="t('common.call_action', { name: brandName })"
      :title="t('common.call_action', { name: brandName })"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.44-5.15-3.75-6.59-6.59l1.97-1.57c.28-.28.36-.67.25-1.02A11.36 11.36 0 0 1 8.56 4.3a1 1 0 0 0-1-1H4.07a1 1 0 0 0-1 1C3.07 13.9 10.1 20.93 19.93 20.93a1 1 0 0 0 1-1v-3.55a1 1 0 0 0-.92-1z"/>
      </svg>
    </a>
    <a
      v-if="socialZalo"
      class="floating-contact contact-zalo"
      :href="socialZalo"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="t('common.zalo_contact', { name: brandName })"
      :title="t('common.zalo_name')"
    >
      <span class="zalo-text">{{ t('common.zalo_name') }}</span>
    </a>
    <a
      v-if="socialFacebook"
      class="floating-contact contact-facebook"
      :href="socialFacebook"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="t('common.facebook_contact', { name: brandName })"
      :title="t('common.facebook_name')"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    </a>
    <a
      class="floating-contact contact-messenger"
      :href="messengerUrl"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="t('common.messenger_contact', { name: brandName })"
      :title="t('common.messenger_name')"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.455 5.512 3.734 7.205V22l3.39-1.86c.91.25 1.876.386 2.876.386 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2zm1.066 12.443l-2.72-2.9-5.308 2.9 5.839-6.2 2.787 2.9 5.24-2.9-5.838 6.2z"/>
      </svg>
    </a>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useSiteSettings } from '~/composables/useSiteSettings'

const { t } = useI18n()
const { hotline, socialZalo, socialFacebook, settings } = useSiteSettings()
const brandName = computed(() => settings.value?.site_title || t('footer.brand_name'))

const messengerUrl = computed(() => {
  const fb = socialFacebook.value || ''
  const clean = fb.replace(/^https?:\/\/(www\.)?facebook\.com\//i, '').replace(/\/$/, '')
  return clean ? `https://m.me/${clean}` : 'https://m.me/'
})
</script>

<style scoped>
.floating-contacts {
  position: fixed;
  right: clamp(16px, 2.5vw, 28px);
  bottom: clamp(24px, 4vw, 42px);
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.floating-contact {
  position: relative;
  display: flex;
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 50%;
  background: rgba(18, 18, 18, 0.72);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: #fff;
  text-decoration: none;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
  transition:
    border-color 220ms ease,
    background-color 220ms ease,
    transform 220ms ease,
    box-shadow 220ms ease;
}

.floating-contact:hover {
  border-color: rgba(255, 255, 255, 0.7);
  background: rgba(30, 30, 30, 0.95);
  transform: scale(1.08);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
}

.floating-contact:focus-visible {
  outline: 2px solid var(--color-champagne);
  outline-offset: 3px;
}

.floating-contact svg {
  display: block;
}

.contact-phone svg {
  transform: rotate(-10deg);
}

.floating-contact i {
  font-size: 20px;
  line-height: 1;
}

.contact-phone i {
  font-size: 19px;
  transform: rotate(-10deg);
}

.zalo-text {
  font-family: var(--font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: -0.3px;
  color: #fff;
}

.contact-facebook i {
  font-size: 21px;
}

.contact-messenger i {
  font-size: 20px;
}

@media (max-width: 767px) {
  .floating-contacts {
    right: 9px;
    bottom: calc(12px + env(safe-area-inset-bottom, 0px));
    gap: 10px;
  }

  .floating-contact {
    width: 48px;
    height: 48px;
  }

  .floating-contact i {
    font-size: 18px;
  }

  .floating-contact svg {
    width: 20px;
    height: 20px;
  }

  .zalo-text {
    font-size: 9px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .floating-contact {
    transition: none;
  }
}
</style>
