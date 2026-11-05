<template>
  <div>
    <UnderConstruction
      :title="t('services_page.hero_title')"
      endpoint="features"
      :loading="loading"
      :api-loaded="apiLoaded"
      :api-data="services"
      :items="services"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRealEstate } from '~/composables/useRealEstate'
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()

const { getFeatures } = useRealEstate()
const loading = ref(true)
const apiLoaded = ref(false)
const services = ref<any[]>([])

const fetchData = async () => {
  loading.value = true
  const res = await getFeatures()
  if (res && res.success) {
    apiLoaded.value = true
    services.value = res.data || []
  }
  loading.value = false
}

onMounted(() => {
  fetchData()
})

await useCmsPageMeta('serviceCategories', {
  title: computed(() => `${t('services_page.banner_title')} - WE Construction`),
  description: computed(() => t('services_page.meta_desc')),
})
</script>
