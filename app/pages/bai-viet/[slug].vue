<script setup lang="ts">
const route = useRoute()
const slug = encodeURIComponent(String(route.params.slug || ''))

await navigateTo(
  { path: `/tin-tuc/${slug}`, query: route.query },
  { redirectCode: 301, replace: true },
)
</script>
