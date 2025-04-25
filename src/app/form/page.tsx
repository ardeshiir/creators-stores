'use client'
import DesktopFooter from '@/components/desktop-footer'
import MultiStepForm from '@/components/form/MultiStepForm'
import { useMediaQuery } from '@/hooks/use-media-query'

export default function FormPage() {
  const isDesktop = useMediaQuery('(min-width: 768px)')

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
