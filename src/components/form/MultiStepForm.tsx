'use client'

import { useEffect, useRef, useState } from 'react'

import gsap from 'gsap'

import CheckCircle from '@/components/icons/CheckCircle'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useFormStore } from '@/stores/useFormStore'

import { StepManager } from './StepManager'

export default function MultiStepForm() {
  const { updateData, data } = useFormStore()
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  const stepsCount = 10
  const progress = ((step + 1) / stepsCount) * 100
  const contentRef = useRef<HTMLDivElement>(null)

  const handleBack = () => setStep((s) => Math.max(s - 1, 0))
  const handleNext = async (values: any) => {
    updateData(values)
    setStep((s) => Math.min(s + 1, stepsCount - 1))
  }
  const handleFinalSubmit = (values: any) => {
    updateData(values)
    console.log('Submitted:', values)
    setSubmitted(true)
  }

  // 👉 Animate step changes with gsap
  useEffect(() => {
    if (!contentRef.current) return

    gsap.fromTo(
      contentRef.current,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: 0.8,
        ease: 'power2.out',
      },
    )
  }, [step])

  if (submitted) {
    return (
      <div className="flex h-full min-h-[80vh] flex-col items-center justify-between py-6 md:mx-auto md:max-w-[363px] md:justify-center md:gap-12">
        <div className="flex grow flex-col items-center justify-center gap-6 md:grow-0">
          <CheckCircle />
          <h2 className="text-[20px] font-bold">اطلاعات با موفقیت ثبت گردید.</h2>
        </div>
        <div className="flex w-full flex-col items-center gap-4">
          <Button
            variant="brand"
            className="h-12 w-full"
            onClick={() => {
              setSubmitted(false)
              setStep(0)
            }}
          >
            ثبت فروشنده جدید
          </Button>
          <Button className="h-12 w-full bg-black text-white">فروشندگان ثبت شده</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex h-full grow flex-col justify-between">
      {/* 👇 Animation wrapper */}
      <div key={step} ref={contentRef} className="space-y-6 pb-12">
        <StepManager
          step={step}
          onNext={step === stepsCount - 1 ? handleFinalSubmit : handleNext}
        />
      </div>

      {/* Buttons + Progress Bar */}
      <div className="mx-auto flex w-full max-w-[562px] flex-col gap-[34px] pb-4 md:gap-[64px]">
        <div
          className={cn(
            'flex justify-between gap-4',
            step === stepsCount - 1 && 'flex-row-reverse',
          )}
        >
          <Button
            form={`step-form-${step}`}
            variant="brand"
            type="submit"
            className={cn(
              'order-1 h-[67px] font-bold shadow basis-2/3 md:order-2 md:basis-1/2',
              step === stepsCount - 1 && 'bg-[#00BD52]',
            )}
          >
            {step === stepsCount - 2
              ? 'مرحله نهایی'
              : step === stepsCount - 1
                ? 'ثبت نهایی'
                : 'مرحله بعد'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleBack}
            disabled={step === 0}
            className="order-2 h-[67px] basis-1/3 bg-[#E4E4E4] font-bold text-black shadow-none md:order-1 md:basis-1/2"
          >
            بازگشت
          </Button>
        </div>

        <div dir="ltr" className="h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className={cn(
              'h-full bg-blue-600 transition-all duration-300',
              step === stepsCount - 1 && 'bg-[#00BD52]',
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
