// components/form/steps/Step2.tsx
'use client'

import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import Input from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { normalizeNumericInput } from '@/lib/utils'

// ✅ helper to normalize Persian numbers
function numberToEnglish(str: string): string {
  return str.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
}

export const schema2 = z.object({
  storeDescription: z.object({
    area: z.number({ required_error: 'این فیلد الزامیست' }).min(1),
    activityHistory: z.number({ required_error: 'این فیلد الزامیست' }).min(0),
    cooperationHistory: z.number({ required_error: 'این فیلد الزامیست' }).min(0),
    sellerType: z.enum(['wholesaler', 'retailer'], { required_error: 'نوع فروش الزامیست' }),
  }),
})

export type Step2Values = z.infer<typeof schema2>

export function Step2({ form }: { form: UseFormReturn<Step2Values> }) {
  return (
    <div className="">
      <div className="mx-auto grid  grid-cols-6 gap-4 pb-48">
        {/* Area */}
        <FormField
          control={form.control}
          name="storeDescription.area"
          render={({ field }) => (
            <FormItem className="col-span-6 h-fit md:col-span-3">
              <FormControl>
                <Input
                  {...field}
                  startIcon={
                    <span
                      className="text-lg text-[#babcbe]"
                      onClick={() => form.setFocus('storeDescription.area')}
                    >
                      متر
                    </span>
                  }
                  placeholder="مساحت فروشگاه"
                  inputMode="decimal"
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const normalized = normalizeNumericInput(e.target.value)

                    if (normalized === '') {
                      field.onChange(null)

                      return
                    }

                    if (normalized.endsWith('.')) {
                      field.onChange(normalized)
                    } else {
                      const num = Number(normalized)

                      field.onChange(isNaN(num) ? normalized : num) // convert only if valid
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Activity History */}
        <FormField
          control={form.control}
          name="storeDescription.activityHistory"
          render={({ field }) => (
            <FormItem className="col-span-6 h-fit md:col-span-3">
              <FormControl>
                <Input
                  {...field}
                  startIcon={
                    <span
                      className="text-lg text-[#babcbe]"
                      onClick={() => {
                        form.setFocus('storeDescription.activityHistory')
                      }}
                    >
                      سال
                    </span>
                  }
                  placeholder="سابقه فعالیت فروشگاه"
                  inputMode="numeric"
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const normalized = numberToEnglish(e.target.value)
                    const num = parseInt(normalized, 10)

                    field.onChange(isNaN(num) ? undefined : num)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cooperation History */}
        <FormField
          control={form.control}
          name="storeDescription.cooperationHistory"
          render={({ field }) => (
            <FormItem className="col-span-6 h-fit md:col-span-3">
              <FormControl>
                <Input
                  {...field}
                  startIcon={
                    <span
                      className="text-lg text-[#babcbe]"
                      onClick={() => {
                        form.setFocus('storeDescription.cooperationHistory')
                      }}
                    >
                      سال
                    </span>
                  }
                  placeholder="سابقه همکاری با بنیان‌تحریر"
                  inputMode="numeric"
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const normalized = numberToEnglish(e.target.value)
                    const num = parseInt(normalized, 10)

                    field.onChange(isNaN(num) ? undefined : num)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Seller Type */}
        <FormField
          control={form.control}
          name="storeDescription.sellerType"
          render={({ field }) => (
            <FormItem className="col-span-6 h-fit md:col-span-3">
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="نوع فروش" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="wholesaler">عمده فروش</SelectItem>
                  <SelectItem value="retailer">خرده فروش</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
