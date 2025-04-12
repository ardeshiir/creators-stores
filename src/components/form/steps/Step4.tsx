'use client'

import { useState } from 'react'
import { z } from 'zod'
import { UseFormReturn } from 'react-hook-form'

import { FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import Input from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'
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

  const filteredSuggestions = suggestions
    .filter((s) =>
      s.toLowerCase().startsWith(brandInput.toLowerCase()) &&
      !current.includes(s),
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
    <>
      <FormItem>
        <FormLabel className="text-lg font-bold text-black">
          سایر برند های موجود در فروشگاه
        </FormLabel>

        <div className="relative">
          <div className="flex gap-2 mt-2">
            <Input
              value={brandInput}
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
              className="h-full group min-h-[64px] rounded-[20px] aspect-square text-black bg-transparent border-black border flex items-center justify-center"
            >
              <Plus className="group-hover:text-white" />
            </Button>
          </div>

          {/* Autocomplete dropdown */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <ul
              className="absolute z-10 bg-white w-full mt-1 border rounded-lg shadow-sm max-h-48 overflow-auto text-sm">
              {filteredSuggestions.map((s, i) => (
                <li
                  key={i}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer suggestion"
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

      <ul className="grid grid-cols-2 gap-2 mt-4">
        {current.map((brand, i) => (
          <li
            key={i}
            className="flex items-center justify-between h-[51px] font-medium text-lg bg-[#F5F5F5] rounded-[20px] border border-[#e4e4e4] px-3 py-1"
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
    </>
  )
}
