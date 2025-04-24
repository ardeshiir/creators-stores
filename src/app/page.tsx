'use client'
import { useState } from 'react'

import Link from 'next/link'

import BonyanIcon from '@/components/icons/BonyanIcon'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <div className="flex h-full flex-col items-center justify-between space-y-6 pt-6">
      {isLoggedIn ? (
        <div className="flex flex-col gap-[35px]">
          <div className="flex flex-col items-center gap-8">
            <h1 className="text-[24px] font-[900]">پنل مدیریت باشگاه فروشندگان</h1>
            <span className="text-lg">نسخه ۱.۰.۴</span>
          </div>
          <div className="flex flex-col items-center gap-8">
            <Button className="flex h-[67px] w-full items-center justify-center">
              <Link className="flex size-full items-center justify-center" href="/form">
                ثبت فروشنده جدید
              </Link>
            </Button>
            <Button className="flex h-[67px] w-full items-center justify-center bg-black text-white">
              <Link className="flex size-full items-center justify-center" href="/list">
                فروشندگان ثبت شده
              </Link>
            </Button>
          </div>
          <button className="flex h-[47px] items-center justify-between rounded-[20px] border border-[#BABCBE] px-5 font-bold">
            دانلود فایل راهنما
            <span className="flex h-[26px] w-[50px] items-center justify-center rounded-[10px] bg-[#FF0000] text-lg font-[900] text-white">
              PDF
            </span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-[35px]">
          <div className="flex flex-col items-center gap-8">
            <h1 className="text-[24px] font-[900]">پنل مدیریت باشگاه فروشندگان</h1>
            <span className="text-lg">نسخه ۱.۰.۴</span>
          </div>
          <div className="flex flex-col gap-3">
            <Input placeholder="شماره موبایل" className="placeholder:text-center" />
            <Input placeholder="شماره شناسه" className="placeholder:text-center" />
            <Button
              className="flex h-[67px] w-full items-center justify-center"
              onClick={() => {
                setIsLoggedIn(true)
              }}
            >
              ورود
            </Button>
          </div>
        </div>
      )}
      <footer className="flex h-[140px] w-full items-start justify-center bg-black pt-7">
        <BonyanIcon />
      </footer>
    </div>
  )
}
