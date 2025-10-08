'use client'
import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'

import FormFinalPreview from '@/components/form/steps/FormFinalPreview'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { getShopByShopID } from '@/lib/services/shop'
import { useFormStore } from '@/stores/useFormStore'

const Page = () => {
  const params = useParams()
  const shopID = params.shopid
  const router = useRouter()
  const { data, isLoading } = useQuery({
    queryKey: [shopID, 'shop-item'],
    queryFn: async () => await getShopByShopID(Number(shopID)),
  })
  const { updateData, reset } = useFormStore()

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

      <div className="my-[24px] flex w-full items-center justify-center gap-4 gap-[16px] md:my-[75px]">
        <Button
          className="radius-[20px] h-[67px] flex-1 !py-[18px] text-[14px]"
          onClick={() => {
            reset()
            updateData(data?.data)
            router.push('/form?edit=true')
          }}
          variant="brand"
        >
          ویرایش اطلاعات
        </Button>
        <Button
          onClick={() => router.push('/')}
          className="radius-[20px] h-[67px] w-[33%] !py-[18px] text-[14px] md:w-auto md:flex-1"
          type="button"
          variant="secondary"
        >
          بازگشت
        </Button>
      </div>
    </div>
  )
}

export default Page
