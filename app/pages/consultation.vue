<template>
  <div />
</template>

<script setup lang="ts">
const route = useRoute()

await navigateTo(
  { path: '/lien-he', query: route.query, hash: route.hash },
  { redirectCode: 301, replace: true },
)
</script>
