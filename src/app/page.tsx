'use client'
import BonyanIcon from '@/components/icons/BonyanIcon'
import Input from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  return (
    <div className="flex flex-col items-center justify-between h-full space-y-6 pt-6">
      {isLoggedIn ? <div className={'flex flex-col gap-[35px]'}>
          <div className={'flex flex-col items-center gap-8'}>
            <h1 className={'text-[24px] font-[900]'}>پنل
              مدیریت
              باشگاه
              فروشندگان</h1>
            <span className={'text-lg'}>نسخه ۱.۰.۴</span>
          </div>
          <div className={'flex flex-col items-center gap-8'}>
            <Button className={'w-full h-[67px] flex items-center justify-center'}>
              <Link className={'size-full flex items-center justify-center'} href={'/form'}>ثبت فروشنده جدید</Link>
            </Button>
            <Button className={'w-full h-[67px] flex bg-black text-white items-center justify-center'}>
              <Link className={'size-full flex items-center justify-center'} href={'/list'}>فروشندگان ثبت شده</Link>
            </Button>
          </div>
          <button
            className={'flex font-bold px-5 border border-[#BABCBE] h-[47px] rounded-[20px] items-center justify-between'}>
            دانلود فایل راهنما
            <span
              className={'w-[50px] text-white rounded-[10px] h-[26px] flex items-center justify-center bg-[#FF0000] font-[900] text-lg'}>PDF</span>
          </button>
        </div>
        :
        <div className={'flex flex-col gap-[35px]'}>
          <div className={'flex flex-col items-center gap-8'}><h1 className={'text-[24px] font-[900]'}>پنل
            مدیریت
            باشگاه
            فروشندگان</h1>
            <span className={'text-lg'}>نسخه ۱.۰.۴</span></div>
          <div className={'flex flex-col gap-3'}>
            <Input placeholder={'شماره موبایل'} className={'placeholder:text-center'} />
            <Input placeholder={'شماره شناسه'} className={'placeholder:text-center'} />
            <Button className={'w-full h-[67px] flex items-center justify-center'} onClick={() => {
              setIsLoggedIn(true)
            }}>ورود</Button>
          </div>
        </div>
      }
      <footer className="w-full h-[140px] bg-black flex items-start justify-center pt-7">
        <BonyanIcon />
      </footer>
    </div>
  )
}
