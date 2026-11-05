<template>
  <div class="lang-switcher" role="group" aria-label="Language selector">
    <button
      type="button"
      class="lang-btn"
      :class="{ active: locale === 'vi' }"
      :aria-pressed="locale === 'vi'"
      title="Tiếng Việt"
      @click="setLocale('vi')"
    >
      VI
    </button>
    <span class="divider" aria-hidden="true">/</span>
    <button
      type="button"
      class="lang-btn"
      :class="{ active: locale === 'en' }"
      :aria-pressed="locale === 'en'"
      title="English"
      @click="setLocale('en')"
    >
      EN
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'

const { locale, setLocale } = useI18n()
</script>

<style scoped>
.lang-switcher {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  background: #141414;
  padding: 3px 6px;
  border-radius: 16px;
  border: 1px solid rgba(214, 179, 106, 0.25);
}

.lang-btn {
  background: none;
  border: none;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.8px;
  color: #aaa7a0;
  cursor: pointer;
  padding: 2px 7px;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.lang-btn:hover {
  color: #f5f2eb;
}

.lang-btn.active {
  background: #d6b36a;
  color: #090909;
}

.divider {
  font-size: 10px;
  color: rgba(214, 179, 106, 0.3);
}
</style>
