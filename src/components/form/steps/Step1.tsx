// components/form/steps/Step1.tsx
'use client'

import { X } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import Input, { InputSecondary } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { safeArray } from '@/lib/form'

export const schema1 = z.object({
  storeName: z.string().min(2).optional(),
  storeCode: z.string().min(2).optional(),
  propertyStatus: z.enum(['rental', 'owner']).optional(),
  name: z.string().min(2).optional(),
  familyName: z.string().min(2).optional(),
  mobile: z.array(z.string().optional()).optional(),
})

export type Step1Values = z.infer<typeof schema1>

export default function Step1({ form }: { form: UseFormReturn<Step1Values> }) {
  const addMobile = () => {
    const current = form.getValues('mobile') ?? []

    form.setValue('mobile', [...current, ''])
  }
  const removeMobile = (index: number) => {
    const current = safeArray(form.getValues('mobile'))
    const updated = current.filter((_, i) => i !== index)

    form.setValue('mobile', updated)
  }

  return (
    <div className="mx-auto max-w-[733px] md:min-h-[300px]">
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
                      placeholder="وضعیت ملک"
                      className="h-[67px] text-lg placeholder:text-lg md:h-[56px]"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="w-full">
                  <SelectItem value="rental">مستاجر</SelectItem>
                  <SelectItem value="owner">مالک</SelectItem>
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
          name="familyName"
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
        <div className="order-5 col-span-6 flex flex-col items-start gap-2 md:order-4 md:col-span-3">
          {safeArray(form.watch('mobile')).map((_, index) => (
            <FormField
              key={index}
              control={form.control}
              name={`mobile.${index}`}
              render={({ field }) => (
                <FormItem className="flex w-full flex-col items-center gap-2">
                  <FormControl>
                    <Input
                      startIconClassName="text-placeholder font-medium"
                      {...field}
                      placeholder="شماره تلفن"
                      startIcon={
                        index > 0 ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeMobile(index)}
                          >
                            <X size={16} />
                          </Button>
                        ) : (
                          '۰۹۱۲۳۴۵۶۷۸۹'
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button
            type="button"
            variant="text"
            className="px-0 text-brand-primary"
            onClick={addMobile}
          >
            + اضافه کردن شماره جدید
          </Button>
        </div>
      </div>
    </div>
  )
}
