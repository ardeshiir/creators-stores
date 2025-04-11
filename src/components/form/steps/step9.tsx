'use client'

import {useEffect, useState} from 'react'
import {z} from 'zod'
import {useFieldArray, UseFormReturn,} from 'react-hook-form'

import {FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form'
import {Button} from '@/components/ui/button'
import {Textarea} from '@/components/ui/textarea'
import {Camera, X} from 'lucide-react'
import {InputSecondary} from "@/components/ui/input";

export const schema9 = z.object({
    externalImages: z.array(z.array(z.string()).length(2)).optional(),
    internalImages: z.array(z.array(z.string()).length(2)).optional(),
    description: z.string().optional(),
})

export type Step9Values = z.infer<typeof schema9>

export function Step9({form}: { form: UseFormReturn<Step9Values> }) {
    const [extPreview, setExtPreview] = useState<Record<number, string[]>>({})
    const [intPreview, setIntPreview] = useState<Record<number, string[]>>({})

    const externalImages = useFieldArray({
        control: form.control,
        name: 'externalImages',
    })

    const internalImages = useFieldArray({
        control: form.control,
        name: 'internalImages',
    })

    useEffect(() => {
        if (!form.getValues('externalImages')?.length) {
            form.setValue('externalImages', [['', '']])
        }
        if (!form.getValues('internalImages')?.length) {
            form.setValue('internalImages', [['', '']])
        }
    }, [form])

    const handleUpload = (
        files: FileList,
        index: number,
        pos: 0 | 1,
        type: 'externalImages' | 'internalImages'
    ) => {
        const url = URL.createObjectURL(files[0])
        const current = form.getValues(type) ?? []
        const pair = [...(current[index] ?? ['', ''])]
        pair[pos] = url
        const updated = [...current]
        updated[index] = pair
        form.setValue(type, updated)

        const setPreview = type === 'externalImages' ? setExtPreview : setIntPreview
        const previewState = type === 'externalImages' ? extPreview : intPreview
        setPreview({...previewState, [index]: pair})
    }

    const renderImagePairs = (
        type: 'externalImages' | 'internalImages',
        array: typeof externalImages,
        previewMap: Record<number, string[]>,
        label: string
    ) => (
        <div className="space-y-4">
            <FormLabel className="text-lg font-bold text-black">{label}</FormLabel>

            {array.fields.map((field, index) => (
                <div key={field.id} className="space-y-4 relative">
                    {array.fields.length > 1 && (
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="absolute top-2 right-2"
                            onClick={() => array.remove(index)}
                        >
                            <X size={16}/>
                        </Button>
                    )}

                    <div className="flex items-center gap-4">
                        {[0, 1].map((pos) => (
                            <div key={pos} className="flex-1 space-y-2">
                                <FormLabel htmlFor={'display-attachment'}
                                           className={'basis-1/2 flex items-center gap-[18px] bg-[#EEEEEE] rounded-[20px] justify-center py-[14px]'}>
                                    <Camera/>
                                    تصویر ضمیمه {pos + 1}
                                    <InputSecondary
                                        id={'display-attachment'}
                                        className={'hidden'}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => {
                                            if (e.target.files) {
                                                handleUpload(e.target.files, index, pos as 0 | 1, type)
                                            }
                                        }}
                                    />
                                </FormLabel>

                                {previewMap[index]?.[pos] && (
                                    <img
                                        src={previewMap[index][pos]}
                                        className="h-16 w-16 object-cover border rounded"
                                        alt={`preview-${pos}`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <Button
                type="button"
                variant="text"
                onClick={() => array.append(['', ''] as [string, string])}
            >
                + تصویر بیشتر </Button>
        </div>
    )

    return (
        <>
            {renderImagePairs('externalImages', externalImages, extPreview, 'تصاویر بیرونی فروشگاه')}
            {renderImagePairs('internalImages', internalImages, intPreview, 'تصاویر داخلی فروشگاه')}

            <FormField
                control={form.control}
                name="description"
                render={({field}) => (
                    <FormItem>
                        {/*<FormLabel>توضیحات</FormLabel>*/}
                        <FormControl>
                            <Textarea placeholder={'توضیحات تکمیلی'} rows={4} {...field} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />
        </>
    )
}
