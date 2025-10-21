'use client'
import { useEffect } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import BurgerMenuIcon from '@/components/icons/BurgerMenuIcon'
import LogWithTypography from '@/components/icons/LogWithTypography'
import LogWithTypographyHorizontal from '@/components/icons/LogWithTypographyHorizontal'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useAuthStore } from '@/hooks/useAuthentication'
import { useFormStore } from '@/stores/useFormStore'

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
    <div className="z-10 flex items-start justify-between">
      <MenuDropDown />
      <Link href="/">{isDesktop ? <LogWithTypographyHorizontal /> : <LogWithTypography />}</Link>
    </div>
  )
}

export default Header

const MenuDropDown = () => {
  const { userInfo, isAuthenticated, getLoginState, logout } = useAuthStore()
  const isSuperAdmin = userInfo?.role === 'global_manager'
  const router = useRouter()
  const { reset } = useFormStore()

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
          {userInfo?.name ?? '' + ' ' + userInfo?.lastName ?? ''}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-start">
          <Link className="flex size-full items-center justify-start" href="/shops">
            فروشگاه‌ها
          </Link>
        </DropdownMenuItem>
        {!isSuperAdmin && (
          <DropdownMenuItem className="cursor-pointer text-start">
            <button
              onClick={() => {
                router.push('/form')
                reset()
              }}
              className="flex size-full items-center justify-start"
            >
              ثبت فروشگاه جدید
            </button>
          </DropdownMenuItem>
        )}
        {isSuperAdmin && (
          <DropdownMenuItem className="cursor-pointer text-start">
            <Link className="flex size-full items-center justify-start" href="/users">
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
