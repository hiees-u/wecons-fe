export interface PaginationParams {
  page?: number
  per_page?: number
  order?: 'asc' | 'desc'
  order_by?: string
  search?: string
  [key: string]: any
}

export interface PropertyFilterParams extends PaginationParams {
  type?: 'sale' | 'rent' | string
  city_id?: number
  state_id?: number
  country_id?: number
  category_id?: number
  project_id?: number
  min_price?: number
  max_price?: number
  min_square?: number
  max_square?: number
  number_bedroom?: number
  number_bathroom?: number
  number_floor?: number
  features?: string | number[]
  facilities?: string | number[]
  is_featured?: 0 | 1 | boolean
}

export interface ProjectFilterParams extends PaginationParams {
  city_id?: number
  state_id?: number
  country_id?: number
  category_id?: number
  investor_id?: number
  min_price?: number
  max_price?: number
  is_featured?: 0 | 1 | boolean
}

export interface ConsultData {
  name: string
  email?: string | null
  phone: string
  content: string
  type?: 'property' | 'project' | string
  data_id?: number
  property_id?: number
  project_id?: number
  consult_custom_fields?: Record<string, any>
  [key: string]: any
}

export interface AuthCredentials {
  username?: string
  email?: string
  password: string
  remember?: boolean
}

export interface RegisterData {
  first_name: string
  last_name: string
  email: string
  phone?: string
  username?: string
  password: string
  password_confirmation?: string
  [key: string]: any
}

function buildQuery(params: Record<string, any> = {}): string {
  const cleanParams: Record<string, string> = {}
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== null && val !== '') {
      if (Array.isArray(val)) {
        cleanParams[key] = val.join(',')
      } else if (typeof val === 'boolean') {
        cleanParams[key] = val ? '1' : '0'
      } else {
        cleanParams[key] = String(val)
      }
    }
  }
  const query = new URLSearchParams(cleanParams).toString()
  return query ? `?${query}` : ''
}

export const useRealEstate = () => {
  const { fetchApi } = useApi()

  /* =========================================================================
   * PROPERTIES (Sản phẩm / Bất động sản)
   * ========================================================================= */
  const getProperties = async (params: PropertyFilterParams = {}) => {
    return await fetchApi(`properties${buildQuery(params)}`)
  }

  const getProperty = async (idOrSlug: string | number) => {
    return await fetchApi(`properties/${idOrSlug}`)
  }

  const getPropertyById = async (id: number) => {
    return await fetchApi(`properties/id/${id}`)
  }

  const searchProperties = async (keyword: string, params: Record<string, any> = {}) => {
    return await fetchApi(`properties/search${buildQuery({ q: keyword, ...params })}`)
  }

  const getPropertyFilters = async (params: Record<string, any> = {}) => {
    return await fetchApi(`properties/filters${buildQuery(params)}`)
  }

  const getPropertyReviews = async (propertyId: number, params: PaginationParams = {}) => {
    return await fetchApi(`properties/${propertyId}/reviews${buildQuery(params)}`)
  }

  const submitPropertyReview = async (propertyId: number, data: { star: number; content: string }) => {
    return await fetchApi(`properties/${propertyId}/reviews`, {
      method: 'POST',
      body: data,
    })
  }

  /* =========================================================================
   * PROJECTS (Dự án xây dựng / quy hoạch)
   * ========================================================================= */
  const getProjects = async (params: ProjectFilterParams = {}) => {
    return await fetchApi(`projects${buildQuery(params)}`)
  }

  const getProject = async (idOrSlug: string | number) => {
    return await fetchApi(`projects/${idOrSlug}`)
  }

  const getProjectById = async (id: number) => {
    return await fetchApi(`projects/id/${id}`)
  }

  const searchProjects = async (keyword: string, params: Record<string, any> = {}) => {
    return await fetchApi(`projects/search${buildQuery({ q: keyword, ...params })}`)
  }

  const getProjectFilters = async (params: Record<string, any> = {}) => {
    return await fetchApi(`projects/filters${buildQuery(params)}`)
  }

  const getProjectProperties = async (projectId: number, params: PropertyFilterParams = {}) => {
    return await fetchApi(`projects/id/${projectId}/properties${buildQuery(params)}`)
  }

  /* =========================================================================
   * CATEGORIES (Danh mục dự án / sản phẩm)
   * ========================================================================= */
  const getCategories = async (params: PaginationParams = {}) => {
    return await fetchApi(`categories${buildQuery(params)}`)
  }

  const getCategory = async (idOrSlug: string | number) => {
    return await fetchApi(`categories/${idOrSlug}`)
  }

  const getCategoryById = async (id: number) => {
    return await fetchApi(`categories/id/${id}`)
  }

  const getCategoryFilters = async (params: Record<string, any> = {}) => {
    return await fetchApi(`categories/filters${buildQuery(params)}`)
  }

  const getCategoryProperties = async (categoryId: number, params: PropertyFilterParams = {}) => {
    return await fetchApi(`categories/id/${categoryId}/properties${buildQuery(params)}`)
  }

  /* =========================================================================
   * FEATURES & FACILITIES (Đặc tính & Tiện ích)
   * ========================================================================= */
  const getFeatures = async (params: PaginationParams = {}) => {
    return await fetchApi(`features${buildQuery(params)}`)
  }

  const getAllFeatures = async () => {
    return await fetchApi('features/all')
  }

  const getFeature = async (id: number) => {
    return await fetchApi(`features/${id}`)
  }

  const getFacilities = async (params: PaginationParams = {}) => {
    return await fetchApi(`facilities${buildQuery(params)}`)
  }

  const getAllFacilities = async () => {
    return await fetchApi('facilities/all')
  }

  const getFacility = async (id: number) => {
    return await fetchApi(`facilities/${id}`)
  }

  /* =========================================================================
   * AGENTS / ACCOUNTS (Chuyên viên tư vấn / Tác giả)
   * ========================================================================= */
  const getAgents = async (params: PaginationParams = {}) => {
    return await fetchApi(`agents${buildQuery(params)}`)
  }

  const getAgent = async (id: number) => {
    return await fetchApi(`agents/${id}`)
  }

  const getAgentProperties = async (agentId: number, params: PropertyFilterParams = {}) => {
    return await fetchApi(`agents/${agentId}/properties${buildQuery(params)}`)
  }

  const getAgentProjects = async (agentId: number, params: ProjectFilterParams = {}) => {
    return await fetchApi(`agents/${agentId}/projects${buildQuery(params)}`)
  }

  /* =========================================================================
   * CONSULTATION (Tư vấn / Liên hệ dự án)
   * ========================================================================= */
  const submitConsult = async (data: ConsultData) => {
    const payload = {
      ...data,
      type: data.type || (data.project_id ? 'project' : data.property_id ? 'property' : undefined),
      data_id: data.data_id || data.project_id || data.property_id,
    }
    return await fetchApi('consults', {
      method: 'POST',
      body: payload,
    })
  }

  const getConsultCustomFields = async () => {
    return await fetchApi('consults/custom-fields')
  }

  /* =========================================================================
   * HOME FEED & APP BOOT SETTINGS (Dữ liệu trang chủ, Cấu hình, Dự toán)
   * ========================================================================= */
  const getHomeFeed = async () => {
    return await fetchApi('home')
  }

  const getSettings = async () => {
    return await fetchApi('settings')
  }

  const getUiSettings = async () => {
    return await fetchApi('settings/ui')
  }

  const getCurrencies = async () => {
    return await fetchApi('currencies')
  }

  const getCities = async (params: Record<string, any> = {}) => {
    return await fetchApi(`cities${buildQuery(params)}`)
  }

  const getStates = async (params: Record<string, any> = {}) => {
    return await fetchApi(`states${buildQuery(params)}`)
  }

  const getCostEstimation = async () => {
    return await fetchApi('settings/cost-estimation')
  }

  const calculateCostEstimation = async (data: Record<string, any>) => {
    return await fetchApi('settings/cost-estimation/calculate', {
      method: 'POST',
      body: data,
    })
  }

  const getQuotationSettings = async () => {
    return await fetchApi('settings/quotation')
  }

  const calculateQuotation = async (data: Record<string, any>) => {
    return await fetchApi('settings/quotation/calculate', {
      method: 'POST',
      body: data,
    })
  }

  /* =========================================================================
   * AUTH & USER ACCOUNT (Đăng nhập, Hồ sơ, Yêu thích)
   * ========================================================================= */
  const login = async (credentials: AuthCredentials) => {
    return await fetchApi('auth/login', {
      method: 'POST',
      body: credentials,
    })
  }

  const register = async (data: RegisterData) => {
    return await fetchApi('auth/register', {
      method: 'POST',
      body: data,
    })
  }

  const logout = async (token?: string) => {
    return await fetchApi('auth/logout', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  }

  const getProfile = async (token?: string) => {
    return await fetchApi('account/profile', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  }

  const getSavedProperties = async (token?: string) => {
    return await fetchApi('account/saved-properties', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  }

  const saveProperty = async (propertyId: number, token?: string) => {
    return await fetchApi(`properties/${propertyId}/save`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  }

  const removeSavedProperty = async (propertyId: number, token?: string) => {
    return await fetchApi(`properties/${propertyId}/save`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  }

  return {
    // Properties
    getProperties,
    getProperty,
    getPropertyById,
    searchProperties,
    getPropertyFilters,
    getPropertyReviews,
    submitPropertyReview,

    // Projects
    getProjects,
    getProject,
    getProjectById,
    searchProjects,
    getProjectFilters,
    getProjectProperties,

    // Categories
    getCategories,
    getCategory,
    getCategoryById,
    getCategoryFilters,
    getCategoryProperties,

    // Features & Facilities
    getFeatures,
    getAllFeatures,
    getFeature,
    getFacilities,
    getAllFacilities,
    getFacility,

    // Agents
    getAgents,
    getAgent,
    getAgentProperties,
    getAgentProjects,

    // Consultation
    submitConsult,
    getConsultCustomFields,

    // Home & Settings
    getHomeFeed,
    getSettings,
    getUiSettings,
    getCurrencies,
    getCities,
    getStates,
    getCostEstimation,
    calculateCostEstimation,
    getQuotationSettings,
    calculateQuotation,

    // Auth & Account
    login,
    register,
    logout,
    getProfile,
    getSavedProperties,
    saveProperty,
    removeSavedProperty,
  }
}
