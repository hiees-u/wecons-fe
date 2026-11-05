<template>
  <section v-if="rows.length" class="information-section content-shell">
    <h2>{{ t('product_detail.information_title') }}</h2>
    <dl class="information-table">
      <div v-for="row in rows" :key="row.label" class="information-row">
        <dt>{{ row.label }}</dt>
        <dd>{{ row.value }}</dd>
      </div>
    </dl>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'

defineProps<{
  rows: Array<{ label: string; value: string }>
}>()

const { t } = useI18n()
</script>

<style scoped>
.information-section {
  padding: clamp(36px, 5vw, 64px) 0;
  border-top: 1px solid rgba(245, 242, 235, .1);
}

.content-shell {
  width: min(1515px, calc(100% - var(--page-gutter, 24px) * 2));
  margin: 0 auto;
}

.information-section h2 {
  font-family: var(--font-serif);
  font-size: clamp(24px, 2.2vw, 32px);
  margin-bottom: 28px;
}

.information-table {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px clamp(24px, 4vw, 56px);
  margin: 0;
}

.information-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 12px 0;
  border-bottom: 1px solid rgba(245, 242, 235, .08);
}

.information-row dt {
  color: var(--color-gold);
  font-size: 15px;
  letter-spacing: .5px;
}

.information-row dd {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  text-align: right;
  color: #fff;
}

@media (max-width: 768px) {
  .information-table {
    grid-template-columns: 1fr;
  }
}
</style>
