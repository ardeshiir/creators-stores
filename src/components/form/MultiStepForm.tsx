'use client'

import { useEffect, useRef, useState } from 'react'
import { StepManager } from './StepManager'
import { Button } from '@/components/ui/button'
import { useFormStore } from '@/stores/useFormStore'
import gsap from 'gsap'
import CheckCircle from '@/components/icons/CheckCircle'

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
      { autoAlpha: 0, y: 20 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
      },
    )
  }, [step])

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-between h-full space-y-6 py-6">
        <div className="flex flex-col items-center gap-6 translate-y-full">
          <CheckCircle />
          <h2 className="text-[20px] font-bold">اطلاعات با موفقیت ثبت گردید.</h2>
        </div>
        <div className="flex flex-col w-full items-center gap-6">
          <Button className="w-full h-[67px]" onClick={() => {
            setSubmitted(false)
            setStep(0)
          }}>
            ثبت فروشنده جدید
          </Button>
          <Button className="w-full h-[67px] bg-black text-white">فروشندگان ثبت شده</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-grow flex flex-col h-full justify-between relative">
      {/* 👇 Animation wrapper */}
      <div key={step} ref={contentRef} className="space-y-6 pb-12">
        <StepManager
          step={step}
          onNext={step === stepsCount - 1 ? handleFinalSubmit : handleNext}
        />
      </div>

      {/* Buttons + Progress Bar */}
      <div className="flex flex-col gap-[34px] w-full pb-4">
        <div className="flex justify-between gap-4">
          <Button
            form={`step-form-${step}`}
            type="submit"
            className="basis-2/3 h-[67px]"
          >
            {step === stepsCount - 2 ? 'مرحله نهایی' : step === stepsCount - 1 ? 'ثبت نهایی' : 'مرحله بعد'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleBack}
            disabled={step === 0}
            className="basis-1/3 h-[67px] text-black"
          >
            بازگشت
          </Button>
        </div>

        <div dir="ltr" className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
