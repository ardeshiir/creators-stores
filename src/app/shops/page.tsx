'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import LoadingSpinner from '@/components/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { getAllShops } from '@/lib/services/shop'

const Page = () => {
  const { data, isLoading } = useQuery({ queryKey: ['all-shops'], queryFn: getAllShops })
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="flex size-full items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="container mx-auto flex flex-col px-[24px] md:px-[56px] lg:px-[80px]">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-bold text-black">لیست فروشندگان ثبت شده</h1>
        <button />
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-6">
        {data?.data.map((shop) => (
          <ShopItemCard
            key={`${shop.shopId as number}-${shop.name as string}`}
            address={shop.address?.description as string}
            id={shop.shopId || 0}
            date={new Date(shop.createdAt as Date).toLocaleDateString('fa-IR')}
            name={shop.name as string}
            storeName={shop.storeName as string}
          />
        ))}
      </div>
      <div className="my-[75px] flex w-full flex-wrap-reverse items-center justify-center gap-4">
        <Button
          onClick={() => router.push('/')}
          className="h-[56px] w-full bg-[#E4E4E4] font-bold text-black hover:bg-[#E4E4E4]/10 md:w-[255px]"
        >
          بازگشت
        </Button>
        <Button
          className="h-[56px] w-full font-bold md:w-[255px]"
          variant="brand"
          onClick={() => router.push('/form')}
        >
          ثبت فروشنده جدید
        </Button>
      </div>
    </div>
  )
}

const ShopItemCard = ({
  name,
  storeName,
  address,
  id,
  date,
}: {
  name: string
  storeName: string
  address: string
  id: number
  date: string
}) => {
  const router = useRouter()

  return (
    <div className=" flex w-full flex-col gap-4 rounded-[14px] border border-[#e4e4e4] px-6 py-4 sm:w-[350px]">
      <div className="flex w-full items-start justify-between">
        <div className="flex flex-col">
          <span className="text-[18px] font-bold">{storeName}</span>
          <span className="text-[16px] leading-[22px]">{name}</span>
        </div>
        <span className="rounded-[10px] border border-[#164ef3] px-2 py-1 text-[18px] font-medium text-[#164ef3]">
          {id}
        </span>
      </div>
      <p className="w-full max-w-[70%] truncate text-[16px] leading-[22px]">{address}</p>
      <div className="h-[0.5px] w-full bg-[#b6b6b6]" />
      <div className="flex items-center justify-between">
        <div className="text-[16px] font-medium text-[#9d9d9d]">تاریخ ثبت:{date}</div>
        <Button
          onClick={() => {
            router.push(`/shops/${id}`)
          }}
          className="w-[150px] bg-black text-white"
        >
          مشاهده
        </Button>
      </div>
    </div>
  )
}

export default Page
