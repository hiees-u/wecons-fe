<template>
  <div class="under-construction-page">
    <div class="container">
      <div class="status-banner">
        <div class="badge-pill">
          <span class="pulse-dot"></span>
          <span>{{ t('common.system_developing') }}</span>
        </div>
        <h1 class="page-title">{{ title }}</h1>
        <p class="construction-notice">
          🚧 <strong>{{ t('common.under_construction') }}</strong>. 
          {{ t('common.construction_notice', { endpoint }) }}
        </p>
      </div>

      <div class="action-bar">
        <NuxtLink to="/" class="btn-back">{{ t('common.back_home') }}</NuxtLink>
        <NuxtLink to="/bao-gia" class="btn-quote">{{ t('common.get_quote') }}</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'

defineProps<{
  title: string
  endpoint: string
  loading?: boolean
  apiLoaded?: boolean
  apiData?: any
  items?: any[]
}>()

const { t } = useI18n()
</script>

<style scoped>
.under-construction-page {
  padding: clamp(60px, 8vw, 100px) 0;
  min-height: calc(100vh - 300px);
  background: var(--color-bg);
  color: var(--color-text);
  display: flex;
  align-items: center;
}

.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px;
  width: 100%;
}

.status-banner {
  text-align: center;
  margin-bottom: 40px;
}

.badge-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(200, 169, 126, 0.12);
  color: var(--color-gold);
  border: 1px solid rgba(200, 169, 126, 0.3);
  padding: 6px 18px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 20px;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-gold);
  box-shadow: 0 0 0 4px rgba(200, 169, 126, 0.25);
  animation: pulse-ring 2s infinite;
}

@keyframes pulse-ring {
  0% {
    box-shadow: 0 0 0 0 rgba(200, 169, 126, 0.4);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(200, 169, 126, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(200, 169, 126, 0);
  }
}

.page-title {
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 16px;
  letter-spacing: -0.5px;
}

.construction-notice {
  font-size: 16px;
  color: var(--color-muted);
  max-width: 620px;
  margin: 0 auto;
  line-height: 1.7;
}

.construction-notice strong {
  color: var(--color-champagne);
}

.action-bar {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 36px;
  flex-wrap: wrap;
}

.btn-back {
  padding: 12px 26px;
  background: rgba(255, 255, 255, 0.06);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.25);
}

.btn-quote {
  padding: 12px 26px;
  background: var(--color-gold);
  color: #121212;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-quote:hover {
  background: var(--color-champagne);
  box-shadow: 0 8px 24px rgba(200, 169, 126, 0.25);
}
</style>
