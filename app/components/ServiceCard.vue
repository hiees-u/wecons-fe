<template>
  <div class="service-card">
    <div class="service-icon">{{ icon || '📐' }}</div>
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon?: string
  title: string
  description: string
}>()
</script>

<style scoped>
.service-card {
  background: #ffffff;
  padding: 32px 24px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: transform 0.2s, box-shadow 0.2s;
}

.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.1);
}

.service-icon {
  font-size: 36px;
  margin-bottom: 16px;
}

.service-card h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 10px;
  color: #0f172a;
}

.service-card p {
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
}
</style>
