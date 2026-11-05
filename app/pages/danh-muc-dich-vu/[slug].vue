<template>
  <ServiceDetailPage :slug="slug" parent-to="/danh-muc-dich-vu" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ServiceDetailPage from '~/components/services/ServiceDetailPage.vue'

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))
</script>
