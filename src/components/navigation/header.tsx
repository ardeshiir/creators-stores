'use client'
import { useEffect } from 'react'

import Link from 'next/link'

import BurgerMenuIcon from '@/components/icons/BurgerMenuIcon'
import LogWithTypography from '@/components/icons/LogWithTypography'
import LogWithTypographyHorizontal from '@/components/icons/LogWithTypographyHorizontal'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useAuthStore } from '@/hooks/useAuthentication'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

const Header = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return (
    <div className="flex items-start justify-between">
      <MenuDropDown />
      <Link href="/">{isDesktop ? <LogWithTypographyHorizontal /> : <LogWithTypography />}</Link>
    </div>
  )
}

export default Header

const MenuDropDown = () => {
  const { userInfo, isAuthenticated, getLoginState, logout } = useAuthStore()
  const isSuperAdmin = userInfo?.role === 'global_manager'

  useEffect(() => {
    getLoginState()
  }, [])

  if (!isAuthenticated) {
    return <span />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <BurgerMenuIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" className="mr-6 mt-1 bg-white">
        <DropdownMenuLabel className="justify-end text-end">
          {userInfo?.name + ' ' + userInfo?.family}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-start" onClick={() => logout()}>
          <Link className="flex size-full items-center justify-end" href="/shops">
            فروشگاه‌ها
          </Link>
        </DropdownMenuItem>
        {!isSuperAdmin && (
          <DropdownMenuItem className="cursor-pointer text-start" onClick={() => logout()}>
            <Link className="flex size-full items-center justify-end" href="/form">
              ثبت فروشگاه جدید
            </Link>
          </DropdownMenuItem>
        )}
        {isSuperAdmin && (
          <DropdownMenuItem className="cursor-pointer text-start" onClick={() => logout()}>
            <Link className="flex size-full items-center justify-end" href="/users">
              کارشناسان فروش
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="cursor-pointer text-start text-[#E23838]"
          onClick={() => logout()}
        >
          خروج از حساب کاربری
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
