'use client'

import { X } from 'lucide-react'
import Image from 'next/image'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import CameraIcon from '@/components/icons/CameraIcon'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { InputSecondary } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { uploadFile } from '@/lib/services/upload'
import { cn, numberToPersian } from '@/lib/utils'
import { useFormStore } from '@/stores/useFormStore'

export const schema9 = z.object({
  externalImages: z.array(z.string().optional().nullable()).optional(),
  internalImages: z.array(z.string().optional().nullable()).optional(),
  description: z.string().optional(),
})

export type Step9Values = z.infer<typeof schema9>

export function Step9({ form }: { form: UseFormReturn<Step9Values> }) {
  const { data } = useFormStore()

  const internalImages = form.watch('internalImages')

  const externalImages = form.watch('externalImages')

  const handleUpload = async (
    files: FileList,
    type: 'internalImages' | 'externalImages',
    index: number,
  ) => {
    const selectedFile = files[0]

    if (!selectedFile) return

    const formData = new FormData()

    formData.append('file', selectedFile)

    try {
      const uploadResponse = await uploadFile(formData)

      if (uploadResponse?.data?.url) {
        // Get the current array (fallback to [null, null] if empty)
        const currentArray = (form.getValues(type) || [null, null]) as (string | null)[]

        // Clone the array to avoid mutating directly
        const updatedArray = [...currentArray]

        // ✅ Replace the item at the specific index with the new URL
        updatedArray[index] = uploadResponse.data.url

        // ✅ If all slots are filled, append a new empty slot (optional, for continuous adding)
        if (!updatedArray.includes(null) && updatedArray.length < 5) {
          updatedArray.push(null) // <-- allows adding more images dynamically
        }

        // ✅ Update the form value
        form.setValue(type, updatedArray, {
          shouldDirty: true,
          shouldValidate: true,
        })
      }
    } catch (e: any) {
      toast.success(e?.response?.data.message || 'خطایی رخ داده است لطفا مجددا تلاش کنید')
      console.log({ uploadError: e })
    }
  }

  function removeItem(type: 'externalImages' | 'internalImages', arr: string[], index: number) {
    const _arr = [...arr]

    if (index > -1) {
      _arr.splice(index, 1)
    }

    form.setValue(type, _arr)
  }

  const ImagesList = ({
    type,
    array,
    label,
    className,
  }: {
    type: 'externalImages' | 'internalImages'
    array: typeof externalImages
    label: string
    className?: string
  }) => (
    <div className={cn('space-y-2', className)}>
      <FormLabel className="text-lg font-bold text-black">{label}</FormLabel>
      <div className="flex flex-wrap gap-[11px]">
        {array?.map((image, index) => (
          <div key={index} className="relative flex-1 md:flex-initial">
            {array[index]?.length > 1 && (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute right-[8px] top-[8px] "
                onClick={() => removeItem(type, array || [], index)}
              >
                <span className="z-10 flex items-center justify-center rounded-full bg-slate-100 p-2">
                  <X size={16} />
                </span>
              </Button>
            )}

            <div className="flex items-center gap-4">
              <div key={image} className="flex-1 space-y-2 md:w-[170px] md:min-w-[170px] md:grow-0">
                <FormLabel
                  htmlFor={`${type}-${index}`}
                  className={cn(
                    'flex w-full cursor-pointer items-center justify-center gap-[18px] font-medium md:w-[163px] md:justify-between ',
                    image
                      ? ''
                      : 'md:px-4 py-[14px] h-[51px] md:h-[56px] rounded-[20px] bg-[#EEEEEE]',
                  )}
                >
                  {image ? (
                    <div className="relative aspect-video h-32 overflow-hidden rounded-[20px]">
                      <Image fill={true} src={image} alt="banner-attachment" />
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
                    <div className="flex items-center gap-[15px] text-nowrap px-3">
                      <CameraIcon />
                      تصویر ضمیمه {numberToPersian(index + 1)}
                    </div>
                  )}
                  <InputSecondary
                    id={`${type}-${index}`}
                    className="hidden"
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      if (e.target.files) {
                        await handleUpload(e.target.files, type, index)
                      }
                    }}
                  />
                </FormLabel>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex w-full items-center justify-end md:justify-start">
        <Button
          className="text-brand-primary"
          type="button"
          variant="text"
          onClick={() =>
            form.setValue(type, [
              ...(type === 'externalImages' ? externalImages || [] : internalImages || []),
              null,
            ])
          }
        >
          + تصویر بیشتر{' '}
        </Button>
      </div>
    </div>
  )

  return (
    <div className="mx-auto w-full pb-[220px] md:pb-0">
      <ImagesList type="externalImages" array={externalImages} label="تصاویر بیرونی فروشگاه" />
      <ImagesList
        type="internalImages"
        array={internalImages}
        label="تصاویر داخلی فروشگاه"
        className="mt-4"
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem className="mt-5">
            {/*<FormLabel>توضیحات</FormLabel>*/}
            <FormControl>
              <Textarea placeholder="توضیحات تکمیلی" rows={4} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
