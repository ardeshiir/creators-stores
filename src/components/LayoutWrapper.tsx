'use client'

import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isShopsOrUsers = pathname.startsWith('/shops') || pathname.startsWith('/users')

  return (
    <div
      className={cn(
        'relative h-dvh max-h-dvh overflow-y-hidden',
        isShopsOrUsers ? 'pt-[24px]' : 'pt-[64px]',
      )}
    >
      <div className="h-full max-h-full overflow-y-scroll">{children}</div>
    </div>
  )
}
