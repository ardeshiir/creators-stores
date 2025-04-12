// components/form/steps/Step3.tsx
'use client'

import { z } from 'zod'
import { UseFormReturn } from 'react-hook-form'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { CheckboxSecondary } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItemSecondary } from '@/components/ui/radio-group'

const foaOptions = ['لوازم تحریر', 'خرازی', 'کتاب‌فروشی', 'دفتر فنی', 'سایر'] as const

export const schema3 = z.object({
  foa: z.any(),
  purchaseMethod: z.any(),
})

export type Step3Values = z.infer<typeof schema3>

export default function Step3({ form }: { form: UseFormReturn<Step3Values> }) {

  const toggleFoa = (value: (typeof foaOptions)[number]) => {
    const current = form.getValues('foa')
    if (current?.includes(value)) {
      form.setValue('foa', current?.filter((v) => v !== value))
    } else {
      current?.length && form.setValue('foa', [...current, value])
    }
  }


  return (
    <>
      <FormField
        control={form.control}
        name="foa"
        render={() => (
          <FormItem>
            <FormLabel className={'text-lg font-bold'}>زمینه فعالیت</FormLabel>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {foaOptions.map((option) => (
                <FormField
                  key={option}
                  control={form.control}
                  name="foa"
                  render={() => (
                    <FormItem
                      key={option}
                      className="flex items-center col-span-1 space-x-2"
                    >
                      <FormControl>
                        <CheckboxSecondary
                          label={option}
                          className={'w-full'}
                          checked={form.watch('foa')?.includes(option)}
                          onCheckedChange={() => toggleFoa(option)}
                        />
                      </FormControl>
                      {/*<FormLabel className="font-normal">
                                                {option}
                                            </FormLabel>*/}
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="purchaseMethod"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={'text-lg font-bold'}>نحوه خرید</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex mt-2"
              >
                <FormItem className="flex basis-1/2 items-center">
                  <FormControl>
                    <RadioGroupItemSecondary className={'w-full'} label={'مستقیم'} value="direct" />
                  </FormControl>
                  {/*<FormLabel>مستقیم</FormLabel>*/}
                </FormItem>
                <FormItem className="flex basis-1/2 items-center space-x-2">
                  <FormControl>
                    <RadioGroupItemSecondary className={'w-full'} label={'غیر مستقیم'}
                                             value="indirect" />
                  </FormControl>
                  {/*<FormLabel>غیر مستقیم</FormLabel>*/}
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

    </>
  )
}
