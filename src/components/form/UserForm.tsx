'use client'
import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import LoadingSpinner from '@/components/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import Input, { InputSecondary } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { phoneNumberValidator } from '@/lib/inputValidators'
import { UserInfo } from '@/lib/services/authentication'
import { addUser, updateUserByID } from '@/lib/services/users'
import { numberToEnglish } from '@/lib/utils'

const formSchema = z.object({
  name: z.string({ required_error: 'این فیلد الزامیست' }).min(2, {
    message: 'نام معتبر نیست',
  }),
  lastName: z.string({ required_error: 'این فیلد الزامیست' }).min(2, {
    message: 'نام خانوادگی معتبر نیست',
  }),
  identifierCode: z.string({ required_error: 'این فیلد الزامیست' }).min(1, {
    message: 'شماره شناسه معتبر نیست',
  }),
  phone: z
    .string({ required_error: 'این فیلد الزامیست' })
    .min(1, { message: 'این فیلد الزامیست' })
    .refine((val) => phoneNumberValidator.pattern.test(numberToEnglish(val)), {
      message: 'شماره همراه معتبر نیست',
    }),
  state: z.string({ required_error: 'این فیلد الزامیست' }).min(2, {
    message: 'استان معتبر نیست',
  }),
  city: z.string({ required_error: 'این فیلد الزامیست' }).min(2, {
    message: 'شهر معتبر نیست',
  }),
  district: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        const english = numberToEnglish(val)
        const parsed = parseInt(english, 10)

        return parsed
      }

      return val
    },
    z
      .number({ invalid_type_error: 'منطقه معتبر نیست', required_error: 'این فیلد الزامیست' })
      .min(1, {
        message: 'منطقه معتبر نیست',
      }),
  ),
  role: z.enum(['field_agent', 'regional_manager', 'global_manager']),
}) as z.ZodType<{
  name: string
  lastName: string
  identifierCode: string
  phone: string
  state: string
  city: string
  district: number
  role: 'field_agent' | 'regional_manager' | 'global_manager'
}>
const UserForm = ({ defaultUserValues }: { defaultUserValues?: Partial<UserInfo> }) => {
  const [submitting, setSubmitting] = useState<boolean>(false)
  const form = useForm<z.infer<typeof formSchema>>({
    // @ts-ignore
    resolver: zodResolver(formSchema),
    defaultValues: defaultUserValues
      ? {
          name: defaultUserValues?.name,
          lastName: defaultUserValues?.lastName,
          identifierCode: defaultUserValues?.identifierCode,
          phone: defaultUserValues?.phone,
          state: defaultUserValues?.state,
          city: defaultUserValues?.city,
          district: defaultUserValues?.district,
          role: defaultUserValues?.role,
        }
      : {
          role: 'field_agent',
        },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)

    try {
      setSubmitting(true)

      if (defaultUserValues) {
        await updateUserByID(defaultUserValues._id as string, values)
        toast.success('کاربر مورد نظر با موفقیت به‌روزرسانی شد')
      } else {
        await addUser(values)
        toast.success('اطلاعات کاربر ثبت شد')
      }
    } catch (error) {
      console.log({ error })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="h-70vh flex flex-col justify-between space-y-8"
        >
          <div className="grid grid-cols-6 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  {/*<FormLabel>Name</FormLabel>*/}
                  <FormControl>
                    <InputSecondary {...field} placeholder="نام" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  {/*<FormLabel>Family Name</FormLabel>*/}
                  <FormControl>
                    <InputSecondary {...field} placeholder="نام خانوادگی" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="col-span-6">
                  <FormControl>
                    <Input
                      startIconClassName="text-placeholder font-medium"
                      {...field}
                      placeholder="شماره موبایل"
                      startIcon={form.watch('phone')?.length === 0 ? '۰۹۱۲۳۴۵۶۷۸۹' : ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="identifierCode"
              render={({ field }) => (
                <FormItem className="col-span-6">
                  <FormControl>
                    <InputSecondary {...field} placeholder="شماره شناسه" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  {/*<FormLabel>Name</FormLabel>*/}
                  <FormControl>
                    <InputSecondary {...field} placeholder="استان" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  {/*<FormLabel>Family Name</FormLabel>*/}
                  <FormControl>
                    <InputSecondary {...field} placeholder="شهر" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem className="col-span-6">
                  {/*<FormLabel>Family Name</FormLabel>*/}
                  <FormControl>
                    <InputSecondary inputMode="numeric" {...field} placeholder="منطقه" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="order-2 col-span-6 md:order-5 md:col-span-3">
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="h-[67px] w-full border border-[#E4E4E4] bg-[#F9F9F9] md:h-[56px]">
                        <SelectValue
                          placeholder={field.value ? rolesMap[field.value] : 'سطح دسترسی'}
                          className="h-[67px] text-lg placeholder:text-lg md:h-[56px]"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="w-full">
                      <SelectItem value="field_agent">گارشناس میدانی</SelectItem>
                      <SelectItem value="regional_manager">مدیر منظقه</SelectItem>
                      <SelectItem value="global_manager">مدیر سراسری</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid w-full grid-cols-3 gap-6">
            <Button
              className="radius-[20px] col-span-2 h-[67px] !px-[69px] !py-[18px] text-[20px]"
              type="submit"
              variant="brand"
            >
              ثبت اطلاعات {submitting && <LoadingSpinner />}
            </Button>
            <Button
              className="radius-[20px] col-span-1 h-[67px] !px-[69px] !py-[18px] text-[20px]"
              type="button"
              variant="default"
              asChild
            >
              <Link href="/users">لیست کارشناسان</Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

const rolesMap = {
  field_agent: 'گارشناس میدانی',
  regional_manager: 'مدیر منظقه',
  global_manager: 'مدیر سراسری',
}

export default UserForm
