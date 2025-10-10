// components/form/steps/Step6.tsx
'use client'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { uploadFile } from '@/lib/services/upload'
import { cn, normalizeNumericInput } from '@/lib/utils'

import { signboardDictionary } from './FormFinalPreview'

export const schema6 = z.object({
  stock: z.enum(['true', 'false']).optional(),
  mainStreet: z.enum(['true', 'false']).optional(),
  signBoard: z
    .array(
      z.object({
        type: z.enum(['banner', 'composite', 'other', 'none']),
        dimensions: z
          .object({
            width: z.number().optional().nullable(),
            height: z.number().optional().nullable(),
          })
          .optional(),
        attachments: z.string().optional().nullable(),
      }),
    )
    .optional(),
})

export type Step6Values = z.infer<typeof schema6>

export function Step6({ form }: { form: UseFormReturn<Step6Values> }) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'signBoard',
  })

  const handleUpload = async (files: FileList, index: number) => {
    const selectedFile = files[0]

    if (selectedFile) {
      const formData = new FormData()

      formData.append('file', selectedFile)

      try {
        const uploadResponse = await uploadFile(formData)

        if (uploadResponse?.data?.url) {
          form.setValue(`signBoard.${index}.attachments`, uploadResponse?.data?.url)
        }
      } catch (e: any) {
        toast.success(e?.response?.data.message || 'خطایی رخ داده است لطفا مجددا تلاش کنید')
        console.log({ uploadError: e })
      }
    }
  }

  const signBoards = form.watch('signBoard')

  console.log({ signBoards, stock: form.watch('stock'), mainStreet: form.watch('mainStreet') })

  return (
    <div className="flex items-center justify-center overflow-x-hidden pb-[220px] md:pb-0">
      <div className="w-full">
        <FormLabel className="text-lg font-bold text-black">موقعیت مکانی فروشگاه</FormLabel>
        <div className="mt-4 grid grid-cols-2 gap-6 overflow-x-hidden md:flex md:flex-col">
          <div className="col-span-2 grid grid-cols-2 gap-4 overflow-x-hidden md:flex md:flex-wrap">
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem className="col-span-2 grid grid-cols-2 gap-4 md:col-span-1 md:flex md:flex-wrap">
                  <FormControl>
                    <RadioGroup
                      className="col-span-2 grid grid-cols-2 gap-4"
                      onValueChange={field.onChange}
                      defaultValue={form.watch('stock')}
                    >
                      <FormItem className="col-span-1 flex items-center md:w-[258px]">
                        <FormControl>
                          <RadioGroupItemSecondary
                            className="h-[67px] md:h-[56px]"
                            label="غیر بورس"
                            value="false"
                            checked={form.watch('stock') === 'false'}
                          />
                        </FormControl>
                      </FormItem>
                      <FormItem className="flex items-center md:w-[258px]">
                        <FormControl>
                          <RadioGroupItemSecondary
                            className="h-[67px] md:h-[56px]"
                            label="بورس"
                            value="true"
                            checked={form.watch('stock') === 'true'}
                          />
                        </FormControl>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mainStreet"
              render={({ field }) => (
                <FormItem className="col-span-2 grid grid-cols-2 gap-4 md:col-span-1 md:flex">
                  <FormLabel className="hidden">On Main Street</FormLabel>
                  <FormControl>
                    <RadioGroup
                      className="col-span-2 grid grid-cols-2 gap-4 md:flex"
                      onValueChange={field.onChange}
                      defaultValue={form.watch('mainStreet')}
                    >
                      <FormItem className="flex items-center md:w-[258px]">
                        <FormControl>
                          <RadioGroupItemSecondary
                            className="h-[67px] md:h-[56px]"
                            label="خیابان فرعی"
                            value="false"
                            checked={form.watch('mainStreet') === 'false'}
                          />
                        </FormControl>
                        <FormLabel className="hidden">No</FormLabel>
                      </FormItem>
                      <FormItem className="relative flex items-center md:w-[258px]">
                        <span className="absolute inset-y-0 right-[-8px] hidden w-px bg-border opacity-50 md:flex" />
                        <FormControl>
                          <RadioGroupItemSecondary
                            className="h-[67px] md:h-[56px]"
                            label="خیابان اصلی"
                            value="true"
                            checked={form.watch('mainStreet') === 'true'}
                          />
                        </FormControl>
                        <FormLabel className="hidden">Yes</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/*<FormLabel className="block mt-6">Sign Boards</FormLabel>*/}
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="relative col-span-2 grid grid-cols-2 gap-4 p-0 md:flex md:flex-col md:items-start"
            >
              {index === 0 && (
                <FormLabel className="col-span-2 text-lg font-bold text-black">
                  تابلو سردرب
                </FormLabel>
              )}
              <div className="relative col-span-2 flex flex-wrap items-center justify-center gap-4">
                <FormField
                  control={form.control}
                  name={`signBoard.${index}.type`}
                  render={({ field }) => (
                    <FormItem className="col-span-2 w-full md:w-[258px]">
                      <FormLabel className="hidden">Type</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="h-[64px] w-full border border-[#E4E4E4] bg-[#F9F9F9] md:w-[258px]">
                              <SelectValue
                                placeholder={
                                  signboardDictionary[form.watch(`signBoard.${index}.type`)] ||
                                  'نوع تابلو سردرب'
                                }
                                className="h-[64px] text-lg placeholder:text-lg"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="w-full">
                            <SelectItem value="none">فاقد تابلو سردرب</SelectItem>
                            <SelectItem value="banner">بنر</SelectItem>
                            <SelectItem value="composite">کامپوزیت</SelectItem>
                            <SelectItem value="other">سایر</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch('signBoard')?.[0]?.type !== 'none' && (
                  <div className="col-span-2 flex w-full gap-4 md:w-auto">
                    <FormField
                      control={form.control}
                      name={`signBoard.${index}.dimensions.height`}
                      render={({ field }) => (
                        <FormItem className="flex-1 lg:w-[258px]">
                          <FormLabel className="hidden">Width</FormLabel>
                          <FormControl>
                            <Input
                              startIcon={<span className="text-lg text-[#babcbe]">متر</span>}
                              placeholder="ارتفاع"
                              inputMode="decimal"
                              {...field}
                              onChange={(e) => {
                                const normalized = normalizeNumericInput(e.target.value)

                                if (normalized === '') {
                                  field.onChange(null)

                                  return
                                }

                                field.onChange(Number(normalized))
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`signBoard.${index}.dimensions.width`}
                      render={({ field }) => (
                        <FormItem className="flex-1 lg:w-[258px]">
                          <FormLabel className="hidden">Height</FormLabel>
                          <FormControl>
                            <Input
                              startIcon={<span className="text-lg text-[#babcbe]">متر</span>}
                              placeholder="عرض"
                              inputMode="decimal"
                              {...field}
                              onChange={(e) => {
                                const normalized = normalizeNumericInput(e.target.value)

                                if (normalized === '') {
                                  field.onChange(null)

                                  return
                                }

                                if (normalized.endsWith('.')) {
                                  field.onChange(normalized)
                                } else {
                                  const num = Number(normalized)

                                  field.onChange(isNaN(num) ? normalized : num)
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                {form.watch('signBoard')?.[0]?.type !== 'none' && (
                  <FormItem className="flex flex-1 justify-start md:flex-auto">
                    <FormLabel
                      htmlFor="signboard-attachment"
                      className={cn(
                        'flex w-fit cursor-pointer px-[19px] items-center justify-center gap-[18px]   font-medium md:w-[163px] md:justify-between ',
                        signBoards?.[index] &&
                          signBoards?.[index].attachments &&
                          typeof signBoards?.[index].attachments === 'string'
                          ? ''
                          : 'md:px-4 py-[14px] w-full h-[51px] md:h-[56px] rounded-[16px] bg-[#EEEEEE]',
                      )}
                    >
                      {signBoards?.[index] &&
                      signBoards?.[index].attachments &&
                      typeof signBoards?.[index].attachments === 'string' ? (
                        <div className="relative aspect-video h-32 overflow-hidden rounded-[20px]">
                          <Image
                            fill={true}
                            src={signBoards?.[index].attachments}
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
                          <CameraIcon /> تصویر ضمیمه
                        </>
                      )}
                      <InputSecondary
                        id="signboard-attachment"
                        className="hidden"
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          if (e.target.files) handleUpload(e.target.files, index)
                        }}
                      />
                    </FormLabel>
                  </FormItem>
                )}
                {fields.length > 1 && (
                  <div className="flex flex-1 md:flex-auto">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="justify-start !px-0"
                      onClick={() => remove(index)}
                    >
                      <X size={16} color="#0038DB" />
                    </Button>
                  </div>
                )}
              </div>
              {index === fields.length - 1 && form.watch('signBoard')?.[0].type !== 'none' && (
                <div className="col-span-2 flex justify-start">
                  <Button
                    type="button"
                    variant="text"
                    className="px-0 text-brand-primary disabled:cursor-not-allowed disabled:text-brand-primary disabled:opacity-100"
                    disabled={form.watch('signBoard')?.[0]?.type === 'none'}
                    onClick={() =>
                      append({
                        type: 'banner',
                        dimensions: { width: null, height: null },
                        attachments: undefined,
                      })
                    }
                  >
                    + اضافه کردن تابلو سردرب جدید
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
