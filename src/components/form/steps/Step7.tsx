// components/form/steps/Step7.tsx
'use client'

import { useState } from 'react'

import { Camera } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { InputSecondary } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export const schema7 = z.object({
  displayStandType: z.enum(['reglam', 'ontable', 'none']),
  displayStand: z
    .object({
      brand: z.string().optional(),
      attachments: z.array(z.string()).optional(),
    })
    .optional(),
})

export type Step7Values = z.infer<typeof schema7>

export function Step7({ form }: { form: UseFormReturn<Step7Values> }) {
  const [previews, setPreviews] = useState<string[]>([])

  const handleUpload = (files: FileList) => {
    const urls = Array.from(files).map((file) => URL.createObjectURL(file))

    form.setValue(`displayStand.attachments`, urls)
    setPreviews((prev) => [...prev, ...urls])
  }

  return (
    <div className="mx-auto w-full max-w-[562px] md:min-h-[300px]">
      <FormLabel className="text-lg font-bold text-black">استند نمایش محصول</FormLabel>

      <div className={cn('grid-cols-2 grid gap-4', 'mt-4')}>
        {
          <FormField
            control={form.control}
            name="displayStandType"
            render={({ field }) => (
              <FormItem className="col-span-2 md:w-[358px]">
                {/*<FormLabel>Type</FormLabel>*/}
                <FormControl>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="h-[64px] w-full border border-[#E4E4E4] bg-[#F9F9F9]">
                        <SelectValue
                          placeholder="استند نمایش محصول"
                          className="h-[64px] text-lg placeholder:text-lg"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="w-full">
                      <SelectItem value="none">فاقد استند نمایش محصول</SelectItem>
                      <SelectItem value="reglam">رگلام</SelectItem>
                      <SelectItem value="ontable">رومیزی</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        }

        {['reglam', 'ontable'].includes(form.watch('displayStandType')) && (
          <FormField
            control={form.control}
            name="displayStand.brand"
            render={({ field }) => (
              <FormItem className="relative col-span-2 md:col-span-1 md:size-fit">
                {/*
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
*/}

                <FormControl>
                  <InputSecondary className="md:w-[260px]" placeholder="نام برند فعلی" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {['reglam', 'ontable'].includes(form.watch('displayStandType')) && (
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
                onChange={(e) => e.target.files && handleUpload(e.target.files)}
              />
            </FormLabel>

            <div className="mt-2 flex flex-wrap gap-2">
              {(previews ?? []).map((src, i) => (
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
    </div>
  )
}
