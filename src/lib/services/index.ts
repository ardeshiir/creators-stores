import axios from 'axios'
import { parseCookies } from 'nookies'

export const baseApi = axios.create({
  baseURL: process.env.BASE_API_URL || 'https://api.creatorsclass.co/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

baseApi.interceptors.request.use(
  async (config) => {
    const cookies = parseCookies()
    const accessToken = cookies?.accessToken

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (error) => Promise.reject(error),
)
