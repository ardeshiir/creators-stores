// components/form/steps/Step7.tsx
'use client'

import Image from 'next/image'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import CameraIcon from '@/components/icons/CameraIcon'
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
      } catch (e: any) {
        toast.success(e?.response?.data.message || 'خطایی رخ داده است لطفا مجددا تلاش کنید')
        console.log({ uploadError: e })
      }
    }
  }
  const displayStand = form.watch('displayStand')

  return (
    <div className="mx-auto w-full">
      <FormLabel className="text-lg font-bold text-black">استند نمایش محصول</FormLabel>

      <div className={cn('flex flex-col gap-4', 'mt-4')}>
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
        <div className="flex items-center gap-4">
          {['reglam', 'ontable', 'none'].includes(displayStand.type) && (
            <FormField
              control={form.control}
              name="displayStand.brand"
              render={({ field }) => (
                <FormItem className="relative col-span-2 md:col-span-1 md:size-fit">
                  <FormControl>
                    <InputSecondary
                      disabled={displayStand.type === 'none'}
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

          {['reglam', 'ontable', 'none'].includes(displayStand.type) && (
            <FormItem className='md:w-fit"'>
              <FormLabel
                htmlFor="displayStand-attachment"
                className={cn(
                  'flex w-full cursor-pointer items-center justify-center gap-[18px] h-[56px] font-medium md:w-[163px] md:justify-between ',
                  displayStand?.attachments ? '' : 'md:px-4 py-[14px] rounded-[16px] bg-[#EEEEEE]',
                  displayStand.type === 'none' && 'bg-[#F5F5F5] text-[#b6b6b6b6]',
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
                        <CameraIcon /> تعویض
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <CameraIcon color={displayStand.type === 'none' && '#B6B6B6'} /> تصویر ضمیمه
                  </>
                )}

                <InputSecondary
                  id="displayStand-attachment"
                  disabled={displayStand.type === 'none'}
                  className="hidden"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => e.target.files && handleUpload(e.target.files)}
                />
              </FormLabel>
            </FormItem>
          )}
        </div>{' '}
      </div>
    </div>
  )
}
