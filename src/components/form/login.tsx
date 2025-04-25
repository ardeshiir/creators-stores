import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import LoginTitle from '@/components/ui/login-title'

const Login = ({ onLoginSuccessful }: { onLoginSuccessful?: () => void }) => {
  return (
    <div className="desktop-card flex flex-col gap-[35px]">
      <LoginTitle title="پنل مدیریت باشگاه فروشندگان" />
      <div className="flex flex-col gap-3">
        <Input placeholder="شماره موبایل" className="!bg-white placeholder:text-center" />
        <Input placeholder="شماره شناسه" className="!bg-white placeholder:text-center" />
        <Button
          variant="brand"
          className="button-shadow flex h-[56px] w-full items-center justify-center md:h-[67px] md:w-[363px]"
          onClick={onLoginSuccessful}
        >
          ورود
        </Button>
      </div>
    </div>
  )
}

export default Login
