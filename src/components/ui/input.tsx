import * as React from 'react'
import { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: ReactNode
  endIcon?: ReactNode
  startIconClassName?: string
  containerClassName?: string
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      containerClassName,
      className,
      type,
      startIcon,
      endIcon,
      error,
      startIconClassName,
      ...props
    },
    ref,
  ) => {
    const StartIcon = startIcon
    const EndIcon = endIcon

    return (
      <div className={cn('relative w-full', containerClassName)}>
        {StartIcon && (
          <div
            className={cn(
              'absolute font-fa-num left-3 top-1/2 -translate-y-1/2',
              startIconClassName,
            )}
          >
            {StartIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            'file:text-black placeholder:text-muted-foreground font-fa-num selection:bg-primary selection:text-primary-foreground border-border flex h-[67px] md:h-[56px] w-full min-w-0 rounded-[16px] border bg-transparent px-3 py-1 text-lg placeholder:text-lg text-secondary-foreground placeholder:text-secondary-foreground shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 ',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[2px]',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
            startIcon ? 'pl-8' : '',
            endIcon ? 'pr-8' : '',
            error
              ? 'border-border-error focus-visible:border-border-error focus-visible:shadow-ringError'
              : 'focus-visible:border-border-brand focus-visible:shadow-ringBrand',
            className,
          )}
          ref={ref}
          {...props}
        />
        {EndIcon && <div className="absolute right-3 top-1/2 -translate-y-1/2">{EndIcon}</div>}
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    )
  },
)

function InputSecondary({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-black placeholder:text-black placeholder:font-medium selection:bg-primary selection:text-primary-foreground border-border flex h-[67px] md:h-[56px] w-full min-w-0 rounded-[16px] border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-lg',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  )
}

export { InputSecondary }

export default Input
