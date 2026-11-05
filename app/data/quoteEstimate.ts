export type QuoteOption = {
  value: string
  labelKey: string
}

export type FloorOption = QuoteOption & {
  coefficient: number
}

export type QuoteItem = {
  id: string
  group: 'design' | 'construction'
  nameKey: string
  descriptionKey: string
  areaSource: 'construction' | 'land' | 'manual'
  unitPrice: number
  initialArea?: number
}

export const projectOptions = {
  buildingTypes: [
    { value: 'townhouse', labelKey: 'options.building_types.townhouse', factor: 1 },
    { value: 'villa', labelKey: 'options.building_types.villa', factor: 1.08 },
    { value: 'single-storey', labelKey: 'options.building_types.single_storey', factor: 0.92 }
  ],
  designStyles: [
    { value: 'minimal', labelKey: 'options.design_styles.minimal' },
    { value: 'modern', labelKey: 'options.design_styles.modern' },
    { value: 'neoclassical', labelKey: 'options.design_styles.neoclassical' },
    { value: 'classical', labelKey: 'options.design_styles.classical' }
  ],
  landLocations: [
    { value: 'main-road', labelKey: 'options.land_locations.main_road', factor: 1 },
    { value: 'internal-road', labelKey: 'options.land_locations.internal_road', factor: 1.03 },
    { value: 'alley', labelKey: 'options.land_locations.alley', factor: 1.06 }
  ],
  siteAccess: [
    { value: 'large-truck', labelKey: 'options.site_access.large_truck', factor: 1 },
    { value: 'small-truck', labelKey: 'options.site_access.small_truck', factor: 1.04 },
    { value: 'narrow-alley', labelKey: 'options.site_access.narrow_alley', factor: 1.08 }
  ],
  materialPackages: [
    { value: 'standard', labelKey: 'options.material_packages.standard', finishRate: 800_000, electricalRate: 100_000 },
    { value: 'premium', labelKey: 'options.material_packages.premium', finishRate: 1_100_000, electricalRate: 180_000 }
  ],
  floors: [
    { value: 'foundation', labelKey: 'options.floors.foundation', coefficient: 0.35 },
    { value: 'basement', labelKey: 'options.floors.basement', coefficient: 1.5 },
    { value: 'ground', labelKey: 'options.floors.ground', coefficient: 1 },
    { value: 'mezzanine', labelKey: 'options.floors.mezzanine', coefficient: 0.7 },
    { value: 'floor-2', labelKey: 'options.floors.floor_2', coefficient: 1 },
    { value: 'floor-3', labelKey: 'options.floors.floor_3', coefficient: 1 },
    { value: 'floor-4', labelKey: 'options.floors.floor_4', coefficient: 1 },
    { value: 'floor-5', labelKey: 'options.floors.floor_5', coefficient: 1 },
    { value: 'rooftop', labelKey: 'options.floors.rooftop', coefficient: 0.5 },
    { value: 'roof', labelKey: 'options.floors.roof', coefficient: 0.5 }
  ] satisfies FloorOption[],
  foundations: [
    { value: 'piles', labelKey: 'options.foundations.piles', factor: 1.08 },
    { value: 'strip', labelKey: 'options.foundations.strip', factor: 1 },
    { value: 'isolated', labelKey: 'options.foundations.isolated', factor: 0.94 }
  ],
  groundFloorStructures: [
    { value: 'reinforced-concrete', labelKey: 'options.ground_floor_structures.reinforced_concrete', factor: 1 },
    { value: 'alternative', labelKey: 'options.ground_floor_structures.alternative', factor: 0.97 }
  ],
  roofs: [
    { value: 'tiled-concrete', labelKey: 'options.roofs.tiled_concrete', factor: 1.08 },
    { value: 'metal', labelKey: 'options.roofs.metal', factor: 0.92 },
    { value: 'concrete', labelKey: 'options.roofs.concrete', factor: 1 }
  ],
  items: [
    {
      id: 'architecture',
      group: 'design',
      nameKey: 'items.architecture.name',
      descriptionKey: 'items.architecture.description',
      areaSource: 'construction',
      unitPrice: 180_000
    },
    {
      id: 'mep',
      group: 'design',
      nameKey: 'items.mep.name',
      descriptionKey: 'items.mep.description',
      areaSource: 'construction',
      unitPrice: 70_000
    },
    {
      id: 'interior-3d',
      group: 'design',
      nameKey: 'items.interior_3d.name',
      descriptionKey: 'items.interior_3d.description',
      areaSource: 'construction',
      unitPrice: 180_000
    },
    {
      id: 'technical-2d',
      group: 'design',
      nameKey: 'items.technical_2d.name',
      descriptionKey: 'items.technical_2d.description',
      areaSource: 'construction',
      unitPrice: 90_000
    },
    {
      id: 'landscape',
      group: 'design',
      nameKey: 'items.landscape.name',
      descriptionKey: 'items.landscape.description',
      areaSource: 'land',
      unitPrice: 60_000
    },
    {
      id: 'pool',
      group: 'design',
      nameKey: 'items.pool.name',
      descriptionKey: 'items.pool.description',
      areaSource: 'land',
      unitPrice: 100_000
    },
    {
      id: 'rough-construction',
      group: 'construction',
      nameKey: 'items.rough_construction.name',
      descriptionKey: 'items.rough_construction.description',
      areaSource: 'manual',
      initialArea: 10,
      unitPrice: 1_000_000
    },
    {
      id: 'finishing-labor',
      group: 'construction',
      nameKey: 'items.finishing_labor.name',
      descriptionKey: 'items.finishing_labor.description',
      areaSource: 'manual',
      initialArea: 10,
      unitPrice: 1_000_000
    }
  ] satisfies QuoteItem[]
} as const

export const defaultSelectedFloors = ['foundation', 'ground', 'floor-2', 'roof']
export const defaultSelectedQuoteItems = [
  'architecture',
  'mep',
  'rough-construction',
  'finishing-labor'
]
