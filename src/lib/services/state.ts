import { baseApi } from '@/lib/services/index'

export const getAllStates = async () => {
  return await baseApi.get<{ name: string; cities?: string[] }[]>(`/state`)
}
