'use client'
import { Suspense } from 'react'

import ShopPageContainer from '@/components/shopPageContainer'

const Page = () => {
  return (
    <Suspense>
      <ShopPageContainer />
    </Suspense>
  )
}

export default Page
