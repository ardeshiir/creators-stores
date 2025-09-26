import { parseCookies } from 'nookies'
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
    // you can also clear cookies here if needed
    set({
      isAuthenticated: false,
      userInfo: null,
      isGettingAuthState: false,
    })
  },
}))
