'use client'

import { UseFormReturn } from 'react-hook-form'

import { Form } from '@/components/ui/form'

import { steps } from './MultiStepForm'

export function StepManager({
  step,
  onNext,
  form,
}: {
  step: number
  onNext: (values: any) => void
  form: UseFormReturn<{}, unknown, {}>
}) {
  const { Component } = steps[step]

  const onerror = (error) => {
    console.log({ error })
  }

  return (
    <Form {...form}>
      <form id={`step-form-${step}`} onSubmit={form.handleSubmit(onNext, onerror)} className="pb-6">
        <Component form={form} />
      </form>
    </Form>
  )
}
