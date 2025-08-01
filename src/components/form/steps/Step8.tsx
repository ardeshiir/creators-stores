// components/form/steps/Step8.tsx
'use client'

import { useState } from 'react'

import { Camera, X } from 'lucide-react'
import Image from 'next/image'
import { useFieldArray, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import Input, { InputSecondary } from '@/components/ui/input'
import { RadioGroup, RadioGroupItemSecondary } from '@/components/ui/radio-group'
import { uploadFile } from '@/lib/services/upload'
import { cn } from '@/lib/utils'

export const schema8 = z.object({
  showCase: z
    .array(
      z.object({
        dimensions: z.object({
          width: z.number().optional(),
          height: z.number().optional(),
        }),
        sticker: z.boolean().optional(),
        attachments: z.string().optional().nullable(),
      }),
    )
    .optional(),
})

export type Step8Values = z.infer<typeof schema8>

export function Step8({ form }: { form: UseFormReturn<Step8Values> }) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'showCase',
  })

  const showCase = form.watch('showCase')
  const [hasShowCase, setHasShowCase] = useState<boolean>(false)

  const handleUpload = async (files: FileList, index: number) => {
    const selectedFile = files[0]

    console.log({ selectedFile })

    if (selectedFile) {
      const formData = new FormData()

      formData.append('file', selectedFile)

      try {
        const uploadResponse = await uploadFile(formData)

        if (uploadResponse?.data?.url) {
          form.setValue(`showCase.${index}.attachments`, uploadResponse?.data?.url)
        }
      } catch (e) {
        console.log({ uploadError: e })
      }
    }
  }

  return (
    <div className="mx-auto w-full max-w-[733px] md:min-h-[300px]">
      <FormLabel className="mb-4 text-lg font-bold text-black">ویترین نمایش محصول</FormLabel>
      <div className="col-span-2 grid grid-cols-2 gap-[12px]">
        <RadioGroup
          className="col-span-2 grid grid-cols-2 gap-[12px] md:flex md:justify-end"
          onValueChange={(value) => {
            if (value === 'true') {
              setHasShowCase(true)
            } else {
              setHasShowCase(false)
            }
          }}
        >
          <div className="order-1 col-span-1 flex items-center space-x-2 md:order-2 md:w-[152px]">
            <RadioGroupItemSecondary className="h-[67px] md:h-[56px]" label="دارد" value="true" />
          </div>
          <div className="order-2 flex items-center space-x-2 md:order-1 md:w-[258px]">
            <RadioGroupItemSecondary className="h-[67px] md:h-[56px]" label="ندارد" value="false" />
          </div>
        </RadioGroup>
      </div>
      {fields.map((field, index) => (
        <div key={field.id} className={cn('relative', index === 0 && 'mt-4')}>
          {hasShowCase && (
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

          {hasShowCase && (
            <FormLabel className="mt-4 text-lg font-bold text-black md:mt-[46px]">
              قابلیت نصب استیکر و مش
            </FormLabel>
          )}
          {hasShowCase && (
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
                        defaultValue={true}
                      >
                        <FormItem className="order-1 col-span-1 flex items-center space-x-2 md:order-2 md:w-[152px]">
                          <FormControl>
                            <RadioGroupItemSecondary label="دارد" value={false} />
                          </FormControl>
                        </FormItem>
                        <FormItem className="order-2 flex items-center space-x-2 md:order-1 md:w-[258px]">
                          <FormControl>
                            <RadioGroupItemSecondary label="ندارد" value={true} />
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
                  className={cn(
                    'flex w-full cursor-pointer items-center justify-center gap-[18px]   font-medium md:w-[163px] md:justify-between ',
                    showCase?.[index].attachments
                      ? ''
                      : 'md:px-4 py-[14px] rounded-[14px] bg-[#EEEEEE]',
                  )}
                >
                  {showCase?.[index].attachments ? (
                    <div className="relative aspect-video h-32 overflow-hidden rounded-[20px]">
                      <Image
                        fill={true}
                        src={showCase[index].attachments}
                        alt="banner-attachment"
                      />
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
                      <Camera fill="black" stroke="white" />
                      تصویر ضمیمه
                    </>
                  )}
                  <InputSecondary
                    id="display-attachment"
                    className="hidden"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => e.target.files && handleUpload(e.target.files, index)}
                  />
                </FormLabel>
              </FormItem>
            </div>
          )}
        </div>
      ))}
      <div className="col-span-2 flex justify-start">
        <Button
          type="button"
          variant="text"
          className="mt-2 px-0 text-brand-primary disabled:cursor-not-allowed disabled:text-brand-primary disabled:opacity-100"
          disabled={!hasShowCase}
          onClick={() =>
            append({
              dimensions: { width: 0, height: 0 },
              sticker: false,
              attachments: null,
            })
          }
        >
          + اضافه کردن ویترین نمایش محصول جدید
        </Button>
      </div>
    </div>
  )
}
