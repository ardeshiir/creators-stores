'use client'
import Link from 'next/link'

import BurgerMenuIcon from '@/components/icons/BurgerMenuIcon'
import LogWithTypography from '@/components/icons/LogWithTypography'
import LogWithTypographyHorizontal from '@/components/icons/LogWithTypographyHorizontal'
import { useMediaQuery } from '@/hooks/use-media-query'

const Header = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return (
    <div className="flex items-start justify-between">
      <button className="cursor-pointer">
        <BurgerMenuIcon />
      </button>
      <Link href="/">{isDesktop ? <LogWithTypographyHorizontal /> : <LogWithTypography />}</Link>
    </div>
  )
}

export default Header
