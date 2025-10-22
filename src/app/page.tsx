'use client'

import { useEffect } from 'react'

import dynamic from 'next/dynamic'

import DesktopFooter from '@/components/desktop-footer'
import Login from '@/components/form/login'
import BonyanIcon from '@/components/icons/BonyanIcon'
import LoadingSpinner from '@/components/LoadingSpinner'
import StoreManagementMenu from '@/components/ui/store-management-menu'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useAuthStore } from '@/hooks/useAuthentication'

const Map = dynamic(() => import('../components/map'), { ssr: false })

export default function Home() {
  const { isAuthenticated, getLoginState, isGettingAuthState } = useAuthStore()
  const isDesktop = useMediaQuery('(min-width: 768px)')

  useEffect(() => {
    getLoginState()
  }, [])

  if (isGettingAuthState) {
    return (
      <div className="flex size-full items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col items-center justify-between">
      {isAuthenticated ? (
        <StoreManagementMenu />
      ) : (
        <Login
          onLoginSuccessful={() => {
            getLoginState()
          }}
        />
      )}
      {isDesktop ? (
        <div className="mt-[122px] w-full">
          <DesktopFooter />
        </div>
      ) : (
        <footer className="flex h-[140px] min-h-[140px] w-full items-start justify-center bg-black pt-7 md:hidden">
          <BonyanIcon />
        </footer>
      )}
    </div>
  )
}
