import { baseApi } from '@/lib/services/index'

export const uploadFile = async (formData: FormData) => {
  return await baseApi.post<{ url?: string; error_key?: string; message?: string }>(
    `/upload`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  )
}
