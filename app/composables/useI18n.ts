import { computed, unref } from 'vue'
import vi from '../locales/vi.json'
import en from '../locales/en.json'

export type Locale = 'vi' | 'en'

const dictionaries: Record<Locale, any> = { vi, en }

function isLocale(value: unknown): value is Locale {
  return value === 'vi' || value === 'en'
}

export const useI18n = () => {
  const localeCookie = useCookie<Locale | null>('we_locale', {
    default: () => null,
    path: '/',
    sameSite: 'lax',
  })
  const currentLocale = useState<Locale>('we-locale', () =>
    isLocale(localeCookie.value) ? localeCookie.value : 'vi',
  )

  const setLocale = (lang: Locale) => {
    if (dictionaries[lang]) {
      currentLocale.value = lang
      localeCookie.value = lang
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('we_locale', lang)
        } catch {
          // Ignore localStorage errors
        }
      }
    }
  }

  const initLocale = () => {
    if (isLocale(localeCookie.value)) {
      currentLocale.value = localeCookie.value
      return
    }

    if (typeof window !== 'undefined') {
      try {
        const storedLocale = localStorage.getItem('we_locale')
        if (isLocale(storedLocale)) {
          currentLocale.value = storedLocale
          localeCookie.value = storedLocale
        }
      } catch {
        currentLocale.value = 'vi'
      }
    }
  }

  function t(path: string, params?: Record<string, any>): string
  function t(path: string, fallback?: string, params?: Record<string, any>): string
  function t(
    path: string,
    paramsOrFallback?: string | Record<string, any>,
    params?: Record<string, any>,
  ): string {
    let fallbackText = ''
    let paramObj: Record<string, any> = {}

    if (typeof paramsOrFallback === 'string') {
      fallbackText = paramsOrFallback
      if (params && typeof params === 'object') {
        paramObj = params
      }
    } else if (paramsOrFallback && typeof paramsOrFallback === 'object') {
      paramObj = paramsOrFallback
    }

    const keys = path.split('.')
    let current: any = dictionaries[currentLocale.value] || dictionaries.vi

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key]
      } else {
        // Fallback to vi
        let fallbackDict: any = dictionaries.vi
        let foundInVi = true
        for (const fbKey of keys) {
          if (fallbackDict && typeof fallbackDict === 'object' && fbKey in fallbackDict) {
            fallbackDict = fallbackDict[fbKey]
          } else {
            foundInVi = false
            break
          }
        }
        current = foundInVi ? fallbackDict : (fallbackText || path)
        break
      }
    }

    if (typeof current !== 'string') {
      current = fallbackText || path
    }

    let text = current
    for (const [pKey, pVal] of Object.entries(paramObj)) {
      const rawVal = unref(pVal)
      text = text.replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(rawVal ?? ''))
    }
    return text
  }

  return {
    locale: computed(() => currentLocale.value),
    setLocale,
    initLocale,
    t,
    availableLocales: ['vi', 'en'] as Locale[],
  }
}
