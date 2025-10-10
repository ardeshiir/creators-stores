// components/form/steps/Step8.tsx
'use client'

import { useState } from 'react'

import { X } from 'lucide-react'
import Image from 'next/image'
import { useFieldArray, UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import CameraIcon from '@/components/icons/CameraIcon'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import Input, { InputSecondary } from '@/components/ui/input'
import { RadioGroup, RadioGroupItemSecondary } from '@/components/ui/radio-group'
import { uploadFile } from '@/lib/services/upload'
import { cn, normalizeNumericInput } from '@/lib/utils'

export const schema8 = z.object({
  showCase: z
    .array(
      z.object({
        dimensions: z.object({
          width: z.number(),
          height: z.number(),
        }),
        sticker: z.string(),
        attachments: z.string().nullable(),
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
  const [hasShowCase, setHasShowCase] = useState<string>('true')
  const handleUpload = async (files: FileList, index: number) => {
    const selectedFile = files[0]

    if (selectedFile) {
      const formData = new FormData()

      formData.append('file', selectedFile)

      try {
        const uploadResponse = await uploadFile(formData)

        if (uploadResponse?.data?.url) {
          form.setValue(`showCase.${index}.attachments`, uploadResponse?.data?.url)
        }
      } catch (e: any) {
        toast.success(e?.response?.data.message || 'خطایی رخ داده است لطفا مجددا تلاش کنید')
        console.log({ uploadError: e })
      }
    }
  }

  return (
    <div className="mx-auto w-full pb-[300px] md:pb-0">
      <FormLabel className="mb-4 text-lg font-bold text-black">ویترین نمایش محصول</FormLabel>
      <div className="col-span-2 grid grid-cols-2 gap-[12px]">
        <RadioGroup
          className="col-span-2 grid grid-cols-2 gap-[12px] md:flex md:justify-end"
          defaultValue={hasShowCase}
          onValueChange={(value) => {
            if (value === 'true') {
              setHasShowCase('true')
              append({
                dimensions: { width: null, height: null },
                sticker: null,
                attachments: null,
              })
            } else {
              setHasShowCase('false')
              remove()
            }
          }}
        >
          <div className="flex items-center space-x-2 md:w-[258px]">
            <RadioGroupItemSecondary className="h-[67px] md:h-[56px]" label="ندارد" value="false" />
          </div>
          <div className="col-span-1 flex items-center space-x-2 md:w-[258px]">
            <RadioGroupItemSecondary className="h-[67px] md:h-[56px]" label="دارد" value="true" />
          </div>
        </RadioGroup>
      </div>
      {fields.map((field, index) => (
        <div key={field.id} className={cn('relative', index === 0 && 'mt-4')}>
          {hasShowCase && (
            <div className="mt-4 flex gap-3">
              <FormField
                control={form.control}
                name={`showCase.${index}.dimensions.width`}
                render={({ field }) => {
                  const { onChange, value, ...rest } = field

                  return (
                    <FormItem className="flex-1 md:max-w-[258px]">
                      {/*<FormLabel>Width</FormLabel>*/}
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute bottom-0 right-[calc(50%-12px)] -translate-y-1/4 md:left-[-32px] md:right-auto md:top-full md:-translate-y-[118%]"
                          onClick={() => remove(index)}
                        >
                          <X size={16} color="#0038DB" />
                        </Button>
                      )}

                      <FormControl>
                        <Input
                          {...rest}
                          value={value ?? ''} // ensure controlled input
                          startIcon={<span className="text-lg text-[#babcbe]">متر</span>}
                          placeholder="عرض"
                          disabled={hasShowCase === 'false'}
                          inputMode="decimal"
                          onChange={(e) => {
                            const normalized = normalizeNumericInput(e.target.value)

                            if (normalized === '') {
                              onChange(null)

                              return
                            }

                            if (normalized.endsWith('.')) {
                              onChange(normalized)
                            } else {
                              const num = Number(normalized)

                              onChange(isNaN(num) ? normalized : num)
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <FormField
                control={form.control}
                name={`showCase.${index}.dimensions.height`}
                render={({ field }) => {
                  const { onChange, value, ...rest } = field

                  return (
                    <FormItem className="flex-1 md:max-w-[258px]">
                      {/*<FormLabel>Width</FormLabel>*/}
                      <FormControl>
                        <Input
                          {...rest}
                          startIcon={<span className="text-lg text-[#babcbe]">متر</span>}
                          placeholder="ارتفاع"
                          disabled={hasShowCase === 'false'}
                          inputMode="decimal"
                          value={value ?? ''}
                          onChange={(e) => {
                            const normalized = normalizeNumericInput(e.target.value)

                            if (normalized === '') {
                              onChange(null)

                              return
                            }

                            if (normalized.endsWith('.')) {
                              onChange(normalized)
                            } else {
                              const num = Number(normalized)

                              field.onChange(isNaN(num) ? normalized : num)
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
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
                      >
                        <FormItem className="flex h-[56px] items-center md:w-[258px]">
                          <FormControl>
                            <RadioGroupItemSecondary
                              className="h-full"
                              label="ندارد"
                              value="true"
                            />
                          </FormControl>
                        </FormItem>
                        <FormItem className="flex h-[56px] items-center md:w-[258px]">
                          <FormControl>
                            <RadioGroupItemSecondary
                              className="h-full"
                              label="دارد"
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

              <FormItem>
                <FormLabel
                  htmlFor="display-attachment"
                  className={cn(
                    'flex w-[calc(50%-6px)] cursor-pointer items-center justify-center gap-[18px] font-medium md:w-[163px] md:justify-between ',
                    showCase?.[index].attachments
                      ? ''
                      : 'md:px-4 py-[14px] h-[51px] md:h-[56px] rounded-[16px] bg-[#EEEEEE]',
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
                          <CameraIcon /> تعویض
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <CameraIcon />
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
              sticker: null,
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
