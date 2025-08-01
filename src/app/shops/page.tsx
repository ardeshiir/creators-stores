'use client'

import { useQuery } from '@tanstack/react-query'

import { getAllShops } from '@/lib/services/shop'

const Page = () => {
  const { data, error, isLoading } = useQuery({ queryKey: ['all-shops'], queryFn: getAllShops })

  console.log({ data })

  return <div />
}

export default Page
