'use client'

import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { PlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import FilterIconSecondary from '@/components/icons/FilterIconSecondary'
import SearchIcon from '@/components/icons/SearchIcon'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import { ResponsiveDialog, ResponsiveDialogContent } from '@/components/ui/responsive-dialog'
import { useAuthStore } from '@/hooks/useAuthentication'
import { UserInfo } from '@/lib/services/authentication'
import { deactivateUserByID, getAllUsers, searchUsers } from '@/lib/services/users'
import { numberToPersian } from '@/lib/utils'

const Page = () => {
  const { data, isLoading, error } = useQuery({ queryKey: ['users'], queryFn: getAllUsers })
  const { userInfo, isAuthenticated, isGettingAuthState } = useAuthStore()
  const isSuperAdmin = userInfo?.role === 'global_manager'
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Partial<UserInfo>[]>([])
  const [isLoadingSearch, setIsLoadingSearch] = useState(false)

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

  /*  useEffect(() => {
      if ((!isSuperAdmin || !isAuthenticated) && !isGettingAuthState) {
        toast.error('شما سطح دسترسی لازم را ندارید')
        router.replace('/')
      }
    }, [])*/

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
      <div className="w-aut mx-auto mt-6 flex justify-center sm:w-[450px]">
        <Input
          startIcon={<SearchIcon />}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="grow placeholder:text-[#BABCBE]"
          placeholder="جستجو"
        />
        <button className="flex size-[62px] items-center justify-center rounded-[10px] border border-[#BABCBE]">
          <FilterIconSecondary />
        </button>
      </div>
      <div className="mt-5 flex h-[70vh] flex-wrap items-start justify-center gap-6 overflow-y-auto pb-[120px] md:pb-0">
        {isLoadingSearch && (
          <div className="flex size-full items-center justify-center">
            <LoadingSpinner />
          </div>
        )}
        {!isLoadingSearch &&
          (results?.length ? results : (data?.data as UserInfo[])).map((user) => (
            <UserItemCard user={user} key={`${user._id as string}-${user.name as string}`} />
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
    </div>
  )
}

const UserItemCard = ({ user }: { user: UserInfo }) => {
  const router = useRouter()
  const [deletionModalOpen, setDeletionModalOpen] = useState(false)

  return (
    <div className=" flex w-full flex-col gap-4 rounded-[16px] border border-[#e4e4e4] px-6 py-4 sm:w-[450px]">
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[18px] font-bold">{user.name + ' ' + user.lastName}</span>
        </div>
        <span className="rounded-[10px] border border-[#164ef3] px-2 py-1 text-[18px] font-medium text-[#164ef3]">
          {user.identifierCode ?? 'ثبت نشده'}
        </span>
      </div>
      <div className="flex w-full items-center justify-between">
        <span>شماره موبایل:</span>
        <span>{user.phone ? numberToPersian(Number(user.phone)) : '-'}</span>
      </div>
      <p className="w-full max-w-[70%] truncate text-[16px] leading-[22px] text-[#9D9D9D]">{`${user.state ?? ''}، ${user.city ?? ''}، ${user.district ?? ''}`}</p>
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
        <p>آیا از لغو دسترس این کاربر اطمینان دارید؟</p>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => {
              setIsOpen(false)
            }}
          >
            انصراف
          </Button>
          <Button variant="outline border border-[#E23838] text-[#E23838]" onClick={deactivateUser}>
            لغو دسترسی {isSubmitting && <LoadingSpinner />}
          </Button>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}

export default Page
