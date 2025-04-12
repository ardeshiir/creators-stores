// components/form/steps/Step4.tsx
'use client'

import { useState } from 'react'
import { z } from 'zod'

import { FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import Input from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { safeArray } from '@/lib/form'

export const schema4 = z.object({
  otherBrands: z.array(z.string().min(1)).optional(),
})

export type Step4Values = z.infer<typeof schema4>

export default function Step4({ form }: { form: UseFormReturn<Step4Values> }) {

  const [brandInput, setBrandInput] = useState('')

  const addBrand = () => {
    const trimmed = brandInput.trim()
    const current = form.getValues('otherBrands') ?? []
    if (trimmed && !current.includes(trimmed)) {
      const updated = [...current, trimmed]
      form.setValue('otherBrands', updated)
      setBrandInput('')
    }
  }

  const removeBrand = (index: number) => {
    const current = safeArray(form.getValues('otherBrands'))
    const updated = current.filter((_, i) => i !== index)
    form.setValue('otherBrands', updated)
  }


  return (
    <>
      <FormItem>
        <FormLabel className={'text-lg font-bold text-black'}>سایر برند های موجود در فروشگاه</FormLabel>
        <div className="flex gap-2 mt-2">
          <Input
            value={brandInput}
            placeholder={'نام برند'}
            onChange={(e) => setBrandInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addBrand()
              }
            }}
          />
          <Button type="button"
                  className={'h-full group rounded-[20px] aspect-square text-black bg-transparent border-black border flex items-center justify-center'}
                  onClick={addBrand}>
            <Plus className={'group-hover:text-white'} />
          </Button>
        </div>
        <FormMessage />
      </FormItem>

      <div className="space-y-2">
        <ul className="space-y-1 w-full grid grid-cols-2 gap-2">
          {safeArray(form.watch('otherBrands')).map((brand, i) => (

            <li
              key={i}
              className="flex items-center h-[51px] font-medium text-lg bg-[#F5F5F5] rounded-[20px] col-span-1 justify-between border border-[#e4e4e4] px-3 py-1"
            >
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => removeBrand(i)}
              >
                <X size={16} />
              </Button>
              <span>{brand}</span>
            </li>
          ))}
        </ul>
      </div>

    </>
  )
}
