<template>
  <div>
    <UnderConstruction
      :title="t('common.product_detail_title', { slug: slug })"
      :endpoint="`properties/${slug}`"
      :loading="loading"
      :api-loaded="apiLoaded"
      :api-data="property"
      :items="property ? [property] : []"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRealEstate } from '~/composables/useRealEstate'
import { useI18n } from '~/composables/useI18n'

const route = useRoute()
const { t } = useI18n()
const slug = computed(() => String(route.params.slug || ''))

const { getProperty } = useRealEstate()
const loading = ref(true)
const apiLoaded = ref(false)
const property = ref<any>(null)

onMounted(async () => {
  if (!slug.value) return
  const res = await getProperty(slug.value)
  if (res && res.success) {
    apiLoaded.value = true
    property.value = res.data
  }
  loading.value = false
})

await useCmsPageMeta('productDetail', {
  title: computed(() => t('common.product_detail_meta', { slug: slug.value })),
})
</script>
