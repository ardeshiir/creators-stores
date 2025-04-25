import { cn } from '@/lib/utils'

const LoginTitle = ({ className, title }: { className?: string; title: string }) => {
  return (
    <div className={cn('flex flex-col items-center gap-[6px]', className)}>
      <h1 className="text-[24px] font-bold md:font-[900]">{title}</h1>
      <span className="text-lg">نسخه ۱.۰.۴</span>
    </div>
  )
}

export default LoginTitle
