/**
 * Formatters and helpers for UI presentation
 */

export const formatDate = (dateStr?: string, locale = 'vi-VN'): string => {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString(locale)
  } catch {
    return dateStr
  }
}

export const formatCurrency = (amount?: number | string, currency = 'VND'): string => {
  if (amount === undefined || amount === null || amount === '') return ''
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(num)) return String(amount)
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency }).format(num)
}

export const truncateText = (text?: string, maxLength = 120): string => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

import { normalizeImageUrl } from './imageHelper'

export const getImageUrl = (imagePath?: string, fallback = '/images/pg.webp'): string => {
  if (!imagePath || !imagePath.trim() || /600x600|resido\.local/i.test(imagePath)) return fallback
  const normalized = normalizeImageUrl(imagePath)
  return normalized || fallback
}

