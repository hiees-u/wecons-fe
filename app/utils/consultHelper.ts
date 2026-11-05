/**
 * Helper options and validation utilities for Consultation and Contact forms
 */

export interface FormOption {
  value: string
  label: string
}

export const DEFAULT_SERVICE_OPTIONS = [
  'Xây nhà trọn gói',
  'Thi công phần thô',
  'Thiết kế kiến trúc',
  'Thiết kế nội thất',
  'Cải tạo sửa chữa',
  'Chưa xác định, cần tư vấn',
]

export const DEFAULT_PROJECT_TYPES = [
  'Nhà phố',
  'Biệt thự',
  'Nhà vườn',
  'Căn hộ',
  'Cải tạo hoặc hoàn thiện',
  'Khác',
]

export const DEFAULT_BUDGET_RANGES = [
  'Dưới 1 tỷ đồng',
  '1–2 tỷ đồng',
  '2–5 tỷ đồng',
  'Trên 5 tỷ đồng',
]

export const validatePhone = (phone: string): boolean => {
  return /^\+?[0-9\s().-]{9,20}$/.test(phone.trim())
}

export const validateEmail = (email: string): boolean => {
  if (!email || !email.trim()) return true
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && email.trim().length <= 120
}

export const sanitizePhoneLink = (phone?: string): string => {
  if (!phone) return ''
  return phone.replace(/[^\d+]/g, '')
}
