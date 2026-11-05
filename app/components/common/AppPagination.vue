<template>
  <nav
    v-if="pageCount > 1"
    class="app-pagination"
    :class="{ 'is-compact': compact }"
    :aria-label="ariaLabel || t('common.pagination_label', 'Phân trang')"
  >
    <button
      type="button"
      class="pagination-btn pagination-arrow"
      :aria-label="t('common.previous_page', 'Trang trước')"
      :disabled="currentPage <= 1 || loading"
      @click="goToPage(currentPage - 1)"
    >
      ‹
    </button>

    <template v-for="(item, index) in paginationItems" :key="`${item}-${index}`">
      <span v-if="item === 'ellipsis'" class="pagination-ellipsis" aria-hidden="true">…</span>
      <button
        v-else
        type="button"
        class="pagination-btn pagination-number"
        :class="{ 'is-active': currentPage === item }"
        :aria-current="currentPage === item ? 'page' : undefined"
        :aria-label="t('common.go_to_page', 'Đi tới trang {page}', { page: item })"
        :disabled="loading"
        @click="goToPage(item)"
      >
        {{ item }}
      </button>
    </template>

    <button
      type="button"
      class="pagination-btn pagination-arrow"
      :aria-label="t('common.next_page', 'Trang tiếp theo')"
      :disabled="currentPage >= pageCount || loading"
      @click="goToPage(currentPage + 1)"
    >
      ›
    </button>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'

const props = withDefaults(
  defineProps<{
    currentPage: number
    pageCount: number
    loading?: boolean
    ariaLabel?: string
    compact?: boolean
  }>(),
  {
    loading: false,
    ariaLabel: '',
    compact: false,
  }
)

const emit = defineEmits<{
  'update:currentPage': [page: number]
  change: [page: number]
}>()

const { t } = useI18n()

const paginationItems = computed<Array<number | 'ellipsis'>>(() => {
  if (props.pageCount <= 7) {
    return Array.from({ length: props.pageCount }, (_, index) => index + 1)
  }

  const visible = new Set([1, props.pageCount, props.currentPage, props.currentPage - 1, props.currentPage + 1])
  const numbers = [...visible]
    .filter(value => value >= 1 && value <= props.pageCount)
    .sort((a, b) => a - b)
  const items: Array<number | 'ellipsis'> = []

  numbers.forEach((number, index) => {
    if (index > 0 && number - numbers[index - 1] > 1) items.push('ellipsis')
    items.push(number)
  })
  return items
})

function goToPage(page: number) {
  if (page < 1 || page > props.pageCount || page === props.currentPage || props.loading) return
  emit('update:currentPage', page)
  emit('change', page)
}
</script>

<style scoped>
.app-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 48px;
  flex-wrap: wrap;
}

.pagination-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  height: 44px;
  padding: 0 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.03);
  color: #fff;
  font-family: inherit;
  font-size: 14px;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  border-radius: 4px;
}

.pagination-btn:hover:not(:disabled) {
  border-color: var(--color-accent-gold, #c4a962);
  color: var(--color-accent-gold, #c4a962);
  background: rgba(196, 169, 98, 0.08);
  transform: translateY(-1px);
}

.pagination-btn.is-active {
  background: var(--color-accent-gold, #c4a962);
  border-color: var(--color-accent-gold, #c4a962);
  color: #0d0f12;
  font-weight: 600;
  cursor: default;
}

.pagination-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  transform: none;
}

.pagination-arrow {
  font-size: 18px;
  line-height: 1;
}

.pagination-ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 44px;
  color: var(--color-muted, #aaa7a0);
}

.pagination-btn:focus-visible {
  outline: 2px solid var(--color-accent-gold, #c4a962);
  outline-offset: 2px;
}

.app-pagination.is-compact {
  margin-top: 32px;
}

.app-pagination.is-compact .pagination-btn {
  min-width: 30px;
  height: 34px;
  padding: 0;
  border: 0;
  border-bottom: 1px solid transparent;
  border-radius: 0;
  background: transparent;
  color: var(--color-text);
  font-size: 11px;
  letter-spacing: normal;
  transition: color 180ms ease, border-color 180ms ease;
}

.app-pagination.is-compact .pagination-btn:hover:not(:disabled),
.app-pagination.is-compact .pagination-btn.is-active {
  border-bottom-color: var(--color-gold);
  background: transparent;
  color: var(--color-gold);
  transform: none;
}

.app-pagination.is-compact .pagination-btn:disabled {
  color: #62605b;
  opacity: 1;
}

.app-pagination.is-compact .pagination-arrow {
  font-size: 20px;
}

.app-pagination.is-compact .pagination-ellipsis {
  min-width: auto;
  height: 34px;
  color: var(--color-muted);
  font-size: 11px;
}

@media (max-width: 640px) {
  .app-pagination {
    gap: 6px;
    margin-top: 36px;
  }
  .pagination-btn {
    min-width: 38px;
    height: 38px;
    padding: 0 8px;
    font-size: 13px;
  }
}
</style>
