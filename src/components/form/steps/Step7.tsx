// components/form/steps/Step7.tsx
'use client'

import { useState } from 'react'

import { Camera, X } from 'lucide-react'
import { useFieldArray, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { InputSecondary } from '@/components/ui/input'
import { RadioGroup, RadioGroupItemSecondary } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'

export const schema7 = z.object({
  'has-stand': z.string().optional(),
  displayStand: z
    .array(
      z.object({
        brand: z.string(),
        attachments: z.array(z.string()).optional(),
      }),
    )
    .optional(),
})

export type Step7Values = z.infer<typeof schema7>

export function Step7({ form }: { form: UseFormReturn<Step7Values> }) {
  const [previews, setPreviews] = useState<Record<number, string[]>>({})

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'displayStand',
  })

  const handleUpload = (files: FileList, index: number) => {
    const urls = Array.from(files).map((file) => URL.createObjectURL(file))

    form.setValue(`displayStand.${index}.attachments`, urls)
    setPreviews((prev) => ({ ...prev, [index]: urls }))
  }

  return (
    <div className="mx-auto w-full max-w-[526px] md:min-h-[300px]">
      <FormLabel className="text-lg font-bold text-black">استند نمایش محصول</FormLabel>

      {fields.map((field, index) => (
        <div key={field.id} className={cn('grid-cols-2 md:grid md:gap-4', index === 0 && 'mt-4')}>
          {index === 0 && (
            <FormField
              control={form.control}
              name="has-stand"
              render={({ field }) => (
                <FormItem className="col-span-2 grid grid-cols-2 gap-[12px] md:flex">
                  <FormControl>
                    <RadioGroup
                      className="col-span-2 grid grid-cols-2 gap-[12px] md:flex"
                      onValueChange={field.onChange}
                      defaultValue="false"
                    >
                      <FormItem className="order-1 col-span-1 flex items-center space-x-2 md:order-2 md:w-[152px]">
                        <FormControl>
                          <RadioGroupItemSecondary
                            className="h-[67px] md:h-[56px]"
                            label="دارد"
                            value="true"
                          />
                        </FormControl>
                      </FormItem>
                      <FormItem className="order-2 flex items-center space-x-2 md:order-1 md:w-[258px]">
                        <FormControl>
                          <RadioGroupItemSecondary
                            className="h-[67px] md:h-[56px]"
                            label="ندارد"
                            value="false"
                          />
                        </FormControl>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {form.watch('has-stand') === 'true' && (
            <FormField
              control={form.control}
              name={`displayStand.${index}.brand`}
              render={({ field }) => (
                <FormItem className="relative md:size-fit">
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-[-32px] top-1/2 translate-y-[-50%]"
                      onClick={() => remove(index)}
                    >
                      <X size={16} />
                    </Button>
                  )}

                  <FormControl>
                    <InputSecondary
                      className="md:w-[260px]"
                      placeholder="نام برند فعلی"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {form.watch('has-stand') === 'true' && (
            <FormItem className='md:w-fit"'>
              <FormLabel
                htmlFor="signboard-attachment"
                className="flex w-full cursor-pointer items-center justify-center gap-[18px] rounded-[14px] bg-[#EEEEEE] py-[14px] font-medium md:w-[163px] md:justify-between md:px-4"
              >
                <Camera fill="black" stroke="white" />
                تصویر ضمیمه
                <InputSecondary
                  id="signboard-attachment"
                  className="hidden"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => e.target.files && handleUpload(e.target.files, index)}
                />
              </FormLabel>

              <div className="mt-2 flex flex-wrap gap-2">
                {(previews[index] ?? []).map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`preview-${i}`}
                    className="size-16 rounded border object-cover"
                  />
                ))}
              </div>
            </FormItem>
          )}
        </div>
      ))}

      <div className="col-span-2 flex justify-center">
        <Button
          type="button"
          variant="text"
          disabled={
            form.watch('has-stand') === 'false' || typeof form.watch('has-stand') === 'undefined'
          }
          className="mx-auto"
          onClick={() => append({ brand: '', attachments: [] })}
        >
          + اضافه کردن استند نمایش جدید
        </Button>
      </div>
    </div>
  )
}
