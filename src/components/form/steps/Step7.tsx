// components/form/steps/Step7.tsx
'use client'

import {useState} from 'react'
import {z} from 'zod'
import {useFieldArray, UseFormReturn} from 'react-hook-form'

import {FormControl, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form'

import Input, {InputSecondary} from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import {Camera, X} from 'lucide-react'
import {RadioGroup, RadioGroupItemSecondary} from "@/components/ui/radio-group";

const DisplayStandSchema = z.object({
    brand: z.string().min(1, 'Brand name is required'),
    attachments: z.array(z.string()).optional(),
})

export const schema7 = z.object({
    displayStand: z.array(
        z.object({
            brand: z.string().min(1),
            attachments: z.array(z.string()).optional(),
        })
    ),
})

export type Step7Values = z.infer<typeof schema7>

export function Step7({form}: { form: UseFormReturn<Step7Values> }) {
    const [previews, setPreviews] = useState<Record<number, string[]>>({})

    const {fields, append, remove} = useFieldArray({
        control: form.control,
        name: 'displayStand',
    })

    const handleUpload = (files: FileList, index: number) => {
        const urls = Array.from(files).map((file) => URL.createObjectURL(file))
        form.setValue(`displayStand.${index}.attachments`, urls)
        setPreviews((prev) => ({...prev, [index]: urls}))
    }

    return (
        <>

            <FormLabel className="text-lg font-bold text-black">استند نمایش محصول</FormLabel>

            {fields.map((field, index) => (
                <div
                    key={field.id}
                    className="space-y-4 relative"
                >
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
                        name="has-stand"
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

                    <FormField
                        control={form.control}
                        name={`displayStand.${index}.brand`}
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder={'نام برند فعلی'} {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormItem>
                        <FormLabel htmlFor={'signboard-attachment'}
                                   className={'w-1/2 flex items-center gap-[18px] bg-[#EEEEEE] rounded-[20px] justify-center py-[14px]'}>
                            <Camera/>
                            تصویر ضمیمه
                            <InputSecondary
                                id={'signboard-attachment'}
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
                    onClick={() => append({brand: '', attachments: []})}
                >
                    + اضافه کردن تابلو سردرب جدید
                </Button>
            </div>
            

        </>
    )
}
