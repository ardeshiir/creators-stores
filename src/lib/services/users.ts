import { UserInfo } from '@/lib/services/authentication'
import { baseApi } from '@/lib/services/index'

export const addUser = async (data: Partial<UserInfo>) => {
  return await baseApi.post<any>(`/user`, data)
}

export const getAllUsers = async () => {
  return await baseApi.get<Partial<UserInfo>[]>(`/user`)
}

export const getUserByID = async (id: string) => {
  return await baseApi.get<Partial<UserInfo>>(`/user/${id}`)
}

export const updateUserByID = async (id: string, data: Partial<UserInfo>) => {
  return await baseApi.put<Partial<UserInfo>>(`/user/${id}`, data)
}

export const deleteUserByID = async (id: number) => {
  return await baseApi.delete<Partial<UserInfo>>(`/user/${id}`)
}

export const deactivateUserByID = async (id: number) => {
  return await baseApi.put<Partial<UserInfo>>(`/user/${id}`, { isActive: false })
}

export const searchUsers = async (searchQuery: string) => {
  return await baseApi.get<Partial<UserInfo>[]>(`/user/search?q=${searchQuery}`)
}

// services/users.ts
export interface UserFilterParams {
  state?: string[]
  city?: string[]
  district?: number[]
  role?: 'field_agent' | 'regional_manager' | 'global_manager'
}

export const getFilteredUsers = async (params: UserFilterParams) => {
  const query = new URLSearchParams()

  if (params.state?.length) {
    params.state.forEach((s) => query.append('state', s))
  }

  if (params.city?.length) {
    params.city.forEach((c) => query.append('city', c))
  }

  if (params.district?.length) {
    params.district.forEach((d) => query.append('district', String(d)))
  }

  if (params.role) query.append('role', params.role)

  return await baseApi.get<UserInfo[]>(`/user/filter?${query.toString()}`)
}
