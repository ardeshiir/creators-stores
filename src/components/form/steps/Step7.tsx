// components/form/steps/Step7.tsx
'use client'

import { Camera } from 'lucide-react'
import Image from 'next/image'
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
import { uploadFile } from '@/lib/services/upload'
import { cn } from '@/lib/utils'

export const schema7 = z.object({
  displayStand: z
    .object({
      type: z.enum(['reglam', 'ontable', 'none']),
      brand: z.string().optional(),
      attachments: z.string().nullable(),
    })
    .optional(),
})

export type Step7Values = z.infer<typeof schema7>

export function Step7({ form }: { form: UseFormReturn<Step7Values> }) {
  const handleUpload = async (files: FileList) => {
    const selectedFile = files[0]

    console.log({ selectedFile })

    if (selectedFile) {
      const formData = new FormData()

      formData.append('file', selectedFile)

      try {
        const uploadResponse = await uploadFile(formData)

        if (uploadResponse?.data?.url) {
          form.setValue(`displayStand.attachments`, uploadResponse?.data?.url)
        }
      } catch (e) {
        console.log({ uploadError: e })
      }
    }
  }
  const displayStand = form.watch('displayStand')

  return (
    <div className="mx-auto w-full max-w-[562px] md:min-h-[300px]">
      <FormLabel className="text-lg font-bold text-black">استند نمایش محصول</FormLabel>

      <div className={cn('grid-cols-2 grid gap-4', 'mt-4')}>
        {
          <FormField
            control={form.control}
            name="displayStand.type"
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

        {['reglam', 'ontable'].includes(displayStand.type) && (
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

        {['reglam', 'ontable'].includes(displayStand.type) && (
          <FormItem className='md:w-fit"'>
            <FormLabel
              htmlFor="displayStand-attachment"
              className={cn(
                'flex w-full cursor-pointer items-center justify-center gap-[18px]   font-medium md:w-[163px] md:justify-between ',
                displayStand?.attachments ? '' : 'md:px-4 py-[14px] rounded-[14px] bg-[#EEEEEE]',
              )}
            >
              {displayStand?.attachments ? (
                <div className="relative aspect-video h-32 overflow-hidden rounded-[20px]">
                  <Image fill={true} src={displayStand?.attachments} alt="banner-attachment" />
                  <div className="absolute flex size-full items-center justify-center bg-white/10">
                    <div
                      className="flex items-center justify-center gap-2 p-4"
                      style={{ background: 'rgba(238,238,238,0.6)', borderRadius: 16 }}
                    >
                      <Camera fill="black" stroke="white" /> تعویض
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <Camera fill="black" stroke="white" /> تصویر ضمیمه
                </>
              )}

              <InputSecondary
                id="displayStand-attachment"
                className="hidden"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => e.target.files && handleUpload(e.target.files)}
              />
            </FormLabel>
          </FormItem>
        )}
      </div>
    </div>
  )
}
