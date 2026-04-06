import React from 'react'
import clsx from 'clsx'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  loading?: boolean
  children: React.ReactNode
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-violet-500 text-white hover:bg-violet-600 active:bg-violet-700 shadow-[0_4px_0_#6d28d9]',
  secondary: 'bg-yellow-400 text-yellow-900 hover:bg-yellow-500 active:bg-yellow-600 shadow-[0_4px_0_#b45309]',
  ghost: 'bg-violet-100 text-violet-700 hover:bg-violet-200 active:bg-violet-300',
  danger: 'bg-red-400 text-white hover:bg-red-500 active:bg-red-600 shadow-[0_4px_0_#b91c1c]',
}

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-xl',
  md: 'px-5 py-3 text-base rounded-2xl',
  lg: 'px-8 py-4 text-lg rounded-2xl',
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  className,
  disabled,
  children,
  ...rest
}) => {
  return (
    <button
      className={clsx(
        'font-nunito font-800 transition-all duration-150 active:translate-y-1 active:shadow-none select-none',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        (disabled || loading) && 'opacity-60 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  )
}
