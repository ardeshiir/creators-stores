'use client'

import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {Form} from '@/components/ui/form'

import {schema2, Step2} from "@/components/form/steps/Step2";
import Step3, {schema3} from "@/components/form/steps/Step3";
import Step4, {schema4} from "@/components/form/steps/Step4";
import Step5, {schema5} from "@/components/form/steps/Step5";
import {schema6, Step6} from "@/components/form/steps/Step6";
import {schema7, Step7} from "@/components/form/steps/Step7";
import {schema8, Step8} from "@/components/form/steps/Step8";
import {schema9, Step9} from "@/components/form/steps/step9";
import {Step10} from "@/components/form/steps/Step10";
import {z} from "zod";
import Step1, {schema1} from "@/components/form/steps/Step1";

const schema10 = z.object({})
const steps = [
    {Component: Step1, schema: schema1},
    {Component: Step2, schema: schema2},
    {Component: Step3, schema: schema3},
    {Component: Step4, schema: schema4},
    {Component: Step5, schema: schema5},
    {Component: Step6, schema: schema6},
    {Component: Step7, schema: schema7},
    {Component: Step8, schema: schema8},
    {Component: Step9, schema: schema9},
    {Component: Step10, schema: schema10},
]

export function StepManager({
                                step,
                                onNext,
                            }: {
    step: number
    onNext: (values: any) => void
}) {
    const {Component, schema} = steps[step]

    const form = useForm({
        resolver: schema ? zodResolver(schema) : undefined,
        defaultValues: {
            mobile: [''],
            otherBrands: ['فابر کاستل', 'استدلر', 'اسمیگل'],
            address: {
                phoneNumber: [''],
                state: '',
                city: '',
                description: '',
                postalcode: '',
            },
            banner: {
                type: 'banner',
                dimensions: {width: undefined, height: undefined},
                attachments: [],
            },
            displayStand: [{brand: '', attachments: []}],
            showCase: [{dimensions: {width: undefined, height: undefined}, sticker: false, attachments: []}],
            externalImages: [['', '']],
            internalImages: [['', '']],
        }
        ,
        mode: 'onTouched',
    })

    return (
        <Form {...form}>
            <form
                id={`step-form-${step}`}
                onSubmit={form.handleSubmit(onNext)}
                className="space-y-6 pb-6"
            >
                <Component form={form}/>
            </form>
        </Form>
    )
}
