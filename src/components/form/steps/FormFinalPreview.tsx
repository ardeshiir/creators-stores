import { ReactNode, useState } from 'react'

import { Camera } from 'lucide-react'

import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { cn } from '@/lib/utils'
import { FormState } from '@/stores/useFormStore'

const displayStandDict: Record<string, string> = {
  reglam: 'رگلام',
  ontable: 'رومیزی',
  none: 'فاقد استند',
}

const ImageItem = ({ url }: { url: string }) => {
  const [previewImg, setPreviewImg] = useState<string | null>(null)

  if (!url) {
    return null
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button
          onClick={() => setPreviewImg(url)}
          className="border-brand flex w-[138px] items-center justify-between rounded-[8px] border border-brand-primary bg-white px-2 py-1 text-lg leading-[24px] text-brand-primary"
        >
          <Camera fill="var(--brand-primary)" stroke="white" className="text-primary" size={16} />
          IMG
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
  )
}

const ImageGroup = ({ urls }: { urls?: string[] | string }) => {
  if (Array.isArray(urls)) {
    return (
      <div className="flex items-center gap-3">
        {urls?.map((url, i) => (
          <ImageItem url={url} key={i} />
        ))}
      </div>
    )
  } else {
    return <ImageItem url={urls as string} />
  }
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="w-full space-y-2">
    {/*<h3 className="font-semibold text-base border-b pb-1">{title}</h3>*/}
    <div className="space-y-1">{children}</div>
  </div>
)

const Row = ({
  label,
  value,
  className,
}: {
  label?: string
  value?: ReactNode
  className?: string
}) => (
  <div
    className={cn(
      'flex py-3 items-center justify-between border-b-[0.5px] border-[#B6B6B6] font-medium',
      className,
    )}
  >
    <span className="text-nowrap font-medium">{label}</span>
    <span className="font-fa-num font-medium">{value}</span>
  </div>
)

const FormFinalPreview = ({ data }: { data: FormState['data'] }) => {
  return (
    <>
      <Section title="اطلاعات فروشگاه">
        <Row label="نام فروشگاه:" value={data.storeName} />
        <Row label="وضعیت ملک:" value={data.propertyStatus === 'rental' ? 'مستاجر' : 'مالک'} />
        <Row label="نام و نام خانوادگی:" value={`${data.name} ${data.lastName}`} />
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
        <Row
          label="سایر برندهای موجود در فروشگاه:"
          className="flex-col items-start md:flex-row md:items-center"
          value={data.otherBrands?.join(', ')}
        />
      </Section>

      <Section title="آدرس فروشگاه">
        <Row
          label="آدرس فروشگاه:"
          className="flex-col items-start md:flex-row md:items-center"
          value={`${data.address?.state ? data.address?.state + ',' : ''}${data.address?.city ? data.address?.city + ',' : ''}${data.address?.description || ''}`}
        />
        <Row label="کد پستی:" value={data.address?.postalcode} />
        <Row label="شماره تلفن ثابت:" value={data.address?.phoneNumber?.join(', ')} />
      </Section>

      <Section title="موقعیت مکانی فروشگاه">
        <Row
          label="موقعیت مکانی فروشگاه:"
          value={`${String(data?.stock) === 'true' ? 'بورس' : 'غیربورس'}, ${String(data?.mainStreet) === 'true' ? 'خیابان اصلی' : 'خیابان فرعی'}`}
        />
        {data?.signBoard?.map((sb, i) => {
          return (
            <div key={i} className="space-y-1">
              <Row
                label="نوع تابلو سر‌درب:"
                className="border-b-0"
                value={signboardDictionary[sb.type]}
              />
              <div
                className={cn(
                  'flex w-full items-center',
                  !sb.attachments ? 'border-b-[0.5px] border-[#B6B6B6] pb-3' : 'pb-6',
                )}
              >
                <div className="flex flex-1 items-center justify-between border-l border-[#b6b6b6] pl-3">
                  <span>ارتفاع:</span>
                  <span className="font-fa-num">{`${sb.dimensions?.height || 0} متر`}</span>
                </div>
                <div className="flex flex-1 items-center justify-between pr-3">
                  <span>عرض:</span>
                  <span className="font-fa-num">{`${sb.dimensions?.width || 0}  متر`}</span>
                </div>
              </div>
              {sb.attachments && (
                <Row label=" " className="pt-0" value={<ImageGroup urls={sb.attachments} />} />
              )}
              <div className="mt-3" />
            </div>
          )
        })}
      </Section>

      <Section title="">
        <div className="space-y-1">
          <Row
            label="استند نمایش محصول:"
            className={cn(
              data.displayStand?.attachments && 'items-start',
              data.displayStand?.type !== 'none' && 'border-b-0',
            )}
            value={data.displayStand?.type === 'none' ? 'ندارد' : 'دارد'}
          />
          {data.displayStand?.type !== 'none' && (
            <div className="flex items-center justify-between border-b-[0.5px] border-[#B6B6B6] pb-3">
              {displayStandDict[data.displayStand?.type as string]}
              <ImageGroup urls={data.displayStand?.attachments} />
            </div>
          )}
        </div>
      </Section>

      <Section title="ویترین نمایش محصول">
        <Row
          label="ویترین نمایش محصول:"
          className="border-b-0"
          value={!!data.showCase?.length ? 'دارد' : 'ندارد'}
        />
        {data.showCase?.map((s, i) => (
          <div key={i} className="space-y-1">
            <div className={cn('flex w-full items-center', 'pb-6')}>
              <div className="flex flex-1 items-center justify-between border-l border-[#b6b6b6] pl-3">
                <span>ارتفاع:</span>
                <span className="font-fa-num">{`${s.dimensions?.height || 0} متر`}</span>
              </div>
              <div className="flex flex-1 items-center justify-between pr-3">
                <span>عرض:</span>
                <span className="font-fa-num">{`${s.dimensions?.width || 0}  متر`}</span>
              </div>
            </div>
            <Row
              label="قابلیت نصب استیکر و مش:"
              className={cn(s.attachments && 'items-start', 'pt-0')}
              value={
                <div className="flex flex-col items-end">
                  {String(s.sticker) === 'true' ? 'دارد' : 'ندارد'}
                  <ImageGroup urls={s.attachments} />
                </div>
              }
            />
          </div>
        ))}
      </Section>

      <Section title="تصاویر فروشگاه">
        <Row
          label="تصاویر بیرونی فروشگاه:"
          value={
            <div className="flex gap-2">
              {!data.externalImages?.filter(Boolean).length
                ? 'ندارد'
                : data.externalImages?.map((pair, i) => (
                    <div key={i} className="flex gap-2">
                      <ImageGroup urls={pair} />
                    </div>
                  ))}
            </div>
          }
        />
        <Row
          label="تصاویر داخلی فروشگاه:"
          value={
            <div className="flex gap-2">
              {!data.internalImages?.filter(Boolean).length
                ? 'ندارد'
                : data.internalImages?.map((pair, i) => (
                    <div key={i} className="flex gap-2">
                      <ImageGroup urls={pair} />
                    </div>
                  ))}
            </div>
          }
        />
      </Section>

      <Section title="">
        <Row
          label="توضیحات تکمیلی:"
          className="flex-col items-start border-b-0"
          value={data.description?.trim() || 'ندارد'}
        />
      </Section>
    </>
  )
}

const signboardDictionary = {
  none: 'فاقد تابلو سردرب',
  banner: 'بنر',
  composite: 'کامپوزیت',
  other: 'سایر',
}

export default FormFinalPreview
