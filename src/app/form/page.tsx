'use client'
import { Suspense, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import MultiStepForm from '@/components/form/MultiStepForm'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useAuthStore } from '@/hooks/useAuthentication'

export default function FormPage() {
  const { isAuthenticated, isGettingAuthState } = useAuthStore()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated && !isGettingAuthState) {
      router.push('/')
    }
  }, [isGettingAuthState])

  return (
    <>
      <div className="h-full md:h-auto">
        <Suspense>
          <MultiStepForm />
        </Suspense>
      </div>
    </>
  )
}
