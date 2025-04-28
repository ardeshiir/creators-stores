import Link from 'next/link'

import { Button } from '@/components/ui/button'
import LoginTitle from '@/components/ui/login-title'

const StoreManagementMenu = () => {
  return (
    <div className="flex flex-col gap-10">
      <div className="desktop-card flex w-[315px] flex-col gap-[35px] md:w-auto">
        <LoginTitle title="باشگاه فروشندگان" />
        <div className="flex flex-col items-center  gap-6 md:gap-4">
          <Button className="flex h-[67px] w-full items-center justify-center md:w-[363px]">
            <Link className="flex size-full items-center justify-center" href="/form">
              ثبت فروشنده جدید
            </Link>
          </Button>
          <Button
            variant="brand"
            className="flex h-[67px] w-full items-center justify-center md:w-[363px]"
          >
            <Link className="flex size-full items-center justify-center" href="/list">
              فروشندگان ثبت شده
            </Link>
          </Button>
        </div>
      </div>
      <button className="flex h-[47px] items-center justify-between rounded-[14px] border border-[#BABCBE] px-5 font-bold">
        دانلود فایل راهنما
        <span className="flex h-[26px] w-[50px] items-center justify-center rounded-[10px] bg-[#FF0000] text-lg font-[900] text-white">
          PDF
        </span>
      </button>
    </div>
  )
}

export default StoreManagementMenu
