// components/form/steps/Step8.tsx
'use client'

import { useState } from 'react'

import { Camera, X } from 'lucide-react'
import { useFieldArray, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import Input, { InputSecondary } from '@/components/ui/input'
import { RadioGroup, RadioGroupItemSecondary } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'

export const schema8 = z.object({
  'has-showcase': z.string().optional(),
  showCase: z.array(
    z.object({
      dimensions: z.object({
        width: z.number().optional(),
        height: z.number().optional(),
      }),
      sticker: z.boolean().optional(),
      attachments: z.array(z.string()).optional(),
    }),
  ),
})

export type Step8Values = z.infer<typeof schema8>

export function Step8({ form }: { form: UseFormReturn<Step8Values> }) {
  const [previews, setPreviews] = useState<Record<number, string[]>>({})

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'showCase',
  })

  const handleUpload = (files: FileList, index: number) => {
    const urls = Array.from(files).map((file) => URL.createObjectURL(file))

    form.setValue(`showCase.${index}.attachments`, urls)
    setPreviews((prev) => ({ ...prev, [index]: urls }))
  }

  return (
    <div className="mx-auto w-full max-w-[733px] md:min-h-[300px]">
      <FormLabel className="text-lg font-bold text-black">ویترین نمایش محصول</FormLabel>

      {fields.map((field, index) => (
        <div key={field.id} className={cn('relative', index === 0 && 'mt-4')}>
          {index === 0 && (
            <FormField
              control={form.control}
              name="has-showcase"
              render={({ field }) => (
                <FormItem className="col-span-2 grid grid-cols-2 gap-[12px]">
                  <FormControl>
                    <RadioGroup
                      className="col-span-2 grid grid-cols-2 gap-[12px] md:flex md:justify-end"
                      onValueChange={field.onChange}
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

          {form.watch('has-showcase') === 'true' && (
            <div className="mt-4 flex gap-4">
              <FormField
                control={form.control}
                name={`showCase.${index}.dimensions.width`}
                render={({ field }) => (
                  <FormItem className="relative flex-1">
                    {/*<FormLabel>Width</FormLabel>*/}
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
                      <Input
                        startIcon={<span className="text-lg text-[#babcbe]">متر</span>}
                        placeholder="عرض"
                        {...field}
                        onChange={(e) => field.onChange(+e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`showCase.${index}.dimensions.height`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    {/*<FormLabel>Width</FormLabel>*/}
                    <FormControl>
                      <Input
                        startIcon={<span className="text-lg text-[#babcbe]">متر</span>}
                        placeholder="ارتفاع"
                        {...field}
                        onChange={(e) => field.onChange(+e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {form.watch('has-showcase') === 'true' && (
            <FormLabel className="mt-4 text-lg font-bold text-black">
              قابلیت نصب استیکر و مش
            </FormLabel>
          )}
          {form.watch('has-showcase') === 'true' && (
            <div className="col-span-2 mt-4 flex w-full flex-col gap-4 md:flex-row md:items-center">
              <FormField
                control={form.control}
                name={`showCase.${index}.sticker`}
                render={({ field }) => (
                  <FormItem className="col-span-2 grid grid-cols-2 gap-[12px] md:flex md:w-fit">
                    <FormControl>
                      <RadioGroup
                        className="col-span-2 grid grid-cols-2 gap-[12px] md:flex md:justify-end"
                        onValueChange={field.onChange}
                        defaultValue="true"
                      >
                        <FormItem className="order-1 col-span-1 flex items-center space-x-2 md:order-2 md:w-[152px]">
                          <FormControl>
                            <RadioGroupItemSecondary label="دارد" value="false" />
                          </FormControl>
                        </FormItem>
                        <FormItem className="order-2 flex items-center space-x-2 md:order-1 md:w-[258px]">
                          <FormControl>
                            <RadioGroupItemSecondary label="ندارد" value="true" />
                          </FormControl>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel
                  htmlFor="display-attachment"
                  className="flex w-full cursor-pointer items-center justify-center gap-[18px] rounded-[14px] bg-[#EEEEEE] py-[14px] font-medium md:w-[163px] md:justify-between md:px-4"
                >
                  <Camera fill="black" stroke="white" />
                  تصویر ضمیمه
                  <InputSecondary
                    id="display-attachment"
                    className="hidden"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => e.target.files && handleUpload(e.target.files, index)}
                  />
                </FormLabel>

                {previews[index]?.length && (
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
                )}
              </FormItem>
            </div>
          )}
        </div>
      ))}
      <div className="col-span-2 flex justify-center">
        <Button
          type="button"
          variant="text"
          className="mx-auto"
          disabled={form.watch('has-showcase') !== 'true'}
          onClick={() =>
            append({
              dimensions: { width: 0, height: 0 },
              sticker: false,
              attachments: [],
            })
          }
        >
          + اضافه کردن ویترین نمایش محصول جدید
        </Button>
      </div>
    </div>
  )
}
