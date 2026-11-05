<template>
  <div
    class="app-feedback-state"
    :class="`is-${type}`"
    :role="type === 'loading' ? 'status' : type === 'error' ? 'alert' : undefined"
  >
    <div v-if="type === 'loading'" class="feedback-spinner" aria-hidden="true"></div>

    <p v-if="eyebrow" class="feedback-eyebrow">
      <span aria-hidden="true"></span> {{ eyebrow }}
    </p>

    <h2 v-if="title" class="feedback-title">{{ title }}</h2>
    <p v-if="description" class="feedback-desc">{{ description }}</p>

    <slot />

    <div v-if="type === 'error' && showRetry" class="feedback-actions">
      <button type="button" class="feedback-btn retry-btn" @click="$emit('retry')">
        {{ retryLabel || t('common.refresh', 'Thử lại') }}
        <span aria-hidden="true">↻</span>
      </button>
    </div>

    <div v-else-if="type === 'empty' && ctaTo && ctaLabel" class="feedback-actions">
      <NuxtLink :to="ctaTo" class="feedback-btn cta-link">
        {{ ctaLabel }}
        <span aria-hidden="true">↗</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'

withDefaults(
  defineProps<{
    type?: 'loading' | 'error' | 'empty'
    eyebrow?: string
    title?: string
    description?: string
    retryLabel?: string
    ctaLabel?: string
    ctaTo?: string
    showRetry?: boolean
  }>(),
  {
    type: 'empty',
    eyebrow: '',
    title: '',
    description: '',
    retryLabel: '',
    ctaLabel: '',
    ctaTo: '',
    showRetry: true,
  }
)

defineEmits<{
  retry: []
}>()

const { t } = useI18n()
</script>

<style scoped>
.app-feedback-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 64px 24px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px dashed rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  min-height: 260px;
  width: 100%;
}

.feedback-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-accent-gold, #c4a962);
  margin-bottom: 12px;
}

.feedback-eyebrow span {
  width: 18px;
  height: 1px;
  background: currentColor;
}

.feedback-title {
  font-size: 20px;
  font-weight: 500;
  color: #fff;
  margin: 0 0 10px;
  letter-spacing: 0.02em;
}

.feedback-desc {
  font-size: 15px;
  color: var(--color-muted, #aaa7a0);
  max-width: 520px;
  line-height: 1.6;
  margin: 0 0 24px;
}

.feedback-spinner {
  width: 36px;
  height: 36px;
  border: 2px solid rgba(196, 169, 98, 0.2);
  border-top-color: var(--color-accent-gold, #c4a962);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.feedback-actions {
  display: flex;
  gap: 12px;
}

.feedback-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.25s ease;
  text-decoration: none;
}

.retry-btn {
  background: transparent;
  color: var(--color-accent-gold, #c4a962);
  border: 1px solid var(--color-accent-gold, #c4a962);
  font-family: inherit;
}

.retry-btn:hover {
  background: rgba(196, 169, 98, 0.1);
  transform: translateY(-1px);
}

.cta-link {
  background: var(--color-accent-gold, #c4a962);
  color: #0d0f12;
  font-weight: 600;
  border: 1px solid var(--color-accent-gold, #c4a962);
}

.cta-link:hover {
  background: #d4ba74;
  transform: translateY(-1px);
}
</style>
