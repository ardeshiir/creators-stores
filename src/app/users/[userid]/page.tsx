'use client'
import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'

import UserForm from '@/components/form/UserForm'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useAuthStore } from '@/hooks/useAuthentication'
import { getUserByID } from '@/lib/services/users'

const Page = () => {
  const params = useParams()
  const userId = params.userid
  const { userInfo, isAuthenticated, isGettingAuthState } = useAuthStore()
  const isSuperAdmin = userInfo?.role === 'global_manager'
  const router = useRouter()
  const { data, isLoading } = useQuery({
    queryKey: [userId, 'user'],
    queryFn: async () => await getUserByID(userId as string),
  })

  /*useEffect(() => {
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

  if (!data?.data && !isLoading) {
    return (
      <div className="flex size-full items-center justify-center">کاربر مورد نظر موجود نمیباشد</div>
    )
  }

  return (
    <div className="container mx-auto flex flex-col items-center px-[24px] md:px-[56px] lg:px-[80px]">
      {data?.data && <UserForm defaultUserValues={data?.data} />}
    </div>
  )
}

export default Page
