import { baseApi } from '@/lib/services/index'
import { FormState } from '@/stores/useFormStore'

export const addShop = async (data: FormState['data']) => {
  return await baseApi.post<any>(`/shop`, data)
}

export const updateShop = async (data: FormState['data'], id: string) => {
  return await baseApi.put<any>(`/shop/${id}`, data)
}

export const resendShopVerificationOTP = async (shopID: string) => {
  return await baseApi.post<any>(`/shop/${shopID}/resend-otp`)
}

export const shopFinalSubmission = async ({ shopID, code }: { shopID: string; code: string }) => {
  return await baseApi.post<any>(`/shop/verify`, { shopID, code })
}

export const getAllShops = async () => {
  return await baseApi.get<FormState['data'][]>(`/shop`)
}

export const getShopByShopID = async (id: number) => {
  return await baseApi.get<FormState['data']>(`/shop/shopid/${id}`)
}

export interface ShopFilterParams {
  state?: string[]
  city?: string[]
  district?: number[]
  purchaseMethod?: 'direct' | 'indirect' | string
  propertyStatus?: 'owner' | 'rental' | string
  hasSignBoard?: boolean
  hasDisplayStand?: boolean
  hasShowCase?: boolean
  sellerType?: string
}

export const getFilteredShops = async (params: ShopFilterParams) => {
  const query = new URLSearchParams()

  if (params.state?.length) {
    params.state.forEach((s) => query.append('state', s))
  }

  if (params.city?.length) {
    params.city.forEach((c) => query.append('city', c))
  }

  if (params.purchaseMethod) query.append('purchaseMethod', params.purchaseMethod)

  if (params.sellerType) query.append('sellerType', params.sellerType)

  if (typeof params.hasSignBoard === 'boolean')
    query.append('hasSignBoard', params.hasSignBoard.toString())

  if (typeof params.hasDisplayStand === 'boolean')
    query.append('hasDisplayStand', params.hasDisplayStand.toString())

  if (typeof params.hasShowCase === 'boolean')
    query.append('hasShowCase', params.hasShowCase.toString())

  return await baseApi.get<FormState['data'][]>(`/shop/filter?${query.toString()}`)
}
