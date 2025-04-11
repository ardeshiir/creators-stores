// components/form/steps/Step8.tsx
'use client'

import {useFieldArray, UseFormReturn} from 'react-hook-form'
import {z} from 'zod'
import {useState} from 'react'

import {FormControl, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form'

import Input, {InputSecondary} from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import {Camera, X} from 'lucide-react'
import {RadioGroup, RadioGroupItemSecondary} from "@/components/ui/radio-group";

export const schema8 = z.object({
    showCase: z.array(
        z.object({
            dimensions: z.object({
                width: z.number().min(1),
                height: z.number().min(1),
            }),
            sticker: z.string(),
            attachments: z.array(z.string()).optional(),
        })
    ),
})

export type Step8Values = z.infer<typeof schema8>

export function Step8({form}: { form: UseFormReturn<Step8Values> }) {
    const [previews, setPreviews] = useState<Record<number, string[]>>({})


    const {fields, append, remove} = useFieldArray({
        control: form.control,
        name: 'showCase',
    })

    const handleUpload = (files: FileList, index: number) => {
        const urls = Array.from(files).map((file) => URL.createObjectURL(file))
        form.setValue(`showCase.${index}.attachments`, urls)
        setPreviews((prev) => ({...prev, [index]: urls}))
    }


    return (
        <>
            <FormLabel className="text-lg font-bold text-black">ویترین نمایش محصول</FormLabel>

            {fields.map((field, index) => (
                <div key={field.id} className="space-y-4 relative">
                    {fields.length > 1 && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => remove(index)}
                        >
                            <X size={16}/>
                        </Button>
                    )}
                    <FormField
                        control={form.control}
                        name="has-display"
                        render={({field}) => (
                            <FormItem className={'col-span-2 grid grid-cols-2 gap-[12px]'}>
                                <FormControl>
                                    <RadioGroup className={'col-span-2 grid grid-cols-2 gap-[12px]'}
                                                onValueChange={field.onChange} defaultValue={"true"}>
                                        <FormItem className="flex col-span-1 items-center space-x-2">
                                            <FormControl><RadioGroupItemSecondary label={'دارد'}
                                                                                  value="false"/></FormControl>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-2">
                                            <FormControl><RadioGroupItemSecondary label={'ندارد'}
                                                                                  value="true"/></FormControl>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <div className="flex gap-4">
                        <FormField
                            control={form.control}
                            name={`showCase.${index}.dimensions.width`}
                            render={({field}) => (
                                <FormItem className="flex-1">
                                    {/*<FormLabel>Width</FormLabel>*/}
                                    <FormControl>
                                        <Input
                                            startIcon={<span className={'text-lg text-[#babcbe]'}>متر</span>}
                                            placeholder={'عرض'}  {...field}
                                            onChange={(e) => field.onChange(+e.target.value)}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`showCase.${index}.dimensions.height`}
                            render={({field}) => (
                                <FormItem className="flex-1">
                                    {/*<FormLabel>Width</FormLabel>*/}
                                    <FormControl>
                                        <Input
                                            startIcon={<span className={'text-lg text-[#babcbe]'}>متر</span>}
                                            placeholder={'ارتفاع'}  {...field}
                                            onChange={(e) => field.onChange(+e.target.value)}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormLabel className="text-lg font-bold text-black">قابلیت نصب استیکر و مش</FormLabel>
                    <FormField
                        control={form.control}
                        name={`showCase.${index}.sticker`}
                        render={({field}) => (
                            <FormItem className={'col-span-2 grid grid-cols-2 gap-[12px]'}>
                                <FormControl>
                                    <RadioGroup className={'col-span-2 grid grid-cols-2 gap-[12px]'}
                                                onValueChange={field.onChange} defaultValue={"true"}>
                                        <FormItem className="flex col-span-1 items-center space-x-2">
                                            <FormControl><RadioGroupItemSecondary label={'دارد'}
                                                                                  value="false"/></FormControl>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-2">
                                            <FormControl><RadioGroupItemSecondary label={'ندارد'}
                                                                                  value="true"/></FormControl>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormItem>
                        <FormLabel htmlFor={'display-attachment'}
                                   className={'w-1/2 flex items-center gap-[18px] bg-[#EEEEEE] rounded-[20px] justify-center py-[14px]'}>
                            <Camera/>
                            تصویر ضمیمه
                            <InputSecondary
                                id={'display-attachment'}
                                className={'hidden'}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) =>
                                    e.target.files && handleUpload(e.target.files, index)
                                }
                            />
                        </FormLabel>

                        <div className="flex flex-wrap gap-2 mt-2">
                            {(previews[index] ?? []).map((src, i) => (
                                <img
                                    key={i}
                                    src={src}
                                    alt={`preview-${i}`}
                                    className="h-16 w-16 object-cover border rounded"
                                />
                            ))}
                        </div>
                    </FormItem>
                </div>
            ))}
            <div className={'col-span-2 flex justify-center'}>
                <Button
                    type="button"
                    variant="text"
                    className={'mx-auto'}
                    onClick={() =>
                        append({
                            dimensions: {width: 0, height: 0},
                            sticker: false,
                            attachments: [],
                        })
                    }>
                    + اضافه کردن تابلو سردرب جدید
                </Button>
            </div>

        </>
    )
}
