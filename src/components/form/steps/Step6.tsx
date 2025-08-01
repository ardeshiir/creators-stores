// components/form/steps/Step6.tsx
'use client'

import { Camera, X } from 'lucide-react'
import Image from 'next/image'
import { useFieldArray, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

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
import { cn } from '@/lib/utils'

export const schema6 = z.object({
  stock: z.enum(['true', 'false']).optional(),
  mainStreet: z.enum(['true', 'false']).optional(),
  signBoard: z
    .array(
      z.object({
        type: z.enum(['banner', 'composite', 'other', 'none']),
        dimensions: z
          .object({
            width: z.number().optional(),
            height: z.number().optional(),
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

    console.log({ selectedFile })

    if (selectedFile) {
      const formData = new FormData()

      formData.append('file', selectedFile)
      console.log({ formData })

      try {
        const uploadResponse = await uploadFile(formData)

        console.log({ uploadResponse })

        if (uploadResponse?.data?.url) {
          form.setValue(`signBoard.${index}.attachments`, uploadResponse?.data?.url)
        }
      } catch (e) {
        console.log({ uploadError: e })
      }
    }
  }

  const signBoards = form.watch('signBoard')

  console.log({ signBoards })

  return (
    <div className="mx-auto flex w-full max-w-screen-lg items-center justify-center md:min-h-[300px]">
      <div className="w-full">
        <FormLabel className="text-lg font-bold text-black">موقعیت مکانی فروشگاه</FormLabel>
        <div className="mt-4 grid grid-cols-2 gap-4 md:flex md:flex-col">
          <div className="col-span-2 grid grid-cols-2 gap-4 md:flex ">
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem className="col-span-2 grid grid-cols-2 gap-4 md:col-span-1 md:flex">
                  <FormControl>
                    <RadioGroup
                      className="col-span-2 grid grid-cols-2 gap-4 md:flex"
                      onValueChange={field.onChange}
                    >
                      <FormItem className="col-span-1 flex items-center space-x-2 md:w-[182px]">
                        <FormControl>
                          <RadioGroupItemSecondary
                            className="h-[67px] md:h-[56px]"
                            label="غیر بورس"
                            value="false"
                          />
                        </FormControl>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 md:w-[258px]">
                        <FormControl>
                          <RadioGroupItemSecondary
                            className="h-[67px] md:h-[56px]"
                            label="بورس"
                            value="true"
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
                  {/*<FormLabel>On Main Street</FormLabel>*/}
                  <FormControl>
                    <RadioGroup
                      className="col-span-2 grid grid-cols-2 gap-4 md:flex"
                      onValueChange={field.onChange}
                    >
                      <FormItem className="flex items-center space-x-2 md:w-[182px]">
                        <FormControl>
                          <RadioGroupItemSecondary
                            className="h-[67px] md:h-[56px]"
                            label="خیابان فرعی"
                            value="false"
                          />
                        </FormControl>
                        {/*<FormLabel>No</FormLabel>*/}
                      </FormItem>
                      <FormItem className="relative flex items-center space-x-2 md:w-[258px]">
                        <span className="absolute inset-y-0 right-[-8px] hidden w-px bg-border opacity-50 md:flex" />
                        <FormControl>
                          <RadioGroupItemSecondary
                            className="h-[67px] md:h-[56px]"
                            label="خیابان اصلی"
                            value="true"
                          />
                        </FormControl>
                        {/*<FormLabel>Yes</FormLabel>*/}
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
              className="relative col-span-2 grid grid-cols-2 p-0 md:flex md:flex-col md:items-start md:gap-4"
            >
              {fields.length > 1 && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="absolute right-[-14px] top-1/2 translate-y-[-30%]"
                  onClick={() => remove(index)}
                >
                  <X size={16} />
                </Button>
              )}
              <FormLabel className="text-lg font-bold text-black">تابلو سردرب</FormLabel>
              <FormField
                control={form.control}
                name={`signBoard.${index}.type`}
                render={({ field }) => (
                  <FormItem className="col-span-2 md:w-[358px]">
                    {/*<FormLabel>Type</FormLabel>*/}
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="h-[64px] w-full border border-[#E4E4E4] bg-[#F9F9F9]">
                            <SelectValue
                              placeholder="نوع تابلو سردرب"
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
                <div className="col-span-2 flex gap-4">
                  <FormField
                    control={form.control}
                    name={`signBoard.${index}.dimensions.height`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        {/*<FormLabel>Width</FormLabel>*/}
                        <FormControl>
                          <Input
                            startIcon={<span className="text-lg text-[#babcbe]">متر</span>}
                            placeholder="ارتفاع"
                            type="number"
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
                    name={`signBoard.${index}.dimensions.width`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        {/*<FormLabel>Height</FormLabel>*/}
                        <FormControl>
                          <Input
                            startIcon={<span className="text-lg text-[#babcbe]">متر</span>}
                            placeholder="عرض"
                            type="number"
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
              {form.watch('signBoard')?.[0]?.type !== 'none' && (
                <FormItem className="col-span-1">
                  <FormLabel
                    htmlFor="signboard-attachment"
                    className={cn(
                      'flex w-full cursor-pointer items-center justify-center gap-[18px]   font-medium md:w-[163px] md:justify-between ',
                      signBoards?.[index] &&
                        signBoards?.[index].attachments &&
                        typeof signBoards?.[index].attachments === 'string'
                        ? ''
                        : 'md:px-4 py-[14px] rounded-[14px] bg-[#EEEEEE]',
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
            </div>
          ))}
          <div className="col-span-2 flex justify-center md:justify-start">
            <Button
              type="button"
              variant="text"
              className="mt-2 px-0 text-brand-primary disabled:cursor-not-allowed disabled:text-brand-primary disabled:opacity-100"
              disabled={form.watch('signBoard')?.[0]?.type === 'none'}
              onClick={() =>
                append({
                  type: 'banner',
                  dimensions: { width: 0, height: 0 },
                  attachments: undefined,
                })
              }
            >
              + اضافه کردن تابلو سردرب جدید
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
