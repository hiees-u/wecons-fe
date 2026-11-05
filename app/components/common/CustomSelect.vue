<template>
  <div class="custom-select">
    <select
      :id="id"
      class="custom-select-control"
      :value="modelValue"
      @change="updateValue"
    >
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <span class="custom-select-indicator" aria-hidden="true"></span>
  </div>
</template>

<script setup lang="ts">
export type CustomSelectOption = {
  value: string
  label: string
}

defineProps<{
  id: string
  modelValue: string
  options: readonly CustomSelectOption[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function updateValue(event: Event): void {
  emit('update:modelValue', (event.target as HTMLSelectElement).value)
}
</script>

<style scoped>
.custom-select {
  position: relative;
  width: 100%;
}

.custom-select-control {
  width: 100%;
  min-height: 54px;
  padding-right: 42px !important;
  appearance: none;
  cursor: pointer;
}

.custom-select-indicator {
  position: absolute;
  top: 50%;
  right: 18px;
  width: 9px;
  height: 9px;
  border-right: 1px solid currentColor;
  border-bottom: 1px solid currentColor;
  color: var(--color-muted);
  pointer-events: none;
  transform: translateY(-70%) rotate(45deg);
}
</style>
