'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import PdfIcon from '@/components/icons/PDFIcon'
import { Button } from '@/components/ui/button'
import LoginTitle from '@/components/ui/login-title'
import { useAuthStore } from '@/hooks/useAuthentication'
import { useFormStore } from '@/stores/useFormStore'

const StoreManagementMenu = () => {
  const { userInfo } = useAuthStore()
  const isSuperAdmin = userInfo?.role === 'global_manager'
  const { reset } = useFormStore()
  const router = useRouter()

  return (
    <div className="flex flex-1 flex-col justify-between gap-10 pb-[43px]">
      <div className="desktop-card flex w-[315px] flex-col gap-[35px] md:w-auto">
        <LoginTitle title="باشگاه فروشندگان" />
        <div className="flex flex-col items-center  gap-6 md:gap-4">
          {isSuperAdmin ? (
            <Button
              asChild
              variant="brand"
              className="flex h-[67px] w-full items-center justify-center md:w-[363px]"
            >
              <Link className="flex size-full items-center justify-center" href="/shops">
                فروشگاه‌ها
              </Link>
            </Button>
          ) : (
            <Button
              asChild
              className="flex h-[67px] w-full items-center justify-center md:w-[363px]"
              onClick={() => {
                reset()
                router.push('/form')
              }}
            >
              <div className="flex size-full items-center justify-center">ثبت فروشنده جدید</div>
            </Button>
          )}
          {isSuperAdmin ? (
            <Button
              asChild
              className="flex h-[67px] w-full items-center justify-center md:w-[363px]"
            >
              <Link className="flex size-full items-center justify-center" href="/users">
                کارشناسان فروش
              </Link>
            </Button>
          ) : (
            <Button
              asChild
              variant="brand"
              className="flex h-[67px] w-full items-center justify-center md:w-[363px]"
            >
              <Link className="flex size-full items-center justify-center" href="/shops">
                فروشندگان ثبت شده
              </Link>
            </Button>
          )}
          {isSuperAdmin && (
            <Button
              asChild
              className="flex h-[67px] w-full items-center justify-center border bg-white text-black hover:bg-black hover:text-white md:w-[363px]"
            >
              <Link className="flex size-full items-center justify-center" href="/export">
                دانلود فایل اطلاعات
              </Link>
            </Button>
          )}
        </div>
      </div>
      <button className="flex h-[47px] items-center justify-between rounded-[16px] border border-[#BABCBE] px-5 font-bold">
        دانلود فایل راهنما
        <PdfIcon />
      </button>
    </div>
  )
}

export default StoreManagementMenu
