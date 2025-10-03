'use client'

import * as React from 'react'

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { CircleIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn('grid gap-2', className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        'border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        <CircleIcon className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 fill-primary" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

function RadioGroupItemSecondary({
  className,
  label,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item> & { label: string }) {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        'w-full text-center flex items-center h-12 justify-center rounded-[16px] border transition-colors text-lg font-medium',
        'data-[state=checked]:border-brand-primary data-[state=checked]:border-2 data-[state=checked]:font-bold',
        'data-[state=unchecked]:border-gray-200 data-[state=unchecked]:bg-[#FBFBFB] data-[state=unchecked]:text-black',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400',
        className,
      )}
      {...props}
    >
      {label}
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem, RadioGroupItemSecondary }
