<template>
  <nav class="app-breadcrumb" :aria-label="ariaLabel || t('common.breadcrumb_label', 'Điều hướng trang')">
    <ol class="breadcrumb-list">
      <li v-for="(item, index) in items" :key="index" class="breadcrumb-item">
        <NuxtLink v-if="item.to && index < items.length - 1" :to="item.to" class="breadcrumb-link">
          {{ item.label }}
        </NuxtLink>
        <span v-else class="breadcrumb-current" aria-current="page">
          {{ item.label }}
        </span>
        <span v-if="index < items.length - 1" class="breadcrumb-separator" aria-hidden="true">›</span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'

export interface BreadcrumbItem {
  label: string
  to?: string
}

defineProps<{
  items: BreadcrumbItem[]
  ariaLabel?: string
}>()

const { t } = useI18n()
</script>

<style scoped>
.app-breadcrumb {
  display: block;
  margin-bottom: 12px;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 8px;
  font-size: 13px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.breadcrumb-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--color-muted, #aaa7a0);
}

.breadcrumb-link {
  color: var(--color-muted, #aaa7a0);
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb-link:hover {
  color: var(--color-gold, #d6b36a);
}

.breadcrumb-current {
  color: var(--color-gold, #d6b36a);
  font-weight: 500;
}

.breadcrumb-separator {
  color: var(--color-subtle, #77746f);
  user-select: none;
}
</style>
