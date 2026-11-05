<template>
  <section class="hero">
    <div class="container hero-content">
      <div class="hero-badge">
        <span class="dot"></span> {{ t('home.hero_badge') }}
      </div>
      <h1 class="hero-title">
        {{ t('home.hero_title_1') }} <br />
        <span class="highlight">{{ t('home.hero_title_2') }}</span>
      </h1>
      <p class="hero-desc">{{ t('home.hero_desc') }}</p>

      <div class="api-status-card">
        <div class="api-header">
          <div class="api-pulse" :class="{ active: apiConnected }"></div>
          <strong>{{ t('home.api_status_label') }}</strong>
          <span class="status-tag" :class="apiConnected ? 'tag-green' : 'tag-orange'">
            {{ apiConnected ? t('common.status_connected') : t('common.status_waiting') }}
          </span>
        </div>
        <div class="api-endpoint">
          <code>API: {{ apiBase }}</code>
          <code v-if="adminUrl">Admin: {{ adminUrl }}</code>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useNavigation } from '~/composables/useNavigation'
import { useI18n } from '~/composables/useI18n'

defineProps<{
  apiConnected?: boolean
}>()

const { apiBase, adminUrl } = useNavigation()
const { t } = useI18n()
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #ffffff;
  padding: 80px 0 60px;
  text-align: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(217, 119, 6, 0.15);
  color: #fbbf24;
  border: 1px solid rgba(217, 119, 6, 0.3);
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 24px;
}

.dot {
  width: 8px;
  height: 8px;
  background-color: #22c55e;
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
}

.hero-title {
  font-size: 48px;
  line-height: 1.2;
  font-weight: 800;
  margin-bottom: 20px;
}

.highlight {
  color: #f59e0b;
}

.hero-desc {
  max-width: 680px;
  margin: 0 auto 36px;
  color: #94a3b8;
  font-size: 16px;
  line-height: 1.6;
}

.api-status-card {
  max-width: 580px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  padding: 16px 20px;
}

.api-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 14px;
  margin-bottom: 10px;
}

.api-pulse {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #f59e0b;
}

.api-pulse.active {
  background: #22c55e;
  box-shadow: 0 0 10px #22c55e;
}

.status-tag {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
}

.tag-green {
  background: rgba(34, 197, 94, 0.2);
  color: #4ade80;
}

.tag-orange {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
}

.api-endpoint {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.api-endpoint code {
  font-size: 12px;
  color: #cbd5e1;
  background: rgba(0, 0, 0, 0.3);
  padding: 3px 8px;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 32px;
  }
}
</style>
