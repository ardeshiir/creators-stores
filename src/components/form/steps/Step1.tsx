// components/form/steps/Step1.tsx
'use client'

import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { InputSecondary } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const propertyDictionary = {
  rental: 'مستاجر',
  owner: 'مالک',
}

export const schema1 = z.object({
  storeName: z.string({ required_error: 'نام فروشگاه الزامی است و باید حداقل ۲ کاراکتر باشد' }),
  storeCode: z
    .string({ required_error: 'کد فروشگاه الزامی است و باید حداقل ۲ کاراکتر باشد' })
    .min(2, { message: 'کد فروشگاه الزامی است و باید حداقل ۲ کاراکتر باشد' }),
  propertyStatus: z.enum(['rental', 'owner'], {
    required_error: 'وضعیت ملک الزامی است',
  }),
  name: z
    .string({ required_error: 'نام الزامی است و باید حداقل ۲ کاراکتر باشد' })
    .min(2, { message: 'نام الزامی است و باید حداقل ۲ کاراکتر باشد' }),
  lastName: z
    .string({ required_error: 'نام خانوادگی الزامی است و باید حداقل ۲ کاراکتر باشد' })
    .min(2, { message: 'نام خانوادگی الزامی است و باید حداقل ۲ کاراکتر باشد' }),
})

export type Step1Values = z.infer<typeof schema1>

export default function Step1({ form }: { form: UseFormReturn<Step1Values> }) {
  return (
    <div className="mx-auto ">
      <div className="grid grid-cols-6 gap-4">
        <FormField
          control={form.control}
          name="storeName"
          render={({ field }) => (
            <FormItem className="order-1 col-span-6 md:col-span-3">
              <FormControl>
                <InputSecondary {...field} placeholder="نام فروشگاه" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="storeCode"
          render={({ field }) => (
            <FormItem className="order-1 col-span-6 md:col-span-3">
              <FormControl>
                <InputSecondary {...field} placeholder="کد فروشگاه" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="propertyStatus"
          render={({ field }) => (
            <FormItem className="order-2 col-span-6 md:order-5 md:col-span-3">
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="h-[67px] w-full border border-[#E4E4E4] bg-[#F9F9F9] md:h-[56px]">
                    <SelectValue
                      placeholder={propertyDictionary[form.watch('propertyStatus')] || 'وضعیت ملک'}
                      className="h-[67px] text-lg placeholder:text-lg md:h-[56px]"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="w-full">
                  <SelectItem value="rental">{propertyDictionary['rental']}</SelectItem>
                  <SelectItem value="owner">{propertyDictionary['owner']}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="order-3 col-span-6 md:order-2 md:col-span-3">
              {/*<FormLabel>Name</FormLabel>*/}
              <FormControl>
                <InputSecondary {...field} placeholder="نام" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem className="order-4 col-span-6 md:order-3 md:col-span-3">
              {/*<FormLabel>Family Name</FormLabel>*/}
              <FormControl>
                <InputSecondary {...field} placeholder="نام خانوادگی" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
