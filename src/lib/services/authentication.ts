import { baseApi } from '@/lib/services/index'

export interface ICredentials {
  phone: string | null
}

export const requestOTP = async ({ phone }: ICredentials) => {
  return await baseApi.post<{ error_key?: string; message: string }>(`/auth/send-otp`, {
    phone,
  })
}

export interface UserInfo {
  name: string
  lastName: string
  phone: string
  role: 'field_agent' | 'regional_manager' | 'global_manager'
  permissions: string[]
  createdAt: Date
  state?: string
  city?: string
  district?: number
  _id?: string
  identifierCode: string
  isActive?: boolean
}

export const verifyOtp = async ({ phone, code }: { phone: string; code: string }) => {
  return await baseApi.post<{
    token: string
    user: UserInfo
    error_key?: string
    message?: string
  }>(`/auth/verify-otp`, { phone, code })
}

export const ERRORS_DICTIONARY: Record<string, string> = {
  PHONE_REQUIRED: 'شماره تلفن الزامیست',
  USERID_REQUIRED: 'شناسه کاربری الزامیست',
  USER_NOT_FOUND: 'کاربر یافت نشد',
  OTP_REQUIRED: 'کد الزامیست',
  INVALID_OTP: 'کد معتبر نیست',
  EXPIRED_OTP: 'کد منقضی شده',
}
