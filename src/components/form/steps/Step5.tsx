// components/form/steps/Step5.tsx
'use client'

import { X } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import Input from '@/components/ui/input'
import { safeArray } from '@/lib/form'
import { normalizeNumericInput } from '@/lib/utils'

export const schema5 = z.object({
  address: z.object({
    state: z.string({ required_error: 'این فیلد الزامیست' }),
    city: z.string({ required_error: 'این فیلد الزامیست' }),
    description: z.string({ required_error: 'این فیلد الزامیست' }),
    postalcode: z.string({ required_error: 'این فیلد الزامیست' }),
    district: z.string({ required_error: 'این فیلد الزامیست' }),
    phoneNumber: z.any(),
    landLine: z.any(),
    // location: skipped for now
  }),
})

export type Step5Values = z.infer<typeof schema5>

export default function Step5({ form }: { form: UseFormReturn<Step5Values> }) {
  const addPhone = () => {
    const current = safeArray(form.getValues('address.phoneNumber'))

    form.setValue('address.phoneNumber', [...current, ''])
  }

  const removePhone = (index: number) => {
    const updated = safeArray(form.getValues('address.phoneNumber')).filter((_, i) => i !== index)

    form.setValue('address.phoneNumber', updated)
  }

  return (
    <div className="mx-auto w-full pb-[320px] md:pb-0">
      <FormLabel className="text-lg font-bold text-black">آدرس فروشگاه</FormLabel>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="address.state"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormControl>
                <Input placeholder="استان" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address.city"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormControl>
                <Input placeholder="شهر" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address.district"
          render={({ field }) => (
            <FormItem className="col-span-2 md:col-span-1">
              <FormControl>
                <Input placeholder="منطقه" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address.description"
          render={({ field }) => (
            <FormItem className="col-span-2 md:col-span-1">
              <FormControl>
                <Input placeholder="آدرس پستی" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address.postalcode"
          render={({ field }) => (
            <FormItem className="col-span-2 md:col-span-1">
              <FormControl>
                <Input
                  placeholder="کد پستی"
                  {...field}
                  className="font-fa-num"
                  startIconClassName="text-placeholder font-medium font-fa-num"
                  startIcon={
                    field.value ? undefined : (
                      <span onClick={() => form.setFocus('address.postalcode')}>۱۲۳۴۵۶۷۸۹</span>
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/*<FormLabel>Phone Numbers</FormLabel>*/}
        <FormField
          control={form.control}
          name="address.landLine"
          render={({ field }) => (
            <FormItem className="col-span-2 flex w-full flex-col items-start md:col-span-1 ">
              <FormControl>
                <Input
                  {...field}
                  placeholder="تلفن ثابت"
                  startIconClassName="text-placeholder font-medium"
                  startIcon={
                    field.value ? undefined : (
                      <span onClick={() => form.setFocus('address.landLine')}>02133445544</span>
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem className="col-span-2 flex flex-col items-start md:col-span-1">
          {/*<FormLabel>Phone Numbers</FormLabel>*/}
          <div className="w-full space-y-2">
            {safeArray(form.watch('address.phoneNumber')).map((_, index) => (
              <FormField
                key={index}
                control={form.control}
                name={`address.phoneNumber.${index}`}
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          const normalized = normalizeNumericInput(e.target.value)

                          if (normalized === '') {
                            field.onChange(null)

                            return
                          }

                          field.onChange(Number(normalized))
                        }}
                        placeholder="تلفن همراه"
                        startIconClassName="text-placeholder font-medium"
                        startIcon={
                          field.value ? undefined : index > 0 ? (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removePhone(index)}
                            >
                              <X size={16} />
                            </Button>
                          ) : (
                            <span onClick={() => form.setFocus('address.phoneNumber.0')}>
                              ۰۹۱۲۳۴۵۶۷۸۹
                            </span>
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
          <Button
            type="button"
            variant="text"
            className="px-0 text-brand-primary md:hidden"
            onClick={addPhone}
          >
            + اضافه کردن شماره جدید
          </Button>
        </FormItem>
      </div>
      <Button
        type="button"
        variant="text"
        className="hidden px-0 text-brand-primary md:flex"
        onClick={addPhone}
      >
        + اضافه کردن شماره جدید
      </Button>
    </div>
  )
}
