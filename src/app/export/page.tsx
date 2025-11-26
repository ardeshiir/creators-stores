import { Suspense } from 'react'

import Link from 'next/link'

import { Button } from '@/components/ui/button'

const Page = () => {
  return (
    <Suspense>
      <div className="container relative mx-auto flex !h-full flex-col px-[24px] md:h-auto md:px-[56px] lg:px-[80px]">
        <div className="no-scrollbar mt-5 grid flex-1 grow grid-cols-1 gap-6 overflow-y-auto px-0.5 pb-[140px] md:grid-cols-2 lg:grid-cols-3">
          <div className="mx-auto flex size-full items-center justify-center text-center text-[20px] font-medium text-[#babcbe] md:col-span-2 md:max-w-full lg:col-span-3">
            <div className="max-w-[280px]">
              جهت دانلود فایل اطلاعات، ابتدا دسته بندی مورد نظر را انتخاب کنید.
            </div>
          </div>
        </div>

        <div className="my-[75px] flex w-full flex-wrap-reverse items-center justify-center gap-4 md:my-0">
          <div className="flexo-col fixed inset-x-0 bottom-0 flex w-full items-center  justify-center gap-4 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,1)_25%)] px-6 py-[35px] md:static md:flex-row md:pb-[75px] md:pt-[24px]">
            <Button
              asChild
              variant="brand"
              className="flex h-[67px] flex-1 text-[20px] font-medium md:h-[56px] md:w-[255px]"
            >
              <Link href="/shops?export-mode=true">فروشگاه‌ها</Link>
            </Button>
            <Button
              className="h-[67px] flex-1 text-[20px] font-medium md:h-[56px] md:w-[255px]"
              asChild
              variant="default"
            >
              <Link href="/users?export-mode=true">کارشناسان فروش</Link>
            </Button>
          </div>
        </div>
      </div>
    </Suspense>
  )
}

export default Page
