import Link from 'next/link'

import BurgerMenuIcon from '@/components/icons/BurgerMenuIcon'
import LogWithTypography from '@/components/icons/LogWithTypography'

const Header = () => {
  return (
    <div className="flex items-start justify-between">
      <button className="cursor-pointer">
        <BurgerMenuIcon />
      </button>
      <Link href="/">
        <LogWithTypography />
      </Link>
    </div>
  )
}

export default Header
