'use client'

import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import FiltersMenuIcon from '@/components/icons/FiltersMenuIcon'
import LoadingSpinner from '@/components/LoadingSpinner'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ResponsiveDialog, ResponsiveDialogContent } from '@/components/ui/responsive-dialog'
import { useAuthStore } from '@/hooks/useAuthentication'
import { getAllShops, getFilteredShops, ShopFilterParams } from '@/lib/services/shop'
import { getAllStates } from '@/lib/services/state'
import { useFormStore } from '@/stores/useFormStore'

const Page = () => {
  const [filters, setFilters] = useState<ShopFilterParams>({})
  const [filtersModalOpen, setFiltersModalOpen] = useState(false)
  const { data, isLoading } = useQuery({
    queryKey: ['shops', filters],
    queryFn: async () => (Object.keys(filters).length ? getFilteredShops(filters) : getAllShops()),
  })
  const router = useRouter()
  const { reset } = useFormStore()
  // const { isAuthenticated, isGettingAuthState } = useAuthStore()

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

  return (
    <div className="container mx-auto flex flex-col px-[24px] md:px-[56px] lg:px-[80px]">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-bold text-black">لیست فروشندگان ثبت شده</h1>
        <button
          onClick={() => {
            setFiltersModalOpen(true)
          }}
        >
          <div className="flex items-center gap-2 rounded-[10px] border-black px-[8px] py-[10px] md:border">
            <FiltersMenuIcon />
            <span className="hidden text-[14px] font-medium leading-[24px] md:flex">
              مرتب سازی بر اساس
            </span>
          </div>
        </button>
        <FiltersMenu
          setIsOpen={setFiltersModalOpen}
          isOpen={filtersModalOpen}
          onAccept={setFilters}
        />
      </div>
      <div className="mt-5 flex h-[65vh] flex-wrap items-start justify-center gap-6 overflow-y-auto md:items-center">
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
          onClick={() => {
            reset()
            router.push('/form')
          }}
        >
          ثبت فروشنده جدید
        </Button>
      </div>
    </div>
  )
}

const FiltersMenu = ({
  onAccept,
  isOpen,
  setIsOpen,
}: {
  onAccept: (val: ShopFilterParams) => void
  isOpen: boolean
  setIsOpen: (val: boolean) => void
}) => {
  const [filters, setFilters] = useState<ShopFilterParams>({})
  const { userInfo } = useAuthStore()
  const { data, isLoading } = useQuery({
    queryKey: ['states'],
    queryFn: getAllStates,
  })

  return (
    <ResponsiveDialog open={isOpen} onOpenChange={setIsOpen}>
      <ResponsiveDialogContent>
        <div className="relative flex flex-col pb-16">
          <Accordion
            type="multiple"
            className="flex max-h-[428px] w-full flex-col gap-4 overflow-y-auto"
            collapsible
          >
            {/*استان*/}
            {userInfo?.role === 'global_manager' && (
              <AccordionItem value="state" className="rounded-lg border">
                <AccordionTrigger className="flex h-[56px] items-center justify-between px-4">
                  استان
                </AccordionTrigger>
                <AccordionContent className="flex max-h-[200px] flex-col overflow-y-auto pb-0">
                  {data?.data?.map((state) => (
                    <div
                      className="flex items-center gap-2 border-y px-[16px] py-[22px]"
                      key={state.name}
                    >
                      <Checkbox
                        id={state.name}
                        checked={filters.state?.includes(state.name)}
                        onCheckedChange={(checked) =>
                          setFilters((prev) => ({
                            ...prev,
                            state: checked
                              ? [...(prev.state || []), state.name]
                              : prev.state?.filter((s) => s !== state.name),
                          }))
                        }
                      />
                      <label htmlFor="owner" className="cursor-pointer">
                        {state.name}
                      </label>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            )}

            {/* شهر */}
            {(userInfo?.role === 'global_manager' || userInfo?.role === 'regional_manager') && (
              <AccordionItem value="city" className="rounded-lg border">
                <AccordionTrigger className="flex h-[56px] items-center justify-between px-4">
                  شهر
                </AccordionTrigger>
                <AccordionContent className="flex max-h-[200px] flex-col overflow-y-auto pb-0">
                  {data?.data?.map((state) =>
                    state?.cities?.map((city) => (
                      <div
                        className="flex items-center gap-2 border-y px-[16px] py-[22px]"
                        key={city}
                      >
                        <Checkbox
                          id={city}
                          checked={filters.city?.includes(city)}
                          onCheckedChange={(checked) =>
                            setFilters((prev) => ({
                              ...prev,
                              city: checked
                                ? [...(prev.city || []), city]
                                : prev.city?.filter((c) => c !== city),
                            }))
                          }
                        />
                        <label htmlFor="owner" className="cursor-pointer">
                          {city}
                        </label>
                      </div>
                    )),
                  )}
                </AccordionContent>
              </AccordionItem>
            )}
            {/* وضعیت ملک */}
            <AccordionItem value="propertyStatus" className="rounded-lg border">
              <AccordionTrigger className="flex h-[56px] items-center justify-between px-4">
                وضعیت ملک
              </AccordionTrigger>
              <AccordionContent className="flex flex-col pb-0">
                <div className="flex items-center gap-2 border-y px-[16px] py-[22px]">
                  <Checkbox
                    id="owner"
                    checked={filters.propertyStatus === 'owner'}
                    onCheckedChange={(checked) =>
                      setFilters((prev) => ({
                        ...prev,
                        propertyStatus: checked ? 'owner' : undefined,
                      }))
                    }
                  />
                  <label htmlFor="owner" className="cursor-pointer">
                    مالک
                  </label>
                </div>

                <div className="flex items-center gap-2 px-[16px] py-[22px]">
                  <Checkbox
                    id="rental"
                    checked={filters.propertyStatus === 'rental'}
                    onCheckedChange={(checked) =>
                      setFilters((prev) => ({
                        ...prev,
                        propertyStatus: checked ? 'rental' : undefined,
                      }))
                    }
                  />
                  <label htmlFor="rental" className="cursor-pointer">
                    مستاجر
                  </label>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* نوع فروش */}
            <AccordionItem value="sellerType" className="rounded-lg border">
              <AccordionTrigger className="flex h-[56px] items-center justify-between px-4">
                نوع فروش
              </AccordionTrigger>
              <AccordionContent className="flex flex-col pb-0">
                <div className="flex items-center gap-2 border-y px-[16px] py-[22px]">
                  <Checkbox
                    id="wholesaler"
                    checked={filters.sellerType === 'wholesaler'}
                    onCheckedChange={(checked) =>
                      setFilters((prev) => ({
                        ...prev,
                        sellerType: checked ? 'wholesaler' : undefined,
                      }))
                    }
                  />
                  <label htmlFor="wholesaler" className="cursor-pointer">
                    عمده فروش
                  </label>
                </div>
                <div className="flex items-center gap-2 px-[16px] py-[22px]">
                  <Checkbox
                    id="retailer"
                    checked={filters.sellerType === 'retailer'}
                    onCheckedChange={(checked) =>
                      setFilters((prev) => ({
                        ...prev,
                        sellerType: checked ? 'retailer' : undefined,
                      }))
                    }
                  />
                  <label htmlFor="retailer" className="cursor-pointer">
                    خرده فروش
                  </label>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* روش خرید */}
            <AccordionItem value="purchaseMethod" className="rounded-lg border">
              <AccordionTrigger className="flex h-[56px] items-center justify-between px-4">
                روش خرید
              </AccordionTrigger>
              <AccordionContent className="flex flex-col pb-0">
                <div className="flex items-center gap-2 border-y px-[16px] py-[22px]">
                  <Checkbox
                    id="direct"
                    checked={filters.purchaseMethod === 'direct'}
                    onCheckedChange={(checked) =>
                      setFilters((prev) => ({
                        ...prev,
                        purchaseMethod: checked ? 'direct' : undefined,
                      }))
                    }
                  />
                  <label htmlFor="direct" className="cursor-pointer">
                    مستقیم
                  </label>
                </div>
                <div className="flex items-center gap-2 px-[16px] py-[22px]">
                  <Checkbox
                    id="indirect"
                    checked={filters.purchaseMethod === 'indirect'}
                    onCheckedChange={(checked) =>
                      setFilters((prev) => ({
                        ...prev,
                        purchaseMethod: checked ? 'indirect' : undefined,
                      }))
                    }
                  />
                  <label htmlFor="indirect" className="cursor-pointer">
                    غیرمستقیم
                  </label>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* تابلو */}
            <AccordionItem value="signBoard" className="rounded-lg border">
              <AccordionTrigger className="flex h-[56px] items-center justify-between px-4">
                تابلو
              </AccordionTrigger>
              <AccordionContent className="flex flex-col pb-0">
                <div className="flex items-center gap-2 border-y px-[16px] py-[22px]">
                  <Checkbox
                    id="signBoard-yes"
                    checked={filters.hasSignBoard === true}
                    onCheckedChange={(checked) =>
                      setFilters((prev) => ({
                        ...prev,
                        hasSignBoard: checked ? true : undefined,
                      }))
                    }
                  />
                  <label htmlFor="signBoard-yes" className="cursor-pointer">
                    دارد
                  </label>
                </div>
                <div className="flex items-center gap-2 px-[16px] py-[22px]">
                  <Checkbox
                    id="signBoard-no"
                    checked={filters.hasSignBoard === false}
                    onCheckedChange={(checked) =>
                      setFilters((prev) => ({
                        ...prev,
                        hasSignBoard: checked ? false : undefined,
                      }))
                    }
                  />
                  <label htmlFor="signBoard-no" className="cursor-pointer">
                    ندارد
                  </label>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* استند نمایش */}
            <AccordionItem value="displayStand" className="rounded-lg border">
              <AccordionTrigger className="flex h-[56px] items-center justify-between px-4">
                استند نمایش
              </AccordionTrigger>
              <AccordionContent className="flex flex-col pb-0">
                <div className="flex items-center gap-2 border-y px-[16px] py-[22px]">
                  <Checkbox
                    id="displayStand-yes"
                    checked={filters.hasDisplayStand === true}
                    onCheckedChange={(checked) =>
                      setFilters((prev) => ({
                        ...prev,
                        hasDisplayStand: checked ? true : undefined,
                      }))
                    }
                  />
                  <label htmlFor="displayStand-yes" className="cursor-pointer">
                    دارد
                  </label>
                </div>
                <div className="flex items-center gap-2 px-[16px] py-[22px]">
                  <Checkbox
                    id="displayStand-no"
                    checked={filters.hasDisplayStand === false}
                    onCheckedChange={(checked) =>
                      setFilters((prev) => ({
                        ...prev,
                        hasDisplayStand: checked ? false : undefined,
                      }))
                    }
                  />
                  <label htmlFor="displayStand-no" className="cursor-pointer">
                    ندارد
                  </label>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* ویترین */}
            <AccordionItem value="showCase" className="rounded-lg border">
              <AccordionTrigger className="flex h-[56px] items-center justify-between px-4">
                ویترین
              </AccordionTrigger>
              <AccordionContent className="flex flex-col pb-0">
                <div className="flex items-center gap-2 border-y px-[16px] py-[22px]">
                  <Checkbox
                    id="showCase-yes"
                    checked={filters.hasShowCase === true}
                    onCheckedChange={(checked) =>
                      setFilters((prev) => ({
                        ...prev,
                        hasShowCase: checked ? true : undefined,
                      }))
                    }
                  />
                  <label htmlFor="showCase-yes" className="cursor-pointer">
                    دارد
                  </label>
                </div>
                <div className="flex items-center gap-2 px-[16px] py-[22px]">
                  <Checkbox
                    id="showCase-no"
                    checked={filters.hasShowCase === false}
                    onCheckedChange={(checked) =>
                      setFilters((prev) => ({
                        ...prev,
                        hasShowCase: checked ? false : undefined,
                      }))
                    }
                  />
                  <label htmlFor="showCase-no" className="cursor-pointer">
                    ندارد
                  </label>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* footer buttons */}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 pt-6">
            <Button
              variant="brand"
              className="!h-[48px] w-[calc(50%-8px)] rounded-[10px] "
              onClick={() => {
                onAccept(filters)
                setIsOpen(false)
              }}
            >
              اعمال فیلتر
            </Button>
            <Button
              className="!h-[48px] w-[calc(50%-8px)] rounded-[10px] bg-black text-white"
              onClick={() => setIsOpen(false)}
            >
              بستن
            </Button>
          </div>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
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
