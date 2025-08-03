import { baseApi } from '@/lib/services/index'
import { FormState } from '@/stores/useFormStore'

export const addShop = async (data: FormState['data']) => {
  return await baseApi.post<any>(`/shop`, data)
}

export const getAllShops = async () => {
  return await baseApi.get<FormState['data'][]>(`/shop`)
}

export const getShopByShopID = async (id: number) => {
  return await baseApi.get<FormState['data']>(`/shop/shopid/${id}`)
}
