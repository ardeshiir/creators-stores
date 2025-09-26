'use client'

import { useEffect, useRef, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import gsap from 'gsap'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import CheckCircle from '@/components/icons/CheckCircle'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { ERRORS_DICTIONARY } from '@/lib/services/authentication'
import { addShop, resendShopVerificationOTP, shopFinalSubmission } from '@/lib/services/shop'
import { cn, formatTimer } from '@/lib/utils'
import { useFormStore } from '@/stores/useFormStore'

import { StepManager } from './StepManager'

export default function MultiStepForm() {
  const { updateData, data, step, setStep } = useFormStore()
  const [submitted, setSubmitted] = useState(false)
  const [preSubmittedShopId, setPreSubmittedShopId] = useState<null | string>(null)

  const stepsCount = 10
  const progress = ((step + 1) / stepsCount) * 100
  const contentRef = useRef<HTMLDivElement>(null)

  const handleBack = () => setStep(Math.max(step - 1, 0))
  const handleNext = async (values: any) => {
    updateData(values)
    setStep(Math.min(step + 1, stepsCount - 1))
  }

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handlePreFinalSubmit = async (values: any) => {
    try {
      setIsSubmitting(true)

      const response = await addShop(data)

      if (response.status === 201) {
        setPreSubmittedShopId(response.data.shopId)
        toast.success('ثبت فروشگاه با موفقیت انجام شد.')
      }
    } catch (e) {
      toast.error('خطایی رخ داده است لطفا دوباذه تلاش کنید.')
      console.log({ submissionError: e })
    } finally {
      setIsSubmitting(false)
    }
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
    return <FormSubmittedSuccessfully setSubmitted={setSubmitted} setStep={setStep} />
  }

  if (preSubmittedShopId) {
    return <VerifyOTP shopID={preSubmittedShopId} setSubmitted={setSubmitted} />
  }

  return (
    <div className="relative flex h-full grow flex-col justify-between">
      {/* 👇 Animation wrapper */}
      <div key={step} ref={contentRef} className="space-y-6 pb-12">
        <StepManager
          step={step}
          onNext={step === stepsCount - 1 ? handlePreFinalSubmit : handleNext}
        />
      </div>
      {/* Buttons + Progress Bar */}
      <div className="mx-auto flex w-full max-w-[562px] flex-col gap-[34px] pb-4 md:gap-[64px]">
        <div
          className={cn('grid grid-cols-12 gap-4', step === stepsCount - 1 && 'flex-row-reverse')}
        >
          <Button
            form={`step-form-${step}`}
            variant="brand"
            type="submit"
            disabled={isSubmitting}
            className={cn(
              'order-1 h-[67px] font-bold shadow md:order-2 md:col-span-6 col-span-8',
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
            className="order-2 col-span-4 h-[67px] bg-[#E4E4E4] font-bold text-black shadow-none md:order-1 md:col-span-6"
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

const VerifyOTP = ({
  shopID,
  setSubmitted,
}: {
  shopID: string | number
  setSubmitted: (val: boolean) => void
}) => {
  const [timer, setTimer] = useState(120)

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000)

      return () => {
        clearInterval(interval)
      }
    }
  }, [timer])

  const FormSchema = z.object({
    pin: z.string().min(5, {
      message: 'کد ورود باید ۶ رقم باشد.',
    }),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: '',
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  async function submitOTP(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true)

    try {
      const response = await shopFinalSubmission({
        shopID: shopID as string,
        code: data.pin,
      })

      console.log({ response })
      setSubmitted(true)
    } catch (error: any) {
      console.log({ error })

      if (error.response.data.error_key) {
        toast.error(ERRORS_DICTIONARY[error.response.data.error_key])
      } else {
        toast.error('خطایی پیش آمده لطفا مجدد تلاش کنید')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const resendOTP = async (shopId: string) => {
    await resendShopVerificationOTP(shopId)
    setTimer(120)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitOTP)}
        className="mx-auto flex w-full flex-col items-center gap-[91px] rounded-[14px] px-9 py-[72px] md:w-auto md:gap-[24px] md:border md:px-[96px]"
      >
        <div className="flex w-full flex-col items-start gap-6 md:items-center">
          <span className="text-[18px] font-medium text-black">
            کد پیامک شده‌ی پنج رقمی را وارد نمایید
          </span>
          <div className="w-full space-y-6">
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem className="w-full" dir="ltr">
                  <FormControl>
                    <InputOTP
                      dir="ltr"
                      maxLength={5}
                      {...field}
                      onChange={(val) => {
                        field.onChange(val) // update form state
                        console.log({ val })

                        if (val.length === 5) {
                          console.log('submitting')
                          form.handleSubmit(submitOTP)() // auto-submit when full
                        }
                      }}
                    >
                      <InputOTPGroup dir="ltr" className="w-full justify-between">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex w-full flex-col gap-6">
          <Button
            disabled={isSubmitting}
            variant="brand"
            className="button-shadow flex h-[56px] w-full items-center justify-center md:h-[67px] md:w-[363px]"
            type="submit"
          >
            تایید
          </Button>
          <div className="flex w-full items-center justify-between">
            <span className="text-[14px] md:text-[18px]">کد دریافت نکردید؟</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className={cn(
                  'md:text-[18px] text-[14px] text-[#0038db]',
                  timer > 0 && 'text-neutral-400',
                )}
                disabled={timer > 0}
                onClick={() => resendOTP(shopID as string)}
              >
                ارسال مجدد
              </button>
              <span className="font-yekan text-[14px] md:text-[18px]">{formatTimer(timer)}</span>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}

const FormSubmittedSuccessfully = ({
  setSubmitted,
  setStep,
}: {
  setSubmitted: (val: boolean) => void
  setStep: (val: number) => void
}) => {
  const router = useRouter()

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
        <Button onClick={() => router.push('/shops')} className="h-12 w-full bg-black text-white">
          فروشندگان ثبت شده
        </Button>
      </div>
    </div>
  )
}
