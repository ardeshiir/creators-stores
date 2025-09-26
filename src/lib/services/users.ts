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
