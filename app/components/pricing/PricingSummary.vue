<template>
  <aside class="estimate-summary" aria-live="polite">
    <p class="estimate-summary-label">{{ t('pricing_page.summary_building_type') }}</p>
    <p class="estimate-building-type">{{ buildingTypeLabel }}</p>
    <div class="estimate-rule"></div>

    <p class="estimate-summary-label">{{ t('pricing_page.summary_total_area') }}</p>
    <p class="estimate-area">{{ isValidArea ? formatArea(totalArea) : '—' }}</p>
    <div class="estimate-rule"></div>

    <p class="estimate-summary-label">{{ t('pricing_page.summary_estimate') }}</p>
    <p class="estimate-total">{{ isValidArea ? formatCurrency(totalEstimate) : '—' }}</p>

    <ul class="estimate-breakdown">
      <li v-for="line in breakdown" :key="line.label">
        <span>{{ line.label }}</span>
        <strong>{{ formatCurrency(line.amount) }}</strong>
      </li>
    </ul>

    <button class="calculator-reset" type="button" @click="$emit('reset')">
      {{ t('pricing_page.btn_reset') }} <span aria-hidden="true">↺</span>
    </button>
    <NuxtLink class="estimate-cta" to="/lien-he#consultation-form">
      {{ t('pricing_page.cta_discuss') }} <span aria-hidden="true">↗</span>
    </NuxtLink>
    <p class="estimate-disclaimer">{{ t('pricing_page.disclaimer') }}</p>
  </aside>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'

defineProps<{
  buildingTypeLabel: string
  isValidArea: boolean
  totalArea: number
  totalEstimate: number
  breakdown: Array<{ label: string; amount: number }>
}>()

defineEmits<{
  reset: []
}>()

const { t } = useI18n()

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amount)
}

function formatArea(area: number): string {
  return `${new Intl.NumberFormat('vi-VN').format(area)} m²`
}
</script>

<style scoped>
.estimate-summary {
  align-self: stretch;
  padding: 30px 0 28px 30px;
  border-left: 1px solid var(--color-border);
  background: #111;
}

.estimate-summary-label {
  color: var(--color-subtle);
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 1.2px;
}

.estimate-building-type {
  margin-top: 7px;
  color: var(--color-text);
  font-size: 15px;
}

.estimate-area {
  margin-top: 7px;
  color: var(--color-text);
  font-size: 21px;
}

.estimate-rule {
  height: 1px;
  margin: 24px 0;
  background: var(--color-border);
}

.estimate-total {
  margin-top: 8px;
  color: var(--color-champagne);
  font-family: var(--font-serif);
  font-size: clamp(27px, 3.4vw, 42px);
  line-height: 1.2;
  overflow-wrap: anywhere;
}

.estimate-breakdown {
  display: grid;
  gap: 12px;
  margin-top: 23px;
  padding: 18px 0;
  border-top: 1px solid rgba(245, 242, 235, 0.1);
  border-bottom: 1px solid rgba(245, 242, 235, 0.1);
  list-style: none;
}

.estimate-breakdown li {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: var(--color-muted);
  font-size: 9px;
  line-height: 1.6;
}

.estimate-breakdown strong {
  flex: 0 0 auto;
  color: #e9e5dc;
  font-weight: 500;
  text-align: right;
}

.calculator-reset {
  display: block;
  margin-top: 20px;
  padding: 9px 0;
  border: 0;
  background: none;
  color: var(--color-muted);
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 1px;
  cursor: pointer;
}

.calculator-reset:focus-visible {
  outline: 2px solid var(--color-champagne);
  outline-offset: 3px;
}

.estimate-cta {
  display: flex;
  min-height: 48px;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-top: 13px;
  padding: 0 15px;
  background: var(--color-gold);
  color: #100f0d;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 1px;
  text-decoration: none;
  transition: background-color 0.25s ease;
}

.estimate-cta:hover {
  background: var(--color-champagne);
}

.estimate-cta:focus-visible {
  outline: 2px solid var(--color-champagne);
  outline-offset: 4px;
}

.estimate-disclaimer {
  margin-top: 14px;
  color: var(--color-subtle);
  font-size: 9px;
  line-height: 1.7;
}

@media (max-width: 820px) {
  .estimate-summary {
    padding: 25px;
    border-top: 1px solid var(--color-border);
    border-left: 0;
  }
}

@media (max-width: 520px) {
  .estimate-summary {
    padding: 22px 17px;
  }
}
</style>
