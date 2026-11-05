<template>
  <section id="pricing" class="section home-estimate-section" aria-labelledby="home-estimate-title">
    <div class="section-heading">
      <div>
        <h2 id="home-estimate-title">{{ t('home.estimate.title') }}</h2>
      </div>
    </div>

    <div class="home-estimate-panel">
      <div class="home-estimate-controls">
        <div class="home-estimate-field">
          <label for="home-land-area">{{ t('home.estimate.land_area') }}</label>
          <div class="home-estimate-input-wrap">
            <input id="home-land-area" v-model.number="landArea" type="number" min="20" max="2000" step="1" inputmode="numeric">
            <span aria-hidden="true">m²</span>
          </div>
        </div>

        <div class="home-estimate-field">
          <label for="home-foundation">{{ t('home.estimate.foundation') }}</label>
          <select id="home-foundation" v-model="foundation">
            <option v-for="option in foundationOptions" :key="option.value" :value="option.value">
              {{ option.label }} ({{ Math.round(option.ratio * 100) }}%)
            </option>
          </select>
        </div>

        <div class="home-estimate-field">
          <label for="home-floor-count">{{ t('home.estimate.floor_count') }}</label>
          <select id="home-floor-count" v-model.number="floorCount">
            <option v-for="floors in floorOptions" :key="floors" :value="floors">{{ floors }}</option>
          </select>
        </div>

        <div class="home-estimate-field">
          <label for="home-basement-count">{{ t('home.estimate.basement_count') }}</label>
          <select id="home-basement-count" v-model.number="basementCount">
            <option v-for="count in basementOptions" :key="count" :value="count">{{ count }} {{ t('home.estimate.basements_suffix') }}</option>
          </select>
        </div>

        <div class="home-estimate-field home-estimate-field--basement-area">
          <label for="home-basement-area">{{ t('home.estimate.basement_area') }}</label>
          <div class="home-estimate-input-wrap">
            <input id="home-basement-area" v-model.number="basementArea" type="number" min="0" max="2000" step="1" inputmode="numeric">
            <span aria-hidden="true">m²</span>
          </div>
        </div>

        <div class="home-estimate-field">
          <label for="home-ground-floor-height">{{ t('home.estimate.ground_floor_height') }}</label>
          <select id="home-ground-floor-height" v-model.number="groundFloorHeight">
            <option v-for="height in groundFloorHeightOptions" :key="height" :value="height">{{ height }} m</option>
          </select>
        </div>

        <div class="home-estimate-field">
          <label for="home-roof">{{ t('home.estimate.roof') }}</label>
          <select id="home-roof" v-model="roof">
            <option v-for="option in roofOptions" :key="option.value" :value="option.value">
              {{ roofLabel(option.value) }} ({{ Math.round(option.ratio * 100) }}%)
            </option>
          </select>
        </div>

        <div class="home-estimate-field">
          <label for="home-yard">{{ t('home.estimate.yard') }}</label>
          <select id="home-yard" v-model="yard">
            <option v-for="option in yardOptions" :key="option.value" :value="option.value">
              {{ yardLabel(option.value, option.ratio) }}
            </option>
          </select>
        </div>

        <fieldset class="calculator-fieldset">
          <legend>{{ t('home.estimate.package') }}</legend>
          <div class="home-package-options">
            <label v-for="option in materialPackages" :key="option.value" class="home-package-option" :class="{ 'is-selected': packageType === option.value }">
              <input v-model="packageType" type="radio" name="homeConstructionPackage" :value="option.value">
              <span>{{ packageLabel(option.value) }}</span>
            </label>
          </div>
        </fieldset>

        <p v-if="showMobileDisclaimer" class="home-estimate-disclaimer services-estimate-disclaimer">
          {{ t('home.estimate.disclaimer') }}
        </p>
      </div>

      <aside class="home-estimate-summary" aria-live="polite">
        <h3>{{ t('home.estimate.summary_title') }}</h3>
        <p class="home-estimate-total"><strong>{{ formatNumber(estimatedTotal) }}</strong><span>{{ t('common.currency') }}</span></p>
        <dl>
          <div><dt>{{ t('home.estimate.land_area') }}</dt><dd>{{ formatArea(landArea) }}</dd></div>
          <div><dt>{{ t('home.estimate.floor_area') }}</dt><dd>{{ formatArea(floorArea) }} ({{ floorCount }} {{ t('home.estimate.floors_suffix') }})</dd></div>
          <!-- <div><dt>{{ t('home.estimate.basement_count') }}</dt><dd>{{ basementCount }} {{ t('home.estimate.basements_suffix') }}</dd></div> -->
          <!-- <div><dt>{{ t('home.estimate.basement_area') }}</dt><dd>{{ formatArea(basementArea) }}</dd></div> -->
          <!-- <div><dt>{{ t('home.estimate.ground_floor_height') }}</dt><dd>{{ groundFloorHeight }} m</dd></div> -->
          <div><dt>{{ t('home.estimate.equivalent_area') }}</dt><dd>{{ formatArea(equivalentArea) }}</dd></div>
          <div><dt>{{ t('home.estimate.applied_rate') }}</dt><dd>{{ formatNumber(selectedPackage?.ratePerSqm ?? 6800000) }} {{ t('common.unit_rate') }}</dd></div>
        </dl>
        <!-- <p class="home-estimate-disclaimer">{{ t('home.estimate.disclaimer') }}</p> -->
        <NuxtLink class="home-estimate-cta" to="/lien-he#consultation-form">{{ t('home.estimate.cta') }} <span aria-hidden="true">↗</span></NuxtLink>
        <!-- <p class="home-estimate-mock-note">{{ t('home.estimate.mock_note') }}</p> -->
      </aside>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'
import { useEstimateCalculator } from '~/composables/useEstimateCalculator'

withDefaults(defineProps<{
  showMobileDisclaimer?: boolean
}>(), {
  showMobileDisclaimer: false,
})

const { t } = useI18n()
const {
  landArea,
  floorCount,
  basementCount,
  basementArea,
  groundFloorHeight,
  foundation,
  roof,
  yard,
  packageType,
  materialPackages,
  foundationOptions,
  roofOptions,
  yardOptions,
  floorOptions,
  basementOptions,
  groundFloorHeightOptions,
  floorArea,
  equivalentArea,
  selectedPackage,
  estimatedTotal,
  formatNumber,
  formatArea
} = useEstimateCalculator()

const roofLabel = (value: string) => {
  if (value === 'reinforced') return t('home.estimate.roof_reinforced')
  return roofOptions.find(option => option.value === value)?.label || value
}

const yardLabel = (value: string, ratio: number) => {
  if (value === 'none') return t('home.estimate.yard_none')
  return t('home.estimate.yard_with_area', { percentage: Math.round(ratio * 100) })
}

const packageLabel = (value: string) => {
  const labels: Record<string, string> = {
    standard: t('home.estimate.package_standard'),
    premium: t('home.estimate.package_premium'),
    luxury: t('home.estimate.package_luxury'),
  }
  return labels[value] || value
}
</script>
