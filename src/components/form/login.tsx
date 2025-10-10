import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { setCookie } from 'nookies'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import Input from '@/components/ui/input'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import LoginTitle from '@/components/ui/login-title'
import { phoneNumberValidator } from '@/lib/inputValidators'
import {
  ERRORS_DICTIONARY,
  ICredentials,
  requestOTP,
  verifyOtp,
} from '@/lib/services/authentication'
import { cn, formatTimer, numberToEnglish } from '@/lib/utils'

const Login = ({ onLoginSuccessful }: { onLoginSuccessful: () => void }) => {
  const [loginStep, setLoginStep] = useState(1)
  const [credentials, setCredentials] = useState<ICredentials>({ phone: null })
  const sendOTP = async (phone: string) => {
    try {
      const response = await requestOTP({ phone })

      if (response.status === 200) {
        setCredentials({ phone })
        setLoginStep(2)
      }
    } catch (error: any) {
      if (error.response.data.error_key) {
        toast.error(ERRORS_DICTIONARY[error.response.data.error_key])
      } else {
        toast.error('خطایی پیش آمده لطفا مجدد تلاش کنید')
      }
    }
  }

  return loginStep === 1 ? (
    <LoginFirstStep onSubmit={sendOTP} />
  ) : (
    <LoginSecondStep
      sendOTP={sendOTP}
      credentials={credentials}
      onLoginSuccessful={onLoginSuccessful}
    />
  )
}

const LoginSecondStep = ({
  onLoginSuccessful,
  sendOTP,
  credentials,
}: {
  onLoginSuccessful: () => void
  sendOTP: (phone: string) => Promise<void>
  credentials: ICredentials
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
      const response = await verifyOtp({
        phone: numberToEnglish(credentials.phone as string),
        code: numberToEnglish(data.pin),
      })

      if (response?.data?.token) {
        setCookie(undefined, 'accessToken', response.data.token)

        if (response?.data?.user) {
          setCookie(undefined, 'user-info', JSON.stringify(response.data.user))
        }

        toast.success('خوش آمدید')
        onLoginSuccessful()
      }
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

  const resendOTP = async (phone: string) => {
    await sendOTP(phone)
    setTimer(120)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitOTP)}
        className="mx-auto flex w-full flex-col items-center gap-[91px] rounded-[16px] px-9 py-[72px] md:w-auto md:gap-[24px] md:border md:px-[96px]"
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

                        if (val.length === 5) {
                          form.handleSubmit(submitOTP)() // auto-submit when full
                        }
                      }}
                    >
                      <InputOTPGroup dir="ltr" className="w-full justify-between">
                        <InputOTPSlot className="text-[18px]" index={0} />
                        <InputOTPSlot className="text-[18px]" index={1} />
                        <InputOTPSlot className="text-[18px]" index={2} />
                        <InputOTPSlot className="text-[18px]" index={3} />
                        <InputOTPSlot className="text-[18px]" index={4} />
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
            disabled={isSubmitting || form.watch('pin')?.length !== 5}
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
                onClick={() => resendOTP(credentials.phone as string)}
              >
                ارسال مجدد
              </button>
              <span className="font-fa-num text-[14px] md:text-[18px]">{formatTimer(timer)}</span>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
const credentialsSchema = z.object({
  phone: z
    .string()
    .min(1, { message: 'شماره همراه الزامی است' })
    .refine((val) => phoneNumberValidator.pattern.test(numberToEnglish(val)), {
      message: 'شماره همراه معتبر نیست',
    }),
})

type CredentialsFormValues = z.infer<typeof credentialsSchema>

const LoginFirstStep = ({ onSubmit }: { onSubmit: (phone: string) => Promise<void> }) => {
  const credentialsForm = useForm<CredentialsFormValues>({
    resolver: zodResolver(credentialsSchema),
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const submit: SubmitHandler<CredentialsFormValues> = async (data) => {
    setIsSubmitting(true)

    // @ts-ignore
    try {
      const englishPhone = numberToEnglish(data.phone)

      await onSubmit(englishPhone)
    } catch (e) {
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...credentialsForm}>
      <form
        onSubmit={credentialsForm.handleSubmit(submit)}
        className="desktop-card flex flex-col gap-[35px]"
      >
        <LoginTitle title="پنل مدیریت باشگاه فروشندگان" />
        <div className="flex flex-col gap-3">
          <FormField
            control={credentialsForm.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="text-text-secondary-600 flex flex-col gap-2 text-sm">
                <FormControl>
                  <Input
                    placeholder="شماره موبایل"
                    className="h-[56px] !bg-white text-center placeholder:text-center md:h-[67px]"
                    inputMode="numeric"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            variant="brand"
            className="button-shadow flex h-[56px] w-full items-center justify-center md:h-[67px] md:w-[363px]"
            type="submit"
            disabled={isSubmitting}
          >
            ورود
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default Login
