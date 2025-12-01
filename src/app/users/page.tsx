'use client'

import { Suspense } from 'react'

import UsersPageContainer from '@/components/usersPageContainer'

const Page = () => {
  return (
    <Suspense>
      <UsersPageContainer />
    </Suspense>
  )
}

export default Page
