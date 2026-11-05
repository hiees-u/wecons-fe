export interface HomeImageItem {
  title: string
  category: string
  image: string
  alt: string
  detail: string
  slug?: string
}

export interface MetricItem {
  value: string
  label: string
}

export interface BenefitItem {
  title: string
  body: string
}

export interface CompanyValue {
  number: string
  title: string
  description: string
}

export interface ServiceHighlight {
  title: string
  description: string
  image: string
  alt: string
  category: string
  slug?: string
}

export interface ProcessDetail {
  title: string
  description: string
}

export type BuildingType = 'townhouse' | 'villa' | 'garden-house' | 'renovation'
export type ConstructionPackage = 'structural' | 'standard' | 'premium' | 'luxury'

export interface FoundationOption {
  value: string
  label: string
  ratio: number
}

export interface RoofOption {
  value: string
  label: string
  ratio: number
}

export interface YardOption {
  value: string
  label: string
  ratio: number
}

export interface ConstructionPackageOption {
  value: ConstructionPackage
  label: string
  description: string
  ratePerSqm: number
}
