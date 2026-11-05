import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { usePostCategories } from '~/composables/usePostCategories'

export async function useHouseModelCategories() {
  const { t } = useI18n()
  const { categories: postCategories, error } = await usePostCategories()

  const categories = computed(() => [
    { id: 'all', label: t('house_models_page.category_all') },
    ...postCategories.value.map(category => ({
      id: category.slug,
      label: category.name,
    })),
  ])

  return { categories, error }
}
