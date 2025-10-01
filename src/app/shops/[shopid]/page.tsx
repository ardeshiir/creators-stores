'use client'
import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'

import FormFinalPreview from '@/components/form/steps/FormFinalPreview'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/hooks/useAuthentication'
import { getShopByShopID } from '@/lib/services/shop'

const Page = () => {
  const params = useParams()
  const shopID = params.shopid
  const router = useRouter()
  const { data, isLoading } = useQuery({
    queryKey: [shopID, 'shop-item'],
    queryFn: async () => await getShopByShopID(Number(shopID)),
  })
  const { isAuthenticated, isGettingAuthState } = useAuthStore()

  /*if (!isAuthenticated && !isGettingAuthState) {
    toast.error('لطفا ابتدا وارد حساب کاربری خود شوید')
    router.replace('/')

    return null
  }*/

  if (isLoading) {
    return (
      <div className="flex size-full items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!data?.data && !isLoading) {
    return (
      <div className="flex size-full items-center justify-center">
        فروشگاه مورد نظر موجود نمیباشد
      </div>
    )
  }

  return (
    <div className="container mx-auto flex flex-col items-center px-[24px] md:px-[56px] lg:px-[80px]">
      <FormFinalPreview data={data?.data} />
      <div className="my-[24px] flex w-full items-center justify-center gap-4 md:my-[75px]">
        <Button
          onClick={() => router.push('/')}
          className="h-[56px] w-full bg-[#E4E4E4] font-bold text-black hover:bg-[#E4E4E4]/10 md:w-[255px]"
        >
          بازگشت
        </Button>
        <Button
          className="h-[56px] w-full font-bold hover:bg-white md:w-[255px]"
          variant="brand"
          onClick={() => router.push('/form')}
        >
          ویرایش اطلاعات
        </Button>
      </div>
    </div>
  )
}

export default Page
