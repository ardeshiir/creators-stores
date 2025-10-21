'use client'

import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isShopsOrUsers = pathname.startsWith('/shops') || pathname.startsWith('/users')

  return (
    <div className="relative h-dvh max-h-dvh overflow-y-hidden pt-[124px] md:pt-[98px]">
      <div
        className={cn(
          'h-full max-h-full overflow-y-scroll',
          isShopsOrUsers ? 'pt-[24px]' : 'pt-[64px]',
        )}
      >
        {children}
      </div>
    </div>
  )
}
