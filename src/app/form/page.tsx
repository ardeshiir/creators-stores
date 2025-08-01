'use client'
import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import DesktopFooter from '@/components/desktop-footer'
import MultiStepForm from '@/components/form/MultiStepForm'
import { useMediaQuery } from '@/hooks/use-media-query'
import useAuthentication from '@/hooks/useAuthentication'

export default function FormPage() {
  const { isAuthenticated, isGettingAuthState } = useAuthentication()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated && !isGettingAuthState) {
      router.push('/')
    }
  }, [isGettingAuthState])

  return (
    <>
      <div className="h-full px-9 md:mt-12 md:h-auto">
        <MultiStepForm />
      </div>
      {isDesktop && (
        <div className="mt-[122px] w-full">
          <DesktopFooter />
        </div>
      )}
    </>
  )
}
