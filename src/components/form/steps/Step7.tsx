// components/form/steps/Step7.tsx
'use client'

import { useState } from 'react'

import { Camera, X } from 'lucide-react'
import { useFieldArray, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import Input, { InputSecondary } from '@/components/ui/input'
import { RadioGroup, RadioGroupItemSecondary } from '@/components/ui/radio-group'

export const schema7 = z.object({
  'has-stand': z.string(),
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
    <>
      <FormLabel className="text-lg font-bold text-black">استند نمایش محصول</FormLabel>

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
            name="has-stand"
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

          {form.watch('has-stand') === 'true' && (
            <FormField
              control={form.control}
              name={`displayStand.${index}.brand`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="نام برند فعلی" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {form.watch('has-stand') === 'true' && (
            <FormItem>
              <FormLabel
                htmlFor="signboard-attachment"
                className="flex w-1/2 items-center justify-center gap-[18px] rounded-[20px] bg-[#EEEEEE] py-[14px]"
              >
                <Camera />
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
          disabled={form.watch('has-stand') === 'false'}
          className="mx-auto"
          onClick={() => append({ brand: '', attachments: [] })}
        >
          + اضافه کردن استند نمایش جدید
        </Button>
      </div>
    </>
  )
}
