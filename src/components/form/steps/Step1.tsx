// components/form/steps/Step1.tsx
'use client'

import {z} from 'zod'
import {UseFormReturn} from 'react-hook-form'
import {FormControl, FormField, FormItem, FormMessage,} from '@/components/ui/form'
import {Button} from '@/components/ui/button'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select'
import {safeArray} from "@/lib/form";
import {X} from "lucide-react";
import Input from "@/components/ui/input";

export const schema1 = z.object({
    storeName: z.string().min(2),
    propertyStatus: z.enum(['rental', 'owner']),
    name: z.string().min(2),
    familyName: z.string().min(2),
    mobile: z.array(z.string().min(10)).min(1),
})

export type Step1Values = z.infer<typeof schema1>

export default function Step1({form}: { form: UseFormReturn<Step1Values> }) {


    const addMobile = () => {
        const current = form.getValues('mobile') ?? []
        form.setValue('mobile', [...current, ''])
    }
    const removeMobile = (index: number) => {
        const current = safeArray(form.getValues('mobile'))
        const updated = current.filter((_, i) => i !== index)
        form.setValue('mobile', updated)
    }


    return (
        <>
            <FormField
                control={form.control}
                name="storeName"
                render={({field}) => (
                    <FormItem>
                        {/*<FormLabel>Store Name</FormLabel>*/}
                        <FormControl>
                            <Input {...field} placeholder={'نام فروشگاه'}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="propertyStatus"
                render={({field}) => (
                    <FormItem>
                        {/*<FormLabel>Property Status</FormLabel>*/}
                        <Select
                            onValueChange={field.onChange}
                            // open={true}
                            // defaultValue={field.value}
                        >
                            <FormControl>
                                <SelectTrigger className={'w-full h-[64px] border border-[#E4E4E4] bg-[#F9F9F9]'}>
                                    <SelectValue placeholder="وضعیت ملک"
                                                 className={'h-[64px] placeholder:text-lg text-lg'}/>
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent className={'w-full'}>
                                <SelectItem value="rental">مستاجر</SelectItem>
                                <SelectItem value="owner">مالک</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage/>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="name"
                render={({field}) => (
                    <FormItem>
                        {/*<FormLabel>Name</FormLabel>*/}
                        <FormControl>
                            <Input {...field} placeholder={'نام'}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="familyName"
                render={({field}) => (
                    <FormItem>
                        {/*<FormLabel>Family Name</FormLabel>*/}
                        <FormControl>
                            <Input {...field} placeholder={'نام خانوادگی'}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />
            <div className={'flex flex-col gap-2'}>
                {safeArray(form.watch('mobile')).map((_, index) => (
                    <FormField
                        key={index}
                        control={form.control}
                        name={`mobile.${index}`}
                        render={({field}) => (
                            <FormItem className="flex flex-col items-center gap-2">
                                <FormControl>
                                    <Input {...field} placeholder="شماره تلفن"/>
                                </FormControl>
                                {index > 0 && (
                                    <Button type="button" variant="ghost" size="icon"
                                            onClick={() => removeMobile(index)}>
                                        <X size={16}/>
                                    </Button>
                                )}
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                ))}

                <Button type="button" variant="text" onClick={addMobile}>
                    + اضافه کردن شماره جدید </Button>
            </div>

        </>)
}
