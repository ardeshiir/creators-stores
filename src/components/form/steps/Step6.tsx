// components/form/steps/Step6.tsx
'use client'

import { useState } from 'react'

import { Camera, X } from 'lucide-react'
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

export const schema6 = z.object({
  enviornment: z.array(
    z.object({
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
            attachments: z.array(z.string()).optional(),
          }),
        )
        .optional(),
      attachments: z.array(z.string()).optional(),
    }),
  ),
})

export type Step6Values = z.infer<typeof schema6>

export function Step6({ form }: { form: UseFormReturn<Step6Values> }) {
  const [preview, setPreview] = useState<string[]>([])
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'enviornment.0.signBoard',
  })

  const uploadEnvAttachments = (files: FileList) => {
    const urls = Array.from(files).map((file) => URL.createObjectURL(file))

    form.setValue('enviornment.0.attachments', urls)
    setPreview(urls)
  }

  return (
    <div className="flex w-full items-center justify-center md:min-h-[300px]">
      <div className="w-full">
        <FormLabel className="text-lg font-bold text-black">شرایط محیطی فروشگاه</FormLabel>
        <div className="mt-4 grid grid-cols-2 gap-4 md:flex md:flex-col">
          <div className="col-span-2 grid grid-cols-2 gap-4 md:flex ">
            <FormField
              control={form.control}
              name="enviornment.0.stock"
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
              name="enviornment.0.mainStreet"
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
              className="relative col-span-2 mb-4 grid grid-cols-2 space-y-[12px] p-0 md:flex md:items-center md:gap-4"
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

              <FormField
                control={form.control}
                name={`enviornment.0.signBoard.${index}.type`}
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

              {form.watch('enviornment')[0].signBoard[0].type !== 'none' && (
                <div className="col-span-2 flex gap-4">
                  <FormField
                    control={form.control}
                    name={`enviornment.0.signBoard.${index}.dimensions.height`}
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
                    name={`enviornment.0.signBoard.${index}.dimensions.width`}
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

              {form.watch('enviornment')[0].signBoard[0].type !== 'none' && (
                <FormItem className="col-span-1">
                  <FormLabel
                    htmlFor="signboard-attachment"
                    className="flex w-full cursor-pointer items-center justify-center gap-[18px] rounded-[14px] bg-[#EEEEEE] py-[14px] font-medium md:w-[163px] md:justify-between md:px-4"
                  >
                    <Camera fill="black" stroke="white" /> تصویر ضمیمه
                    <InputSecondary
                      id="signboard-attachment"
                      className="hidden"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const urls = Array.from(e.target.files ?? []).map((f) =>
                          URL.createObjectURL(f),
                        )

                        form.setValue(`enviornment.0.signBoard.${index}.attachments`, urls)
                      }}
                    />
                  </FormLabel>
                </FormItem>
              )}
            </div>
          ))}
          <div className="col-span-2 flex justify-center">
            <Button
              type="button"
              variant="text"
              className="mx-auto"
              disabled={form.watch('enviornment')[0].signBoard[0].type === 'none'}
              onClick={() =>
                append({
                  type: 'banner',
                  dimensions: { width: 0, height: 0 },
                  attachments: [],
                })
              }
            >
              + اضافه کردن تابلو سردرب جدید
            </Button>
          </div>

          {/*<FormItem className="mt-6">
                    <FormLabel>Environment Attachments</FormLabel>
                    <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => e.target.files && uploadEnvAttachments(e.target.files)}
                    />
                    <div className="flex gap-2 mt-2 flex-wrap">
                        {preview.map((src, i) => (
                            <img key={i} src={src} alt="env-preview" className="w-16 h-16 rounded object-cover"/>
                        ))}
                    </div>
                </FormItem>*/}
        </div>
      </div>
    </div>
  )
}
