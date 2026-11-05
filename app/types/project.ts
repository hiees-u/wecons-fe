export interface PublishedProject {
  id: number | string
  name: string
  slug?: string
  image?: string
  location?: string
  area?: string | number
  type?: string
  category?: string
}

export interface ApiProject {
  id?: number | string
  name?: string
  title?: string
  slug?: string
  slugable?: { key?: string }
  image?: string | { url?: string; thumb?: string }
  images?: string[]
  location?: string
  city?: { name?: string }
  area?: string | number
  square?: string | number
  project_type?: string
  type?: string
  categories?: Array<{ name?: string }>
  category?: { name?: string } | null
}

export interface ProjectDetail {
  id: number | string
  name: string
  slug: string
  image?: string
  content?: string
  description?: string
  location?: string
  area?: string | number
  type?: string
  category?: string
}
