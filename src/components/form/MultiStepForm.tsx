'use client'

import { useEffect, useRef, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import gsap from 'gsap'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import Step1, { schema1 } from '@/components/form/steps/Step1'
import { Step10 } from '@/components/form/steps/Step10'
import { schema2, Step2 } from '@/components/form/steps/Step2'
import Step3, { schema3 } from '@/components/form/steps/Step3'
import Step4, { schema4 } from '@/components/form/steps/Step4'
import Step5, { schema5 } from '@/components/form/steps/Step5'
import { schema6, Step6 } from '@/components/form/steps/Step6'
import { schema7, Step7 } from '@/components/form/steps/Step7'
import { schema8, Step8 } from '@/components/form/steps/Step8'
import { schema9, Step9 } from '@/components/form/steps/step9'
import CheckCircle from '@/components/icons/CheckCircle'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { ERRORS_DICTIONARY } from '@/lib/services/authentication'
import {
  addShop,
  resendShopVerificationOTP,
  shopFinalSubmission,
  updateShop,
} from '@/lib/services/shop'
import { cn, formatTimer } from '@/lib/utils'
import { useFormStore } from '@/stores/useFormStore'

import { StepManager } from './StepManager'

const schema10 = z.object({})

export const steps = [
  { Component: Step1, schema: schema1 },
  { Component: Step2, schema: schema2 },
  { Component: Step3, schema: schema3 },
  { Component: Step4, schema: schema4 },
  { Component: Step5, schema: schema5 },
  { Component: Step6, schema: schema6 },
  { Component: Step7, schema: schema7 },
  { Component: Step8, schema: schema8 },
  { Component: Step9, schema: schema9 },
  { Component: Step10, schema: schema10 },
]

export default function MultiStepForm() {
  const { updateData, data, step, setStep, reset } = useFormStore()
  const [submitted, setSubmitted] = useState(false)
  const [preSubmittedShopId, setPreSubmittedShopId] = useState<null | string>(null)
  const { schema } = steps[step]
  const router = useRouter()
  const searchParams = useSearchParams()
  const isEditMode = searchParams.get('edit') === 'true'
  const form = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: {
      propertyStatus: null,
      otherBrands: [],
      address: {
        phoneNumber: [null],
        state: null,
        city: null,
        description: null,
        postalcode: null,
      },
      mainStreet: null,
      stock: null,
      signBoard: [
        {
          type: null,
          dimensions: { width: null, height: null },
          attachments: null,
        },
      ],
      displayStand: { type: 'none', brand: '', attachments: null },
      showCase: [{ dimensions: { width: null, height: null }, sticker: false, attachments: null }],
      externalImages: [null, null],
      internalImages: [null, null],
    },
    mode: 'onTouched',
  })

  const stepsCount = 10
  const progress = ((step + 1) / stepsCount) * 100
  const contentRef = useRef<HTMLDivElement>(null)

  const handleBack = () => {
    if (step > 0) {
      setStep(Math.max(step - 1, 0))
    } else {
      router.back()
    }
  }
  const handleNext = async (values: any) => {
    updateData(values)
    setStep(Math.min(step + 1, stepsCount - 1))
  }

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (data) {
      // @ts-ignore
      const { verified, __v, _id, ...rest } = data

      Object.keys(rest).map((dataKey) => {
        if (data[dataKey]) {
          form.setValue(dataKey, data[dataKey])
        }
      })
    }
  }, [data])

  /*useEffect(() => {
    if (isEditMode && data && Object.keys(data).length > 0) {
      console.log('Prefilling form in edit mode...');
      form.reset(data);
      form.trigger(); // ensures formState.isValid updates correctly
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode])*/ // only run once, not on every data update

  const handlePreFinalSubmit = async (values: any) => {
    try {
      setIsSubmitting(true)

      // @ts-ignore
      const response = isEditMode ? await updateShop(data, data._id) : await addShop(data)

      if (response.status === 201) {
        setPreSubmittedShopId(response.data.shopId)
        toast.success('ثبت فروشگاه با موفقیت انجام شد.')
      }
    } catch (e: any) {
      toast.success(e?.response?.data.message || 'خطایی رخ داده است لطفا مجددا تلاش کنید')
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
    <div className="no-scrollbar relative flex h-full max-h-[85vh] grow flex-col justify-between overflow-y-auto md:max-h-full">
      {/* 👇 Animation wrapper */}
      <div
        key={step}
        ref={contentRef}
        className={cn(
          'min-h-[546px] w-full',
          step !== 9 && 'mx-auto md:w-[806px] md:max-w-[100vw]',
          (step === 5 || step === 6) && 'md:w-auto md:mx-auto',
        )}
      >
        <StepManager
          step={step}
          onNext={step === stepsCount - 1 ? handlePreFinalSubmit : handleNext}
          form={form}
        />
      </div>
      {/* Buttons + Progress Bar */}
      <div className="fixed inset-x-0 bottom-0 mx-auto flex w-full max-w-[562px] flex-col gap-[34px] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,1)_25%)] px-9 py-[35px] pb-4 md:static md:gap-[64px] md:px-0">
        <div
          className={cn('grid grid-cols-12 gap-4', step === stepsCount - 1 && 'flex-row-reverse')}
        >
          <Button
            form={`step-form-${step}`}
            variant="brand"
            type="submit"
            disabled={isSubmitting || (!form.formState.isValid && !isEditMode)}
            className={cn(
              'order-1 md:h-[56px] h-[67px] font-bold shadow md:order-2 md:col-span-6 col-span-8',
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
            className="order-2 col-span-4 h-[67px] bg-[#E4E4E4] font-bold text-black shadow-none md:order-1 md:col-span-6 md:h-[56px]"
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
        className="mx-auto flex w-full flex-col items-center gap-[91px] rounded-[16px] py-[72px] md:w-auto md:gap-[24px] md:border md:px-[96px]"
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
                        field.onChange(val)

                        if (val.length === 5) {
                          form.handleSubmit(submitOTP)()
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
  const { reset } = useFormStore()

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
            reset()
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
