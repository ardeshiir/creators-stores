// components/form/steps/Step5.tsx
'use client'

import {z} from 'zod'

import {FormControl, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form'

import Input from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import {X} from 'lucide-react'
import {UseFormReturn} from "react-hook-form";
import {safeArray} from "@/lib/form";

export const schema5 = z.object({
    address: z.object({
        state: z.any(),
        city: z.any(),
        description: z.any(),
        postalcode: z.any(),
        phoneNumber: z.any(),
        // location: skipped for now
    }),
})

export type Step5Values = z.infer<typeof schema5>
export default function Step5({form}: { form: UseFormReturn<Step5Values> }) {

    const addPhone = () => {
        const current = safeArray(form.getValues('address.phoneNumber'))
        form.setValue('address.phoneNumber', [...current, ''])
    }

    const removePhone = (index: number) => {
        const updated = safeArray(form.getValues('address.phoneNumber')).filter((_, i) => i !== index)
        form.setValue('address.phoneNumber', updated)
    }


    return (<>
            <FormLabel className={'text-lg font-bold text-black'}>آدرس فروشگاه</FormLabel>
            <div className={'grid grid-cols-2 gap-x-[32px] gap-y-[12px]'}>
                <FormField
                    control={form.control}
                    name="address.state"
                    render={({field}) => (
                        <FormItem className={'col-span-1'}>
                            <FormControl>
                                <Input placeholder={'استان'} {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="address.city"
                    render={({field}) => (
                        <FormItem className={'col-span-1'}>
                            <FormControl>
                                <Input placeholder={'شهر'} {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="address.description"
                    render={({field}) => (
                        <FormItem className={'col-span-2'}>
                            <FormControl>
                                <Input placeholder={'آدرس پستی'} {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="address.postalcode"
                    render={({field}) => (
                        <FormItem className={'col-span-2'}>
                            <FormControl>
                                <Input placeholder={'کد پستی'} {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormItem className={'col-span-2'}>
                    {/*<FormLabel>Phone Numbers</FormLabel>*/}
                    <div className="space-y-2">
                        {safeArray(form.watch('address.phoneNumber')).map((_, index) => (
                            <FormField
                                key={index}
                                control={form.control}
                                name={`address.phoneNumber.${index}`}
                                render={({field}) => (
                                    <FormItem className="flex items-center gap-2">
                                        <FormControl><Input {...field} placeholder="شماره تلفن"
                                                            startIcon={field.value ? undefined : <span
                                                                className={'text-lg text-[#babcbe]'}>0912345678</span>}/></FormControl>
                                        {index > 0 && (
                                            <Button type="button" variant="ghost" size="icon"
                                                    onClick={() => removePhone(index)}>
                                                <X size={16}/>
                                            </Button>
                                        )}
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        ))}
                    </div>
                    <Button
                        type="button"
                        variant="text"
                        className="mt-2"
                        onClick={addPhone}
                    >
                        + اضافه کردن شماره جدید
                    </Button>
                </FormItem>
            </div>
        </>
    )
}
