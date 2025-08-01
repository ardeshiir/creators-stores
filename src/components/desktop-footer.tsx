import BonyanTahrirFooterLogoIcon from '@/components/icons/BonyanTahrirFooterLogoIcon'
import CreatorsFooterLogoIcon from '@/components/icons/CreatorsFooterLogoIcon'
import SchepperFooterLogoIcon from '@/components/icons/SchepperFooterLogoIcon'
import { cn } from '@/lib/utils'

const DesktopFooter = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center pb-[140px] md:pb-11">
      <div className="flex w-[90%] items-center justify-center gap-[30px] md:w-[500px] md:justify-between">
        <SchepperFooterLogoIcon />
        <CreatorsFooterLogoIcon />
        <BonyanTahrirFooterLogoIcon />
      </div>

      <div className="mx-auto flex w-full max-w-[calc(100%-160px)] flex-col items-center border-b pb-4">
        <p
          className={cn(
            'text-[#BABCBE] md:flex hidden text-[11px] md:mt-[24px] max-w-[80%] text-center font-roboto',
          )}
          dir="ltr"
        >
          Every product within these pages is protected under international copyright laws, ensuring
          that the ingenuity and craftsmanship invested in each item are preserved. We prohibit any
          unauthorized reproduction, distribution, or transmission of the content herein, as it
          represents the intellectual labor and creative value of our dedicated team. The integrity
          of our products is paramount, and we uphold strict standards to guarantee that every item
          we craft meets the highest expectations of functionality and design. Our rigorous
          adherence to quality is unwavering, and we stand behind every piece we produce.
        </p>
        <p
          className={cn(
            'text-[#BABCBE] md:flex hidden text-[11px] md:mt-[8px] max-w-[80%] text-center font-roboto',
          )}
          dir="ltr"
        >
          Our environmental commitment is evident throughout our product range. We take pride in our
          efforts to minimize our ecological footprint, integrating sustainable materials and
          eco-friendly technologies in our designs. We believe in creating products that not only
          serve the present but also safeguard the future.
        </p>
        <span
          className={cn(
            'text-[#BABCBE] md:text-[11px] text-[14px] w-full  max-w-[90%] md:mt-[8px] mt-[6px] font-black md:max-w-[80%] text-center font-roboto',
          )}
          dir="ltr"
        >
          © 2025-2026 BONYAN TAHRIR GROUP. All Rights Reserved.
        </span>
      </div>
      {/*<LanguageSwitch />*/}
    </div>
  )
}

/*
function LanguageSwitch() {
  const { locale } = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/')

    segments[1] = newLocale
    router.push(segments.join('/'))
  }

  return (
    <div className="container flex w-full justify-start">
      <div className="mt-4 flex items-center font-roboto">
        <button
          className={cn(
            'w-[30px] h-[24px] text-[#BABCBE] pt-[2px] font-regular flex items-center justify-center',
            locale === 'en' && 'text-[#000]',
          )}
          onClick={() => switchLocale('en')}
        >
          EN
        </button>
        <span className="h-[24px] w-px bg-[#BABCBE]" />
        <button
          className={cn(
            'w-[30px] h-[24px] text-[#BABCBE] pt-[2px] font-regular flex items-center justify-center',
            locale === 'fa' && 'text-[#000]',
          )}
          onClick={() => switchLocale('fa')}
        >
          FA
        </button>
        <span className="translate-y-px">
          <GlobeIcon />
        </span>
      </div>
    </div>
  )
}
*/

export default DesktopFooter
