import { useRealEstate } from '~/composables/useRealEstate'

export interface ConsultPayload {
  name: string
  phone: string
  email?: string
  projectType?: string
  serviceType?: string
  location?: string
  budgetArea?: string
  content?: string
}

export interface ServiceResponse {
  success: boolean
  message: string
}

export const submitConsultRequest = async (payload: ConsultPayload): Promise<ServiceResponse> => {
  // 1. Validation Logic
  if (!payload.name || payload.name.trim().length < 2) {
    return { success: false, message: 'Vui lòng cung cấp họ và tên hợp lệ.' }
  }
  if (!payload.phone || payload.phone.trim().length < 9) {
    return { success: false, message: 'Số điện thoại không hợp lệ.' }
  }
  const email = payload.email?.trim()
  if (email && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120)) {
    return { success: false, message: 'Địa chỉ email không đúng định dạng.' }
  }

  // 2. Data transformation
  const combinedContent = [
    payload.projectType ? `[Loại công trình: ${payload.projectType}]` : '',
    payload.serviceType ? `[Hạng mục: ${payload.serviceType}]` : '',
    payload.location ? `[Địa điểm xây dựng: ${payload.location}]` : '',
    payload.budgetArea ? `[Quy mô/Ngân sách: ${payload.budgetArea}]` : '',
    payload.content || '',
  ].filter(Boolean).join('\n')

  const { submitConsult } = useRealEstate()
  const res = await submitConsult({
    name: payload.name.trim(),
    phone: payload.phone.trim(),
    email: email || null,
    content: combinedContent,
  })

  if (res && res.success) {
    return {
      success: true,
      message: 'Yêu cầu của bạn đã được chuyển đến ban quản lý thành công!',
    }
  }

  return {
    success: false,
    message: res.message || 'Không thể gửi yêu cầu lúc này. Vui lòng thử lại sau.',
  }
}
