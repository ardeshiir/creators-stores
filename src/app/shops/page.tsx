'use client'
import { useEffect, useState } from 'react'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { isEqual } from 'lodash'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import FilterIconSecondary from '@/components/icons/FilterIconSecondary'
import SearchIcon from '@/components/icons/SearchIcon'
import LoadingSpinner from '@/components/LoadingSpinner'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Input from '@/components/ui/input'
import { ResponsiveDialog, ResponsiveDialogContent } from '@/components/ui/responsive-dialog'
import { useAuthStore } from '@/hooks/useAuthentication'
import {
  deleteShop,
  getAllShops,
  getFilteredShops,
  searchShops,
  ShopFilterParams,
} from '@/lib/services/shop'
import { getAllStates } from '@/lib/services/state'
import { cn } from '@/lib/utils'
import { FormState, useFormStore } from '@/stores/useFormStore'

const Page = () => {
  const [filters, setFilters] = useState<ShopFilterParams>({})
  const [filtersModalOpen, setFiltersModalOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Partial<FormState['data']>[]>([])
  const [isLoadingSearch, setIsLoadingSearch] = useState(false)
  const { data, isLoading } = useQuery({
    queryKey: ['shops', filters],
    queryFn: async () => (Object.keys(filters).length ? getFilteredShops(filters) : getAllShops()),
  })
  const shouldShowResults = query.trim().length > 0 || Object.keys(filters).length > 0

  const router = useRouter()
  const { reset } = useFormStore()
  // const { isAuthenticated, isGettingAuthState } = useAuthStore()

  /*if (!isAuthenticated && !isGettingAuthState) {
    toast.error('لطفا ابتدا وارد حساب کاربری خود شوید')
    router.replace('/')

    return null
  }*/

  useEffect(() => {
    if (!query.trim()) {
      setResults([])

      return
    }

    const timeout = setTimeout(async () => {
      setIsLoadingSearch(true)

      try {
        const res = await searchShops(query)

        setResults(res.data)
      } catch (err) {
        toast.error('خطا در جستجو')
      } finally {
        setIsLoadingSearch(false)
      }
    }, 500)

    return () => clearTimeout(timeout)
  }, [query])

  if (isLoading) {
    return (
      <div className="flex size-full items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="container relative mx-auto flex !h-full flex-col px-[24px] md:h-auto md:px-[56px] lg:px-[80px]">
      <div className="flex flex-col px-0.5">
        <h1 className="text-[22px] font-bold text-black">لیست فروشندگان ثبت شده</h1>
        <div className="mt-6 flex w-auto justify-center gap-2 sm:w-full">
          <Input
            startIcon={<SearchIcon />}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-[62px] grow placeholder:text-[#BABCBE] md:h-[62px]"
            placeholder="جستجو"
          />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <button className="flex size-[62px] items-center justify-center rounded-[10px] border border-[#BABCBE] ">
                <FilterIconSecondary />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              sideOffset={20}
              className="translate-x-[2px] translate-x-[32px] bg-white md:translate-x-[46px]"
            >
              <DropdownMenuItem className="bg-[#F9F9F9]">جدیدترین</DropdownMenuItem>
              <DropdownMenuItem>قدیمی ترین</DropdownMenuItem>
              <DropdownMenuItem
                className="bg-[#F9F9F9]"
                onClick={() => {
                  setFiltersModalOpen(true)
                }}
              >
                جستجوی پیشرفته
                <ChevronLeft />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <FiltersMenu
          setIsOpen={setFiltersModalOpen}
          isOpen={filtersModalOpen}
          onAccept={setFilters}
        />
      </div>
      <div className="no-scrollbar mt-5 grid flex-1 grow grid-cols-1 gap-6 overflow-y-auto px-0.5 pb-12 md:grid-cols-2 lg:grid-cols-3">
        {shouldShowResults ? (
          !isLoadingSearch && (data?.data?.length > 0 || results?.length) ? (
            (results.length ? results : data?.data).map((shop) => (
              <ShopItemCard
                key={`${shop.shopId as number}-${shop.name as string}`}
                address={shop.address?.description as string}
                dbid={shop._id}
                id={shop.shopId || 0}
                name={shop.name as string}
                storeName={shop.storeName as string}
                queryKeys={['shops', filters]}
              />
            ))
          ) : (
            <div className="mx-auto flex size-full items-center justify-center text-center text-[20px] font-medium text-[#babcbe] md:col-span-2 md:max-w-full lg:col-span-3">
              <div className="max-w-[280px]">نتیجه‌ای برای نمایش وجود ندارد.</div>
            </div>
          )
        ) : (
          <div className="mx-auto flex size-full items-center justify-center text-center text-[20px] font-medium text-[#babcbe] md:col-span-2 md:max-w-full lg:col-span-3">
            <div className="max-w-[280px]">
              برای مشاهده لیست فروشندگان ابتدا جستجو کنید یا فیلترها را اعمال نمایید.
            </div>
          </div>
        )}
      </div>
      {!filtersModalOpen && (
        <div className="my-[75px] flex w-full flex-wrap-reverse items-center justify-center gap-4 md:my-0">
          <div className="fixed inset-x-0 bottom-0 flex w-full flex-wrap-reverse items-center justify-center gap-4 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,1)_25%)] px-6 py-[35px] md:static md:pb-[75px] md:pt-[24px]">
            <Button
              onClick={() => router.push('/')}
              className="hidden h-[56px] w-full bg-[#E4E4E4] text-[20px] font-bold text-black hover:bg-[#E4E4E4]/10 md:flex md:w-[255px]"
            >
              بازگشت
            </Button>

            <Button
              className="h-[67px] w-full text-[20px] font-bold md:h-[56px] md:w-[255px]"
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
      )}
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
  const [lastAcceptedFilters, setLastAcceptedFilters] = useState<ShopFilterParams>({})

  const { userInfo } = useAuthStore()
  const { data, isLoading } = useQuery({
    queryKey: ['states'],
    queryFn: getAllStates,
  })
  const hasChanged = !isEqual(filters, lastAcceptedFilters)

  return (
    <div
      className={cn(
        'absolute bg-white transition-all pb-[75px] inset-0',
        isOpen ? 'opacity-1 translate-x-0' : 'opacity-0 translate-x-full',
      )}
    >
      <div className="relative z-40 flex h-full flex-col pb-16">
        <Accordion
          type="multiple"
          className="flex w-full flex-col gap-4 overflow-y-auto px-10"
          collapsible
        >
          {/* استان */}
          {userInfo?.role === 'global_manager' && (
            <AccordionItem value="state" className="rounded-[24px] border">
              <AccordionTrigger className="flex h-[56px] items-center justify-between px-4">
                استان
              </AccordionTrigger>
              <AccordionContent className="flex max-h-[200px] flex-col overflow-y-auto pb-0">
                {data?.data?.map((state) => {
                  const checked = filters.state?.includes(state.name) ?? false

                  return (
                    <div
                      key={state.name}
                      className="flex cursor-pointer items-center gap-2 border-y px-[16px] py-[22px]"
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          state: checked
                            ? prev.state?.filter((s) => s !== state.name)
                            : [...(prev.state || []), state.name],
                        }))
                      }
                    >
                      <Checkbox
                        id={state.name}
                        checked={checked}
                        onCheckedChange={(checked) =>
                          setFilters((prev) => ({
                            ...prev,
                            state: checked
                              ? [...(prev.state || []), state.name]
                              : prev.state?.filter((s) => s !== state.name),
                          }))
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                      <label htmlFor={state.name}>{state.name}</label>
                    </div>
                  )
                })}
              </AccordionContent>
            </AccordionItem>
          )}

          {/* شهر */}
          {(userInfo?.role === 'global_manager' || userInfo?.role === 'regional_manager') && (
            <AccordionItem value="city" className="rounded-[24px] border">
              <AccordionTrigger className="flex h-[56px] items-center justify-between px-4">
                شهر
              </AccordionTrigger>
              <AccordionContent className="flex max-h-[200px] flex-col overflow-y-auto pb-0">
                {data?.data?.flatMap((state) =>
                  state?.cities?.map((city) => {
                    const cityName = city.name
                    const checked = filters.city?.includes(cityName) ?? false

                    return (
                      <div
                        key={cityName}
                        className="flex cursor-pointer items-center gap-2 border-y px-[16px] py-[22px]"
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            city: checked
                              ? prev.city?.filter((c) => c !== cityName)
                              : [...(prev.city || []), cityName],
                          }))
                        }
                      >
                        <Checkbox
                          id={cityName}
                          checked={checked}
                          onCheckedChange={(checked) =>
                            setFilters((prev) => ({
                              ...prev,
                              city: checked
                                ? [...(prev.city || []), cityName]
                                : prev.city?.filter((c) => c !== cityName),
                            }))
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                        <label htmlFor={cityName}>{cityName}</label>
                      </div>
                    )
                  }),
                )}
              </AccordionContent>
            </AccordionItem>
          )}

          {/* منطقه */}
          <AccordionItem value="district" className="rounded-[24px] border">
            <AccordionTrigger className="flex h-[56px] items-center justify-between px-4">
              منطقه
            </AccordionTrigger>
            <AccordionContent className="flex max-h-[200px] flex-col overflow-y-auto pb-0">
              {data?.data?.flatMap((state) =>
                state.cities?.flatMap((city) =>
                  city.districts?.map((d) => {
                    const checked = filters.district?.includes(d) ?? false
                    const id = `${city.name}-${d}`

                    return (
                      <div
                        key={id}
                        className="flex cursor-pointer items-center gap-2 border-y px-[16px] py-[22px]"
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            district: checked
                              ? prev.district?.filter((dist) => dist !== d)
                              : [...(prev.district || []), d],
                          }))
                        }
                      >
                        <Checkbox
                          id={id}
                          checked={checked}
                          onCheckedChange={(c) =>
                            setFilters((prev) => ({
                              ...prev,
                              district: c
                                ? [...(prev.district || []), d]
                                : prev.district?.filter((dist) => dist !== d),
                            }))
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                        <label htmlFor={id}>
                          {city.name} - منطقه {d}
                        </label>
                      </div>
                    )
                  }),
                ),
              )}
            </AccordionContent>
          </AccordionItem>

          {/* وضعیت ملک */}
          <AccordionItem value="propertyStatus" className="rounded-[24px] border">
            <AccordionTrigger className="flex h-[56px] items-center justify-between px-4">
              وضعیت ملک
            </AccordionTrigger>
            <AccordionContent className="flex flex-col pb-0">
              {[
                { id: 'owner', label: 'مالک' },
                { id: 'rental', label: 'مستاجر' },
              ].map(({ id, label }) => {
                const checked = filters.propertyStatus === id

                return (
                  <div
                    key={id}
                    className="flex cursor-pointer items-center gap-2 border-y px-[16px] py-[22px]"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        propertyStatus: checked ? undefined : id,
                      }))
                    }
                  >
                    <Checkbox
                      id={id}
                      checked={checked}
                      onCheckedChange={(checked) =>
                        setFilters((prev) => ({
                          ...prev,
                          propertyStatus: checked ? id : undefined,
                        }))
                      }
                      onClick={(e) => e.stopPropagation()}
                    />
                    <label htmlFor={id}>{label}</label>
                  </div>
                )
              })}
            </AccordionContent>
          </AccordionItem>

          {/* نوع فروش */}
          <AccordionItem value="sellerType" className="rounded-[24px] border">
            <AccordionTrigger className="flex h-[56px] items-center justify-between px-4">
              نوع فروش
            </AccordionTrigger>
            <AccordionContent className="flex flex-col pb-0">
              {[
                { id: 'wholesaler', label: 'عمده فروش' },
                { id: 'retailer', label: 'خرده فروش' },
              ].map(({ id, label }) => {
                const checked = filters.sellerType === id

                return (
                  <div
                    key={id}
                    className="flex cursor-pointer items-center gap-2 border-y px-[16px] py-[22px]"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        sellerType: checked ? undefined : id,
                      }))
                    }
                  >
                    <Checkbox
                      id={id}
                      checked={checked}
                      onCheckedChange={(checked) =>
                        setFilters((prev) => ({
                          ...prev,
                          sellerType: checked ? id : undefined,
                        }))
                      }
                      onClick={(e) => e.stopPropagation()}
                    />
                    <label htmlFor={id}>{label}</label>
                  </div>
                )
              })}
            </AccordionContent>
          </AccordionItem>

          {/* روش خرید */}
          <AccordionItem value="purchaseMethod" className="rounded-[24px] border">
            <AccordionTrigger className="flex h-[56px] items-center justify-between px-4">
              روش خرید
            </AccordionTrigger>
            <AccordionContent className="flex flex-col pb-0">
              {[
                { id: 'direct', label: 'مستقیم' },
                { id: 'indirect', label: 'غیرمستقیم' },
              ].map(({ id, label }) => {
                const checked = filters.purchaseMethod === id

                return (
                  <div
                    key={id}
                    className="flex cursor-pointer items-center gap-2 border-y px-[16px] py-[22px]"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        purchaseMethod: checked ? undefined : id,
                      }))
                    }
                  >
                    <Checkbox
                      id={id}
                      checked={checked}
                      onCheckedChange={(checked) =>
                        setFilters((prev) => ({
                          ...prev,
                          purchaseMethod: checked ? id : undefined,
                        }))
                      }
                      onClick={(e) => e.stopPropagation()}
                    />
                    <label htmlFor={id}>{label}</label>
                  </div>
                )
              })}
            </AccordionContent>
          </AccordionItem>

          {/* تابلو */}
          <AccordionItem value="signBoard" className="rounded-[24px] border">
            <AccordionTrigger className="flex h-[56px] items-center justify-between px-4">
              تابلو
            </AccordionTrigger>
            <AccordionContent className="flex flex-col pb-0">
              {[
                { id: 'signBoard-yes', label: 'دارد', value: true },
                { id: 'signBoard-no', label: 'ندارد', value: false },
              ].map(({ id, label, value }) => {
                const checked = filters.hasSignBoard === value

                return (
                  <div
                    key={id}
                    className="flex cursor-pointer items-center gap-2 border-y px-[16px] py-[22px]"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        hasSignBoard: checked ? undefined : value,
                      }))
                    }
                  >
                    <Checkbox
                      id={id}
                      checked={checked}
                      onCheckedChange={(checked) =>
                        setFilters((prev) => ({
                          ...prev,
                          hasSignBoard: checked ? value : undefined,
                        }))
                      }
                      onClick={(e) => e.stopPropagation()}
                    />
                    <label htmlFor={id}>{label}</label>
                  </div>
                )
              })}
            </AccordionContent>
          </AccordionItem>

          {/* استند نمایش */}
          <AccordionItem value="displayStand" className="rounded-[24px] border">
            <AccordionTrigger className="flex h-[56px] items-center justify-between px-4">
              استند نمایش
            </AccordionTrigger>
            <AccordionContent className="flex flex-col pb-0">
              {[
                { id: 'displayStand-yes', label: 'دارد', value: true },
                { id: 'displayStand-no', label: 'ندارد', value: false },
              ].map(({ id, label, value }) => {
                const checked = filters.hasDisplayStand === value

                return (
                  <div
                    key={id}
                    className="flex cursor-pointer items-center gap-2 border-y px-[16px] py-[22px]"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        hasDisplayStand: checked ? undefined : value,
                      }))
                    }
                  >
                    <Checkbox
                      id={id}
                      checked={checked}
                      onCheckedChange={(checked) =>
                        setFilters((prev) => ({
                          ...prev,
                          hasDisplayStand: checked ? value : undefined,
                        }))
                      }
                      onClick={(e) => e.stopPropagation()}
                    />
                    <label htmlFor={id}>{label}</label>
                  </div>
                )
              })}
            </AccordionContent>
          </AccordionItem>

          {/* ویترین */}
          <AccordionItem value="showCase" className="rounded-[24px] border">
            <AccordionTrigger className="flex h-[56px] items-center justify-between px-4">
              ویترین
            </AccordionTrigger>
            <AccordionContent className="flex flex-col pb-0">
              {[
                { id: 'showCase-yes', label: 'دارد', value: true },
                { id: 'showCase-no', label: 'ندارد', value: false },
              ].map(({ id, label, value }) => {
                const checked = filters.hasShowCase === value

                return (
                  <div
                    key={id}
                    className="flex cursor-pointer items-center gap-2 border-y px-[16px] py-[22px]"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        hasShowCase: checked ? undefined : value,
                      }))
                    }
                  >
                    <Checkbox
                      id={id}
                      checked={checked}
                      onCheckedChange={(checked) =>
                        setFilters((prev) => ({
                          ...prev,
                          hasShowCase: checked ? value : undefined,
                        }))
                      }
                      onClick={(e) => e.stopPropagation()}
                    />
                    <label htmlFor={id}>{label}</label>
                  </div>
                )
              })}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* footer buttons */}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 px-10 pt-6">
          <Button
            variant="brand"
            disabled={!hasChanged}
            className="!h-[48px] w-[calc(50%-8px)] rounded-[10px]"
            onClick={() => {
              onAccept(filters)
              setLastAcceptedFilters(filters)
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
    </div>
  )
}

const ShopItemCard = ({
  name,
  storeName,
  address,
  id,
  dbid,
  queryKeys,
}: {
  name: string
  storeName: string
  address: string
  id: number
  dbid: string
  queryKeys: any[]
}) => {
  const router = useRouter()
  const [deletionModalOpen, setDeletionModalOpen] = useState(false)

  return (
    <div className=" flex h-fit w-full flex-col gap-4 rounded-[16px] border border-[#e4e4e4] px-6 py-4">
      <div className="flex w-full items-start justify-between">
        <div className="flex flex-col">
          <span className="text-[18px] font-bold">{storeName}</span>
          <span className="text-[16px] leading-[22px]">{name}</span>
        </div>
        <span className="font-fa-num rounded-[10px] border border-[#164ef3] px-2 py-1 text-[18px] font-medium text-[#164ef3]">
          {id}
        </span>
      </div>
      <p className="w-full max-w-[70%] truncate text-[16px] leading-[22px]">{address}</p>
      <div className="h-[0.5px] w-full bg-[#b6b6b6]" />
      <div className="flex items-center justify-between gap-[16px] md:justify-center">
        <Button
          onClick={() => {
            router.push(`/shops/${id}`)
          }}
          className="flex-1 rounded-[10px] border border-black bg-white text-black shadow-none hover:bg-white  md:max-w-[147px] md:flex-auto"
        >
          مشاهده اطلاعات
        </Button>
        <Button
          onClick={() => {
            setDeletionModalOpen(true)
          }}
          className="flex-1 rounded-[10px] border border-[#E23838] bg-white text-[#E23838] shadow-none hover:bg-white md:max-w-[147px] md:flex-auto"
        >
          حذف فروشنده
        </Button>
      </div>
      <ShopDeletionModal
        isOpen={deletionModalOpen}
        setIsOpen={setDeletionModalOpen}
        shopid={dbid}
        queryKeys={queryKeys}
      />
    </div>
  )
}

const ShopDeletionModal = ({
  isOpen,
  setIsOpen,
  shopid,
  queryKeys,
}: {
  isOpen: boolean
  setIsOpen: (val: boolean) => void
  shopid: string
  queryKeys: any[]
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()

  const deactivateUser = async () => {
    try {
      setIsSubmitting(true)
      await deleteShop(shopid)
      queryClient.invalidateQueries({ queryKey: queryKeys })
      setIsSubmitting(false)
      setIsOpen(false)
      toast('حذف فروشنده با موفقیت انجام شد.')
    } catch (error: any) {
      toast.success(error?.response?.data.message || 'خطایی رخ داده است لطفا مجددا تلاش کنید')
      console.log({ error })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ResponsiveDialog open={isOpen} onOpenChange={setIsOpen}>
      <ResponsiveDialogContent className="flex flex-col gap-[26px] px-[24px] pt-[40px]">
        <p>آیا برای حذف فروشنده مطمئن هستید؟</p>
        <div className="flex items-center gap-[16.5px]">
          <Button
            variant="brand"
            className="h-[67px] flex-1 rounded-[20px] text-[20px] font-medium"
            onClick={deactivateUser}
          >
            بله {isSubmitting && <LoadingSpinner />}
          </Button>
          <Button
            variant="default"
            className="h-[67px] flex-1 rounded-[20px] text-[20px] font-medium"
            onClick={() => {
              setIsOpen(false)
            }}
          >
            خیر
          </Button>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}

export default Page
