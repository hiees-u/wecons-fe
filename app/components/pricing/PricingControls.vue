<template>
  <div class="calculator-controls">
    <fieldset class="calculator-fieldset">
      <legend>{{ t('pricing_page.legend_building_type') }}</legend>
      <div class="choice-list choice-list-inline">
        <label v-for="type in buildingTypes" :key="type.value" class="choice-item">
          <input
            :checked="buildingType === type.value"
            type="radio"
            name="buildingType"
            :value="type.value"
            @change="$emit('update:buildingType', type.value)"
          >
          <span>{{ type.label }}</span>
        </label>
      </div>
    </fieldset>

    <div class="calculator-field-row">
      <div class="calculator-field">
        <label for="floor-area">{{ t('pricing_page.label_floor_area') }}</label>
        <input
          id="floor-area"
          :value="floorArea"
          type="number"
          min="20"
          max="2000"
          step="1"
          inputmode="numeric"
          aria-describedby="area-help"
          @input="$emit('update:floorArea', Number(($event.target as HTMLInputElement).value))"
        >
        <small id="area-help">{{ t('pricing_page.help_floor_area') }}</small>
      </div>
      <div class="calculator-field">
        <label for="floor-count">{{ t('pricing_page.label_floor_count') }}</label>
        <select
          id="floor-count"
          :value="floorCount"
          @change="$emit('update:floorCount', Number(($event.target as HTMLSelectElement).value))"
        >
          <option v-for="floors in floorCountOptions" :key="floors" :value="floors">
            {{ floors }} {{ t('pricing_page.floors_suffix') }}
          </option>
        </select>
      </div>
    </div>
    <p v-if="areaError" class="calculator-error" role="alert">{{ areaError }}</p>

    <fieldset class="calculator-fieldset">
      <legend>
        {{ t('pricing_page.legend_package') }}
        <span>{{ t('pricing_page.choose_one') }}</span>
      </legend>
      <div class="choice-list">
        <label v-for="option in constructionPackages" :key="option.value" class="package-choice">
          <input
            :checked="packageType === option.value"
            type="radio"
            name="constructionPackage"
            :value="option.value"
            @change="$emit('update:packageType', option.value)"
          >
          <span>
            <strong>{{ option.label }}</strong>
            <small>{{ option.description }}</small>
          </span>
        </label>
      </div>
    </fieldset>

    <fieldset class="calculator-fieldset">
      <legend>
        {{ t('pricing_page.legend_addons') }}
        <span>{{ t('pricing_page.choose_multiple') }}</span>
      </legend>
      <div class="choice-list">
        <label class="choice-item">
          <input
            :checked="includeDesign"
            type="checkbox"
            @change="$emit('update:includeDesign', ($event.target as HTMLInputElement).checked)"
          >
          <span>{{ t('pricing_page.design_service') }} <small>{{ formatCurrency(designServiceRate) }} {{ t('pricing_page.per_sqm') }}</small></span>
        </label>
        <label v-for="service in optionalServices" :key="service.id" class="choice-item">
          <input
            :checked="selectedAddons.includes(service.id)"
            type="checkbox"
            :value="service.id"
            @change="toggleAddon(service.id, ($event.target as HTMLInputElement).checked)"
          >
          <span>{{ service.label }} <small>{{ formatCurrency(service.ratePerSqm) }} {{ t('pricing_page.per_sqm') }}</small></span>
        </label>
      </div>
    </fieldset>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'
import type { BuildingType, ConstructionPackage, ConstructionPackageOption } from '~/types/content'

const props = defineProps<{
  buildingType: BuildingType
  floorArea: number
  floorCount: number
  packageType: ConstructionPackage
  includeDesign: boolean
  selectedAddons: string[]
  buildingTypes: Array<{ value: BuildingType; label: string }>
  constructionPackages: ConstructionPackageOption[]
  floorCountOptions: number[]
  optionalServices: Array<{ id: string; label: string; ratePerSqm: number }>
  designServiceRate: number
  areaError: string
}>()

const emit = defineEmits<{
  'update:buildingType': [value: BuildingType]
  'update:floorArea': [value: number]
  'update:floorCount': [value: number]
  'update:packageType': [value: ConstructionPackage]
  'update:includeDesign': [value: boolean]
  'update:selectedAddons': [value: string[]]
}>()

const { t } = useI18n()

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amount)
}

function toggleAddon(id: string, checked: boolean): void {
  const next = checked
    ? [...props.selectedAddons, id]
    : props.selectedAddons.filter(item => item !== id)
  emit('update:selectedAddons', next)
}
</script>

<style scoped>
.calculator-controls {
  padding: 30px 42px 30px 0;
}

.calculator-fieldset {
  margin-bottom: 28px;
  padding: 0;
  border: 0;
}

.calculator-fieldset legend {
  margin-bottom: 15px;
  color: var(--color-text);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 1.2px;
}

.calculator-fieldset legend span {
  margin-left: 8px;
  color: var(--color-subtle);
  font-size: 7px;
}

.choice-list {
  display: grid;
  gap: 10px;
}

.choice-list-inline {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.choice-item,
.package-choice {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: #d6d2ca;
  font-size: 11px;
  line-height: 1.6;
  cursor: pointer;
}

.choice-item input,
.package-choice input {
  width: 15px;
  height: 15px;
  flex: 0 0 15px;
  margin-top: 2px;
  accent-color: var(--color-gold);
}

.choice-item input:focus-visible,
.package-choice input:focus-visible {
  outline: 2px solid var(--color-champagne);
  outline-offset: 3px;
}

.choice-item small {
  display: block;
  margin-top: 3px;
  color: var(--color-subtle);
  font-size: 9px;
}

.package-choice {
  padding: 12px 0;
  border-bottom: 1px solid rgba(245, 242, 235, 0.1);
}

.package-choice strong,
.package-choice small {
  display: block;
}

.package-choice strong {
  color: var(--color-text);
  font-size: 11px;
  font-weight: 500;
}

.package-choice small {
  margin-top: 4px;
  color: var(--color-subtle);
  font-size: 9px;
}

.calculator-field-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 14px;
}

.calculator-field {
  display: grid;
  gap: 8px;
}

.calculator-field label {
  color: var(--color-text);
  font-size: 11px;
}

.calculator-field input,
.calculator-field select {
  width: 100%;
  min-height: 45px;
  padding: 10px 12px;
  border: 1px solid rgba(245, 242, 235, 0.18);
  border-radius: 0;
  outline: none;
  background: #10100f;
  color: var(--color-text);
  font-size: 13px;
}

.calculator-field input:focus-visible,
.calculator-field select:focus-visible {
  border-color: var(--color-gold);
}

.calculator-field small {
  color: var(--color-subtle);
  font-size: 9px;
}

.calculator-error {
  margin: -5px 0 20px;
  color: #e3a394;
  font-size: 11px;
}

@media (max-width: 820px) {
  .calculator-controls {
    padding-right: 0;
  }
}

@media (max-width: 520px) {
  .choice-list-inline,
  .calculator-field-row {
    grid-template-columns: 1fr;
  }

  .calculator-controls {
    padding-top: 24px;
  }
}
</style>
