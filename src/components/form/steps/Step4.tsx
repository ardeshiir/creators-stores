'use client'

import { useState } from 'react'

import { Plus, X } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { InputSecondary } from '@/components/ui/input'
import { safeArray } from '@/lib/form'

export const schema4 = z.object({
  otherBrands: z.array(z.string().min(1)).optional(),
})

export type Step4Values = z.infer<typeof schema4>

const suggestions = [
  'پنتر',
  'پیکاسو',
  'پارسیکار',
  'زگال',
  'کورونا',
  'کیان',
  'کایزرکانگورو',
  'پاپکو',
  'آریا',
  'آرت لاین',
  'کانکس',
  'اسکول فنز',
  'اسکول مکس',
  'بنیتو- پالو',
  'زبرا',
  'الیپون',
  'پلیکان',
  'کنکو',
  'استورم',
  'پارس مداد',
  'لوکسور',
]

export default function Step4({ form }: { form: UseFormReturn<Step4Values> }) {
  const [brandInput, setBrandInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const current = safeArray(form.watch('otherBrands'))

  const filteredSuggestions = suggestions.filter(
    (s) => s.toLowerCase().startsWith(brandInput.toLowerCase()) && !current.includes(s),
  )

  const addBrand = (brand?: string) => {
    const value = brand ?? brandInput.trim()

    if (!value) return

    if (!current.includes(value)) {
      const updated = [...current, value]

      form.setValue('otherBrands', updated)
    }

    setBrandInput('')
    setShowSuggestions(false)
  }

  const removeBrand = (index: number) => {
    const updated = current.filter((_, i) => i !== index)

    form.setValue('otherBrands', updated)
  }

  return (
    <div className="mx-auto w-full max-w-[733px] md:min-h-[300px]">
      <FormItem>
        <FormLabel className="text-lg font-bold text-black">
          سایر برند های موجود در فروشگاه
        </FormLabel>

        <div className="relative">
          <div className="mt-4 flex gap-4">
            <InputSecondary
              value={brandInput}
              className="max-w-[358px]"
              placeholder="نام برند"
              onChange={(e) => {
                setBrandInput(e.target.value)
                setShowSuggestions(true)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addBrand()
                }
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={(e) => {
                setTimeout(() => setShowSuggestions(false), 400)
              }}
            />
            <Button
              type="button"
              onClick={() => addBrand()}
              className="group flex aspect-square h-full min-h-[64px] items-center justify-center rounded-[20px] border border-black bg-transparent text-black hover:bg-brand-primary"
            >
              <Plus className="group-hover:text-white" />
            </Button>
          </div>

          {/* Autocomplete dropdown */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-lg border bg-white text-sm shadow-sm">
              {filteredSuggestions.map((s, i) => (
                <li
                  key={i}
                  className="suggestion cursor-pointer px-3 py-2 hover:bg-gray-100"
                  onClick={() => addBrand(s)}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>

        <FormMessage />
      </FormItem>

      <ul className="mt-4 grid grid-cols-2 gap-4 md:flex">
        {current.map((brand, i) => (
          <li
            key={i}
            className="flex h-[51px] items-center justify-between rounded-[14px] border border-border bg-[#F5F5F5] px-3 py-1 text-lg font-medium text-black md:min-w-[176px]"
          >
            <Button type="button" size="icon" variant="ghost" onClick={() => removeBrand(i)}>
              <X size={16} />
            </Button>
            <span>{brand}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
