import { destroyCookie, parseCookies } from 'nookies'
import { create } from 'zustand'

import { UserInfo } from '@/lib/services/authentication'

interface AuthState {
  isAuthenticated: boolean
  userInfo: UserInfo | null
  isGettingAuthState: boolean
  getLoginState: () => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userInfo: null,
  isGettingAuthState: true,

  getLoginState: () => {
    set({ isGettingAuthState: true })

    const cookies = parseCookies()
    const accessToken = cookies?.accessToken
    const userInfo = cookies?.['user-info']

    set({
      isAuthenticated: Boolean(accessToken),
      userInfo: userInfo ? JSON.parse(userInfo) : null,
      isGettingAuthState: false,
    })
  },

  logout: () => {
    destroyCookie(undefined, 'accessToken')
    destroyCookie(undefined, 'user-info')
    set({
      isAuthenticated: false,
      userInfo: null,
      isGettingAuthState: false,
    })
  },
}))
