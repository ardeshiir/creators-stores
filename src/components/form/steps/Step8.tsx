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

export const schema8 = z.object({
  'has-showcase': z.string(),
  showCase: z.array(
    z.object({
      dimensions: z.object({
        width: z.number().optional(),
        height: z.number().optional(),
      }),
      sticker: z.string(),
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
    <>
      <FormLabel className="text-lg font-bold text-black">ویترین نمایش محصول</FormLabel>

      {fields.map((field, index) => (
        <div key={field.id} className="relative space-y-4">
          {fields.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => remove(index)}
            >
              <X size={16} />
            </Button>
          )}
          <FormField
            control={form.control}
            name="has-showcase"
            render={({ field }) => (
              <FormItem className="col-span-2 grid grid-cols-2 gap-[12px]">
                <FormControl>
                  <RadioGroup
                    className="col-span-2 grid grid-cols-2 gap-[12px]"
                    onValueChange={field.onChange}
                    defaultValue="true"
                  >
                    <FormItem className="col-span-1 flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItemSecondary label="دارد" value="true" />
                      </FormControl>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItemSecondary label="ندارد" value="false" />
                      </FormControl>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch('has-showcase') === 'true' && (
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name={`showCase.${index}.dimensions.width`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    {/*<FormLabel>Width</FormLabel>*/}
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

          <FormLabel className="text-lg font-bold text-black">قابلیت نصب استیکر و مش</FormLabel>
          <FormField
            control={form.control}
            name={`showCase.${index}.sticker`}
            render={({ field }) => (
              <FormItem className="col-span-2 grid grid-cols-2 gap-[12px]">
                <FormControl>
                  <RadioGroup
                    className="col-span-2 grid grid-cols-2 gap-[12px]"
                    onValueChange={field.onChange}
                    defaultValue="true"
                  >
                    <FormItem className="col-span-1 flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItemSecondary label="دارد" value="false" />
                      </FormControl>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
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
              className="flex w-1/2 items-center justify-center gap-[18px] rounded-[20px] bg-[#EEEEEE] py-[14px]"
            >
              <Camera />
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
    </>
  )
}
