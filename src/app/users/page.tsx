'use client'

import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { isEqual } from 'lodash'
import { PlusIcon } from 'lucide-react'
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
import Input from '@/components/ui/input'
import { ResponsiveDialog, ResponsiveDialogContent } from '@/components/ui/responsive-dialog'
import { UserInfo } from '@/lib/services/authentication'
import { getAllStates, StateDTO } from '@/lib/services/state'
import {
  deactivateUserByID,
  getAllUsers,
  getFilteredUsers,
  searchUsers,
  UserFilterParams,
} from '@/lib/services/users'
import { cn } from '@/lib/utils'

const Page = () => {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Partial<UserInfo>[]>([])
  const [isLoadingSearch, setIsLoadingSearch] = useState(false)

  const [filters, setFilters] = useState<UserFilterParams>({})
  const [filtersOpen, setFiltersOpen] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ['users', filters],
    queryFn: () => (Object.keys(filters).length ? getFilteredUsers(filters) : getAllUsers()),
  })

  // Debounced search (overrides the list if query is non-empty)
  useEffect(() => {
    if (!query.trim()) {
      setResults([])

      return
    }

    const timeout = setTimeout(async () => {
      setIsLoadingSearch(true)

      try {
        const res = await searchUsers(query)

        setResults(res.data)
      } catch (err: any) {
        toast.success(err?.response?.data.message || 'خطایی رخ داده است لطفا مجددا تلاش کنید')
        console.error(err)
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
    <div className="container mx-auto flex flex-col px-[24px] md:px-[56px] lg:px-[80px]">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-bold text-black">لیست کارشناسان فروش</h1>
      </div>
      <div className="w-aut mt-6 flex justify-center gap-2 sm:w-[450px]">
        <Input
          startIcon={<SearchIcon />}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-[62px] grow placeholder:text-[#BABCBE]"
          placeholder="جستجو"
        />
        <button
          onClick={() => setFiltersOpen(true)}
          className="flex size-[62px] items-center justify-center rounded-[10px] border border-[#BABCBE] md:size-[56px]"
        >
          <FilterIconSecondary />
        </button>
      </div>
      <div className="mt-5 grid max-h-[70vh] grid-cols-3 gap-6 overflow-y-auto pb-[120px] md:pb-0">
        {isLoadingSearch && (
          <div className="flex size-full items-center justify-center">
            <LoadingSpinner />
          </div>
        )}
        {!isLoadingSearch &&
          (results?.length ? results : (data?.data as UserInfo[])).map((user, key) => (
            <div key={key} className="col-span-3 h-fit md:col-span-2 lg:col-span-1">
              <UserItemCard user={user} key={`${user._id as string}-${user.name as string}`} />
            </div>
          ))}
      </div>
      <div className="fixed inset-x-0 bottom-0 flex w-full flex-wrap-reverse items-center justify-center gap-4 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,1)_25%)] px-6 py-[35px] md:static md:py-[75px]">
        <Button
          className="h-[56px] w-full font-bold md:w-[255px]"
          variant="brand"
          onClick={() => {
            router.push('/users/new')
          }}
        >
          ثبت کارشناس جدید <PlusIcon />
        </Button>
      </div>
      <FiltersMenu
        isOpen={filtersOpen}
        setIsOpen={setFiltersOpen}
        onAccept={(f) => setFilters(f)}
      />
    </div>
  )
}

const UserItemCard = ({ user }: { user: UserInfo }) => {
  const router = useRouter()
  const [deletionModalOpen, setDeletionModalOpen] = useState(false)
  const fullName = user.name + ' ' + user.lastName

  return (
    <div className=" flex w-full flex-col gap-4 rounded-[16px] border border-[#e4e4e4] px-6 py-4 sm:max-w-[450px]">
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[18px] font-bold">
            {fullName.includes('undefined') ? 'نامشخص' : fullName}
          </span>
        </div>
        <span className="rounded-[10px] border border-[#164ef3] px-2 py-1 text-[18px] font-medium text-[#164ef3]">
          {user.identifierCode ?? 'ثبت نشده'}
        </span>
      </div>
      <div className="flex w-full items-center justify-between">
        <span>شماره موبایل:</span>
        <span className="font-fa-num">{user.phone ? Number(user.phone) : '-'}</span>
      </div>
      <p className="font-fa-num w-full max-w-[70%] truncate text-[16px] leading-[22px] text-[#9D9D9D]">{`${user.state ?? ''}، ${user.city ?? ''}، ${user.district ?? ''}`}</p>
      <div className="h-[0.5px] w-full bg-[#b6b6b6]" />
      <div className="grid w-full grid-cols-2 gap-6">
        <Button
          onClick={() => {
            router.push(`/users/${user._id}`)
          }}
          className="col-span-1 rounded-[10px] border border-black bg-white text-black hover:bg-white"
        >
          ویرایش اطلاعات
        </Button>
        <Button
          onClick={() => {
            setDeletionModalOpen(true)
          }}
          className="col-span-1 rounded-[10px] border border-[#E23838] bg-white text-[#E23838] hover:bg-white"
        >
          لغو دسترسی
        </Button>
      </div>
      <UserDeactivationModal
        userId={user._id}
        isOpen={deletionModalOpen}
        setIsOpen={setDeletionModalOpen}
      />
    </div>
  )
}

const UserDeactivationModal = ({
  isOpen,
  setIsOpen,
  userId,
}: {
  isOpen: boolean
  setIsOpen: (val: boolean) => void
  userId: string
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const deactivateUser = async () => {
    try {
      setIsSubmitting(true)
      await deactivateUserByID(userId)
    } catch (error: any) {
      toast.success(error?.response?.data.message || 'خطایی رخ داده است لطفا مجددا تلاش کنید')
      console.log({ error })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ResponsiveDialog open={isOpen} onOpenChange={setIsOpen}>
      <ResponsiveDialogContent className="flex flex-col gap-4">
        <p>آیا برای لغو دسترسی این کاربر مطمئن هستید؟</p>
        <div className="flex items-center gap-4">
          <Button
            variant="brand"
            className="h-[67px] flex-1 text-[20px] font-medium"
            onClick={deactivateUser}
          >
            بله {isSubmitting && <LoadingSpinner />}
          </Button>
          <Button
            variant="default"
            className="h-[67px] flex-1 text-[20px] font-medium"
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

const FiltersMenu = ({
  onAccept,
  isOpen,
  setIsOpen,
}: {
  onAccept: (val: UserFilterParams) => void
  isOpen: boolean
  setIsOpen: (val: boolean) => void
}) => {
  const [filters, setFilters] = useState<UserFilterParams>({})
  const [lastAcceptedFilters, setLastAcceptedFilters] = useState<UserFilterParams>({})

  const { data } = useQuery<{ data: StateDTO[] }>({
    queryKey: ['states'],
    queryFn: getAllStates,
  })

  const hasChanged = !isEqual(filters, lastAcceptedFilters)

  return (
    <div
      className={cn(
        'absolute bg-white transition-all pb-[75px] inset-0 pt-[64px]',
        isOpen ? 'translate-x-0' : 'translate-x-full',
      )}
    >
      <div className="relative z-40 flex h-full flex-col pb-16">
        <Accordion type="multiple" className="flex w-full flex-col gap-4 overflow-y-auto px-10">
          {/* استان */}
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
                      onCheckedChange={(c) =>
                        setFilters((prev) => ({
                          ...prev,
                          state: c
                            ? [...(prev.state || []), state.name]
                            : prev.state?.filter((s) => s !== state.name),
                        }))
                      }
                      onClick={(e) => e.stopPropagation()}
                    />
                    <label htmlFor={state.name} className="cursor-pointer">
                      {state.name}
                    </label>
                  </div>
                )
              })}
            </AccordionContent>
          </AccordionItem>

          {/* شهر */}
          <AccordionItem value="city" className="rounded-[24px] border">
            <AccordionTrigger className="flex h-[56px] items-center justify-between px-4">
              شهر
            </AccordionTrigger>
            <AccordionContent className="flex max-h-[200px] flex-col overflow-y-auto pb-0">
              {data?.data?.flatMap((state) =>
                state.cities?.map((city) => {
                  // console.log({city})
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
                        onCheckedChange={(c) =>
                          setFilters((prev) => ({
                            ...prev,
                            city: c
                              ? [...(prev.city || []), cityName]
                              : prev.city?.filter((x) => x !== cityName),
                          }))
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                      <label htmlFor={cityName} className="cursor-pointer">
                        {cityName}
                      </label>
                    </div>
                  )
                }),
              )}
            </AccordionContent>
          </AccordionItem>

          {/* ناحیه */}
          <AccordionItem value="district" className="rounded-[24px] border">
            <AccordionTrigger className="flex h-[56px] items-center justify-between px-4">
              ناحیه
            </AccordionTrigger>
            <AccordionContent className="flex max-h-[200px] flex-col overflow-y-auto pb-0">
              {data?.data?.flatMap((state) =>
                state.cities?.flatMap((city) =>
                  city?.districts?.map((d) => {
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
                          onClick={(e) => e.stopPropagation()}
                          onCheckedChange={(c) =>
                            setFilters((prev) => ({
                              ...prev,
                              district: c
                                ? [...(prev.district || []), d]
                                : prev.district?.filter((x) => x !== d),
                            }))
                          }
                        />
                        <label htmlFor={id} className="cursor-pointer">
                          {city.name} - ناحیه {d}
                        </label>
                      </div>
                    )
                  }),
                ),
              )}
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

export default Page
