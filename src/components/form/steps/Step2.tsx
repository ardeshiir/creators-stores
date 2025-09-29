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
    <div className="md:min-h-[300px]">
      <div className="mx-auto grid max-w-[733px] grid-cols-6 gap-4 ">
        <FormField
          control={form.control}
          name="storeDescription.area"
          render={({ field }) => (
            <FormItem className="col-span-6 h-fit md:col-span-3">
              {/*<FormLabel>Store Area (m²)</FormLabel>*/}
              <FormControl>
                <Input
                  startIcon={<span className="text-lg text-[#babcbe]">متر</span>}
                  placeholder="مساحت فروشگاه"
                  type="number"
                  {...field}
                  onChange={(e) => {
                    if (Number(e.target.value) >= 0) {
                      field.onChange(+e.target.value)
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="storeDescription.activityHistory"
          render={({ field }) => (
            <FormItem className="col-span-6 h-fit md:col-span-3">
              {/*<FormLabel>Years of Activity</FormLabel>*/}
              <FormControl>
                <Input
                  startIcon={<span className="text-lg text-[#babcbe]">سال</span>}
                  placeholder="سابقه فعالیت فروشگاه"
                  type="number"
                  {...field}
                  onChange={(e) => {
                    if (Number(e.target.value) >= 0) {
                      field.onChange(+e.target.value)
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="storeDescription.cooperationHistory"
          render={({ field }) => (
            <FormItem className="col-span-6 h-fit md:col-span-3">
              {/*<FormLabel>Years of Cooperation</FormLabel>*/}
              <FormControl>
                <Input
                  startIcon={<span className="text-lg text-[#babcbe]">سال</span>}
                  placeholder="سابقه همکاری با بنیان‌تحریر"
                  type="number"
                  {...field}
                  onChange={(e) => {
                    if (Number(e.target.value) >= 0) {
                      field.onChange(+e.target.value)
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="storeDescription.sellerType"
          render={({ field }) => (
            <FormItem className="col-span-6 h-fit md:col-span-3">
              {/*<FormLabel>Seller Type</FormLabel>*/}
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
