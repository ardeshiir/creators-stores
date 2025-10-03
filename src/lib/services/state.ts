import { baseApi } from '@/lib/services/index'

export interface City {
  name: string
  districts: number[]
}

export interface StateDTO {
  name: string
  cities: City[]
}

export const getAllStates = async () => {
  return await baseApi.get<StateDTO[]>(`/state`)
}
