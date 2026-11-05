import { ref, computed } from 'vue'
import pricingData from '~/data/pricingEstimate.json'
import type {
  ConstructionPackage,
  FoundationOption,
  RoofOption,
  YardOption,
  ConstructionPackageOption
} from '~/types/content'

export const useEstimateCalculator = () => {
  const landArea = ref(200)
  const floorCount = ref(3)
  const basementCount = ref(0)
  const basementArea = ref(20)
  const groundFloorHeight = ref(3.6)
  const foundation = ref('tape')
  const roof = ref('reinforced')
  const yard = ref('none')
  const packageType = ref<ConstructionPackage>('luxury')

  const { getQuotationSettings } = useRealEstate()
  const dynamicConfig = ref<any>(null)

  if (import.meta.client) {
    getQuotationSettings().then(res => {
      if (res?.data) {
        dynamicConfig.value = res.data
      }
    }).catch(() => {})
  }

  const packages = pricingData.constructionPackages as ConstructionPackageOption[]
  const materialPackages = packages.filter(option => option.value !== 'structural')
  const foundationOptions = pricingData.foundationOptions as FoundationOption[]
  const roofOptions = pricingData.roofOptions as RoofOption[]
  const yardOptions = pricingData.yardOptions as YardOption[]
  const floorOptions = pricingData.floorCountOptions as number[]
  const basementOptions = [0, 1, 2, 3]
  const groundFloorHeightOptions = [3.3, 3.6, 4, 4.5]

  const validatedLandArea = computed(() => Math.max(0, Number(landArea.value) || 0))

  const floorArea = computed(() => {
    return Math.round(validatedLandArea.value * (Number(floorCount.value) || 1) * 10) / 10
  })

  const selectedFoundation = computed(() => {
    return foundationOptions.find(opt => opt.value === foundation.value) || foundationOptions[1]
  })

  const selectedRoof = computed(() => {
    return roofOptions.find(opt => opt.value === roof.value) || roofOptions[1]
  })

  const selectedYard = computed(() => {
    return yardOptions.find(opt => opt.value === yard.value) || yardOptions[0]
  })

  const selectedPackage = computed(() => {
    if (dynamicConfig.value?.packages?.length) {
      const match = dynamicConfig.value.packages.find((p: any) => p.id === packageType.value || p.name?.toLowerCase().includes(packageType.value))
      if (match) {
        return {
          value: packageType.value,
          label: match.name,
          ratePerSqm: match.price,
          description: match.description,
        }
      }
    }
    return packages.find(opt => opt.value === packageType.value) || packages[1]
  })

  const equivalentArea = computed(() => {
    const base = validatedLandArea.value
    const fRatio = selectedFoundation.value?.ratio ?? 0.5
    const rRatio = selectedRoof.value?.ratio ?? 0.5
    const yRatio = selectedYard.value?.ratio ?? 0.5
    const floors = Number(floorCount.value) || 1

    const foundationSqm = base * fRatio
    const floorsSqm = base * floors
    const basementSqm = Math.max(0, Number(basementArea.value) || 0) * (Number(basementCount.value) || 0)
    const roofSqm = base * rRatio
    const yardSqm = base * yRatio
    const heightAdjustmentSqm = base * Math.max(0, Number(groundFloorHeight.value) - 3.3) * 0.05

    return Math.round((foundationSqm + floorsSqm + basementSqm + roofSqm + yardSqm + heightAdjustmentSqm) * 10) / 10
  })

  const estimatedTotal = computed(() => {
    const ratePerSqm = selectedPackage.value?.ratePerSqm ?? 6800000
    return Math.round(equivalentArea.value * ratePerSqm)
  })

  const formatNumber = (val: number): string => {
    return new Intl.NumberFormat('vi-VN').format(val)
  }

  const formatArea = (val: number): string => {
    return `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(val)} m²`
  }

  return {
    landArea,
    floorCount,
    basementCount,
    basementArea,
    groundFloorHeight,
    foundation,
    roof,
    yard,
    packageType,
    packages,
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
  }
}
