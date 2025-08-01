'use client'

import { Camera, X } from 'lucide-react'
import Image from 'next/image'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { InputSecondary } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { uploadFile } from '@/lib/services/upload'
import { cn } from '@/lib/utils'
import { useFormStore } from '@/stores/useFormStore'

export const schema9 = z.object({
  externalImages: z.array(z.string().optional().nullable()).optional(),
  internalImages: z.array(z.string().optional().nullable()).optional(),
  description: z.string().optional(),
})

export type Step9Values = z.infer<typeof schema9>

export function Step9({ form }: { form: UseFormReturn<Step9Values> }) {
  const { data } = useFormStore()

  console.log({ step1Data: data })

  const internalImages = form.watch('internalImages')

  const externalImages = form.watch('externalImages')

  const handleUpload = async (
    files: FileList,
    type: 'internalImages' | 'externalImages',
    index: number,
  ) => {
    const selectedFile = files[0]

    if (!selectedFile) return

    console.log({ selectedType: type })

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
    } catch (e) {
      console.log({ uploadError: e })
    }
  }

  console.log({
    externalImages,
    internalImages,
  })

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
  }: {
    type: 'externalImages' | 'internalImages'
    array: typeof externalImages
    label: string
  }) => (
    <div className="space-y-4">
      <FormLabel className="text-lg font-bold text-black">{label}</FormLabel>
      <div className="flex gap-2">
        {array?.map((image, index) => (
          <div key={index} className="relative space-y-4">
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
                    'flex w-full cursor-pointer items-center justify-center gap-[18px]   font-medium md:w-[163px] md:justify-between ',
                    image ? '' : 'md:px-4 py-[14px] rounded-[14px] bg-[#EEEEEE]',
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
                          <Camera fill="black" stroke="white" /> تعویض
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Camera fill="black" stroke="white" />
                      تصویر ضمیمه {index + 1}
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

      <Button
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
  )

  return (
    <div className="mx-auto w-full max-w-[733px] md:min-h-[300px]">
      <ImagesList type="externalImages" array={externalImages} label="تصاویر بیرونی فروشگاه" />
      <ImagesList type="internalImages" array={internalImages} label="تصاویر داخلی فروشگاه" />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
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
