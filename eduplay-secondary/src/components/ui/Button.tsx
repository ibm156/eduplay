import React from 'react'
import clsx from 'clsx'

type Variant = 'primary' | 'ghost' | 'danger' | 'success'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  loading?: boolean
}

const V: Record<Variant, string> = {
  primary: 'bg-[#6C63FF] text-white hover:bg-[#7C74FF] border border-[#6C63FF]',
  ghost:   'bg-transparent text-[#7B82A0] border border-[#252836] hover:border-[#2E3245] hover:text-[#F0F2FF]',
  danger:  'bg-transparent text-[#FF6B6B] border border-[#FF6B6B]/30 hover:bg-[#FF6B6B]/10',
  success: 'bg-transparent text-[#00D4AA] border border-[#00D4AA]/30 hover:bg-[#00D4AA]/10',
}
const S: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-lg',
  lg: 'px-6 py-3 text-sm rounded-lg',
}

export const Button: React.FC<ButtonProps & { children: React.ReactNode }> = ({
  variant = 'primary', size = 'md', fullWidth, loading, className, disabled, children, ...rest
}) => (
  <button
    className={clsx(
      'font-dm font-semibold transition-all duration-150 active:scale-[0.97] select-none',
      V[variant], S[size],
      fullWidth && 'w-full',
      (disabled || loading) && 'opacity-40 cursor-not-allowed',
      className,
    )}
    disabled={disabled || loading}
    {...rest}
  >
    {loading
      ? <span className="flex items-center justify-center gap-2">
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
          Loading...
        </span>
      : children}
  </button>
)
