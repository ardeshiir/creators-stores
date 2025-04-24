'use client'

import { useState } from 'react'

import { Camera } from 'lucide-react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { FormLabel } from '@/components/ui/form'
import Input from '@/components/ui/input'
import { useFormStore } from '@/stores/useFormStore'

export function Step10() {
  const { reset, data } = useFormStore()
  const [submitted, setSubmitted] = useState(false)
  const [previewImg, setPreviewImg] = useState<string | null>(null)

  const handleFinalSubmit = () => {
    console.log('📝 Submitted:', data)
    setSubmitted(true)
  }

  const renderImages = (urls?: string[]) =>
    urls?.map((url, i) => (
      <Drawer key={i}>
        <DrawerTrigger asChild>
          <button
            onClick={() => setPreviewImg(url)}
            className="text-primary border-primary flex w-full items-center justify-between gap-2 rounded-[20px] border bg-white px-3 py-2 shadow-sm"
          >
            <Camera className="text-primary" size={16} />
            IMG_{i + 1}
          </button>
        </DrawerTrigger>
        <DrawerContent className="p-4">
          <img
            src={previewImg ?? ''}
            alt="Preview"
            className="mx-auto max-h-[80vh] rounded-lg shadow"
          />
        </DrawerContent>
      </Drawer>
    ))

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="space-y-2">
      {/*<h3 className="font-semibold text-base border-b pb-1">{title}</h3>*/}
      <div className="space-y-1">{children}</div>
    </div>
  )

  const Row = ({ label, value }: { label?: string; value?: string }) => (
    <div className="flex min-h-[51px] items-center justify-between border-b-[0.5px] border-[#B6B6B6] py-1 font-medium">
      <span className="font-medium">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )

  if (submitted) {
    return (
      <div className="space-y-6 p-4 text-center">
        <Image src="/logo.svg" alt="logo" width={60} height={60} className="mx-auto" />
        <h2 className="text-xl font-semibold text-green-600">فرم با موفقیت ثبت شد</h2>
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => {
              setSubmitted(false)
              reset()
            }}
          >
            ثبت فرم دیگر
          </Button>
          <Button variant="outline">مشاهده فرم‌های ثبت‌شده</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 text-right">
      <FormLabel className="text-base font-bold">بررسی نهایی اطلاعات</FormLabel>

      <Section title="اطلاعات فروشگاه">
        <Row label="نام فروشگاه:" value={data.storeName} />
        <Row label="وضعیت ملک:" value={data.propertyStatus === 'rental' ? 'مستاجر' : 'مالک'} />
        <Row label="نام و نام خانوادگی:" value={`${data.name} ${data.familyName}`} />
        <Row label="شماره تلفن:" value={data.mobile?.join(', ')} />
      </Section>

      <Section title="توضیحات فروشگاه">
        <Row label="مساحت فروشگاه:" value={`${data.storeDescription?.area} متر`} />
        <Row label="سابقه فعالیت:" value={`${data.storeDescription?.activityHistory} سال`} />
        <Row
          label="سابقه همکاری با پنتل:"
          value={`${data.storeDescription?.cooperationHistory} سال`}
        />
        <Row
          label="نوع فروش:"
          value={data.storeDescription?.sellerType === 'wholesaler' ? 'عمده فروش' : 'خرده فروش'}
        />
        <Row label="زمینه فعالیت:" value={data.foa?.join(', ')} />
        <Row
          label="نحوه خرید:"
          value={data.purchaseMethod === 'direct' ? 'مستقیم' : 'غیر مستقیم'}
        />
        <Row label="سایر برندهای موجود در فروشگاه:" value={data.otherBrands?.join(', ')} />
      </Section>

      <Section title="آدرس فروشگاه">
        <Row label="استان:" value={data.address?.state} />
        <Row label="شهر:" value={data.address?.city} />
        <Row label="آدرس:" value={data.address?.description} />
        <Row label="کد پستی:" value={data.address?.postalcode} />
        <Row label="شماره تلفن ثابت:" value={data.address?.phoneNumber?.join(', ')} />
      </Section>

      <Section title="شرایط محیطی فروشگاه">
        <Row
          label="شرایط محیطی فروشگاه:"
          value={`${data.enviornment?.[0]?.stock === 'true' ? 'بورس' : 'غیربورس'}, ${data.enviornment?.[0]?.mainStreet === 'true' ? 'خیابان اصلی' : 'خیابان فرعی'}`}
        />
        {data.enviornment?.[0]?.signBoard?.map((sb, i) => (
          <div key={i} className="space-y-1">
            <Row label="نوع تابلو سر‌در:" value={sb.type} />
            <Row
              label="ابعاد تابلو سر‌در:"
              value={`${sb.dimensions.width} متر × ${sb.dimensions.height} متر`}
            />
            <div className="mt-3">{renderImages(sb.attachments)}</div>
          </div>
        ))}
      </Section>

      <Section title="استند نمایش محصول">
        {data.displayStand?.map((stand, i) => (
          <div key={i} className="space-y-1">
            <Row label="برند:" value={stand.brand} />
            <div className="mt-3">{renderImages(stand.attachments)}</div>
          </div>
        ))}
      </Section>

      <Section title="ویترین نمایش محصول">
        {data.showCase?.map((s, i) => (
          <div key={i} className="space-y-1">
            <Row label="ارتفاع:" value={`${s.dimensions?.height} متر`} />
            <Row label="عرض:" value={`${s.dimensions?.width} متر`} />
            <Row label="قابلیت نصب استیکر و مش:" value={s.sticker === 'true' ? 'دارد' : 'ندارد'} />
            <div className="mt-3">{renderImages(s.attachments)}</div>
          </div>
        ))}
      </Section>

      <Section title="تصاویر فروشگاه">
        <Row label="تصاویر بیرونی فروشگاه:" />
        <div className="mt-3">
          {' '}
          {data.externalImages?.map((pair, i) => (
            <div key={i} className="flex gap-2">
              {renderImages(pair)}
            </div>
          ))}
        </div>
        <Row label="تصاویر داخلی فروشگاه:" />
        <div className="mt-3">
          {data.internalImages?.map((pair, i) => (
            <div key={i} className="flex gap-2">
              {renderImages(pair)}
            </div>
          ))}
        </div>
      </Section>

      <Section title="توضیحات تکمیلی">
        <p className="text-muted-foreground text-sm">{data.description}</p>
      </Section>

      {/* 📸 Expert Verification Block */}
      <div className="mt-6 space-y-3 rounded-xl border border-[#E4E4E4] p-4">
        <div className="flex h-[51px] items-center justify-between border-b border-[#E4E4E4]">
          <p className="text-[20px] font-bold">احراز هویت کارشناس</p>
          <svg
            width="26"
            height="27"
            viewBox="0 0 26 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M24.1357 6.37865L17.7742 0L16.3315 1.44663L17.2061 2.3236C17.9836 3.10313 18.4096 4.1375 18.4096 5.24683C18.4096 6.35616 17.9836 7.39054 17.2061 8.17007C16.4287 8.9496 15.3971 9.37684 14.2908 9.37684C13.1845 9.37684 12.1529 8.9496 11.3754 8.17007L10.5008 7.2931C9.33471 6.1238 7.79481 5.48669 6.15025 5.48669C4.5057 5.48669 2.95833 6.1313 1.79966 7.2931C-0.599888 9.69915 -0.599888 13.6193 1.79966 16.0253L8.16109 22.404L12.6014 26.8563L14.0441 25.4097L9.60381 20.9574L8.72921 20.0804C7.12203 18.4689 7.12203 15.8529 8.72921 14.2414C10.3364 12.6299 12.9452 12.6299 14.5524 14.2414L15.427 15.1184C16.6305 16.3251 18.2003 16.9248 19.7776 16.9248C21.3549 16.9248 22.9322 16.3251 24.1282 15.1184C25.2943 13.9491 25.9297 12.405 25.9297 10.756C25.9297 9.107 25.2869 7.55544 24.1282 6.39364L24.1357 6.37865ZM7.29396 12.7873C6.17268 13.9116 5.57466 15.3582 5.49991 16.8348L3.24239 14.5712C1.63521 12.9597 1.63521 10.3438 3.24239 8.73223C4.01981 7.9527 5.05139 7.52546 6.15773 7.52546C7.26406 7.52546 8.29565 7.9527 9.07307 8.73223L11.3306 10.9959C9.86545 11.0708 8.41525 11.6705 7.29396 12.7948V12.7873ZM22.7004 13.6643C21.0933 15.2758 18.4844 15.2758 16.8772 13.6643L14.6272 11.4081C16.1521 11.3332 17.5724 10.696 18.6563 9.6092C19.7402 8.52236 20.3756 7.09822 20.4504 5.56914L22.7004 7.82528C23.4779 8.60481 23.9039 9.63918 23.9039 10.7485C23.9039 11.8578 23.4779 12.8922 22.7004 13.6717V13.6643Z"
              fill="#164EF3"
            />
          </svg>
        </div>
        <Input placeholder="نام و نام خانوادگی" />
        <Input placeholder="شماره شناسه" />
        <Button
          variant="outline"
          className="text-primary border-primary flex w-full items-center justify-between border text-lg font-medium"
        >
          احراز هویت با دوربین
          <Camera size={16} />
        </Button>
      </div>
    </div>
  )
}
