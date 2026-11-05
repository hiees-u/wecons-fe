interface CacheEntry<T> {
  data: T
  timestamp: number
}

// Bộ nhớ đệm Client-side TTL (3 phút) giúp chuyển trang tức thì không gián đoạn
const clientApiCache = new Map<string, CacheEntry<any>>()
const inFlightRequests = new Map<string, Promise<any>>()
const DEFAULT_TTL_MS = 180_000 // 3 minutes

export const clearApiCache = () => {
  clientApiCache.clear()
  inFlightRequests.clear()
}

export const useApi = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase || 'http://localhost/api/v1'

  const fetchApi = async <T = any>(
    endpoint: string,
    options: any = {},
  ): Promise<{ success: boolean; data: T; message?: string; meta?: any }> => {
    const method = (options.method || 'GET').toUpperCase()
    const isGet = method === 'GET'

    const url = endpoint.startsWith('http')
      ? endpoint
      : `/api-proxy/${endpoint.replace(/^\//, '')}`

    const cacheKey = `${url}:${JSON.stringify(options.params || options.query || {})}`

    // Xử lý cache cho GET requests trên trình duyệt
    if (isGet && import.meta.client) {
      const cached = clientApiCache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < DEFAULT_TTL_MS) {
        return cached.data
      }

      // Deduplication: nếu đang có request cùng endpoint đang chạy, tái sử dụng Promise
      if (inFlightRequests.has(cacheKey)) {
        return inFlightRequests.get(cacheKey)!
      }
    }

    const execRequest = async () => {
      try {
        const response = await $fetch<any>(url, {
          headers: {
            Accept: 'application/json',
            ...options.headers,
          },
          ...options,
        })

        const result = {
          ...response,
          success: response.success ?? !response.error,
        }

        // Lưu vào cache nếu thành công
        if (isGet && import.meta.client && result.success) {
          clientApiCache.set(cacheKey, {
            data: result,
            timestamp: Date.now(),
          })
        }

        // Xóa cache khi có thao tác ghi dữ liệu (POST, PUT, DELETE)
        if (!isGet && import.meta.client) {
          clientApiCache.clear()
        }

        return result
      } catch (err: any) {
        console.error(`[API Error] ${endpoint}:`, err)
        return {
          success: false,
          data: null as any,
          message: err.data?.message || err.message || 'API request failed',
        }
      } finally {
        if (isGet && import.meta.client) {
          inFlightRequests.delete(cacheKey)
        }
      }
    }

    if (isGet && import.meta.client) {
      const promise = execRequest()
      inFlightRequests.set(cacheKey, promise)
      return promise
    }

    return await execRequest()
  }

  return {
    apiBase,
    fetchApi,
    clearApiCache,
  }
}
