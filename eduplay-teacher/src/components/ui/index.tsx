import React from 'react'
import clsx from 'clsx'

// ─── Button ──────────────────────────────────────────────────────────────────
type BtnVariant = 'primary' | 'ghost' | 'danger' | 'success' | 'warning'
type BtnSize = 'sm' | 'md' | 'lg'

const BV: Record<BtnVariant, string> = {
  primary: 'bg-[#3B82F6] text-white hover:bg-[#2563EB] border border-[#3B82F6]',
  ghost:   'bg-transparent text-[#6B7694] border border-[#1E2330] hover:border-[#262D3D] hover:text-[#E8ECF4]',
  danger:  'bg-transparent text-[#EF4444] border border-[#EF4444]/30 hover:bg-[#EF4444]/10',
  success: 'bg-transparent text-[#10B981] border border-[#10B981]/30 hover:bg-[#10B981]/10',
  warning: 'bg-transparent text-[#F59E0B] border border-[#F59E0B]/30 hover:bg-[#F59E0B]/10',
}
const BS: Record<BtnSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-5 py-2.5 text-sm rounded-lg',
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant; size?: BtnSize; fullWidth?: boolean; loading?: boolean; icon?: React.ReactNode
}
export const Button: React.FC<ButtonProps & { children: React.ReactNode }> = ({
  variant = 'primary', size = 'md', fullWidth, loading, icon, className, disabled, children, ...rest
}) => (
  <button className={clsx('font-medium transition-all duration-150 active:scale-[0.97] select-none inline-flex items-center justify-center gap-2', BV[variant], BS[size], fullWidth && 'w-full', (disabled || loading) && 'opacity-40 cursor-not-allowed', className)} disabled={disabled || loading} {...rest}>
    {loading ? <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : icon}
    {children}
  </button>
)

// ─── Badge ───────────────────────────────────────────────────────────────────
type BadgeColor = 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'gray'
const BC: Record<BadgeColor, string> = {
  blue:   'bg-[#3B82F6]/12 text-[#60A5FA]',
  green:  'bg-[#10B981]/12 text-[#34D399]',
  amber:  'bg-[#F59E0B]/12 text-[#FCD34D]',
  red:    'bg-[#EF4444]/12 text-[#F87171]',
  purple: 'bg-[#8B5CF6]/12 text-[#A78BFA]',
  gray:   'bg-[#6B7694]/12 text-[#6B7694]',
}
interface BadgeProps { label: string; color?: BadgeColor; dot?: boolean }
export const Badge: React.FC<BadgeProps> = ({ label, color = 'blue', dot }) => (
  <span className={clsx('inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium font-mono', BC[color])}>
    {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
    {label}
  </span>
)

// ─── StatCard ────────────────────────────────────────────────────────────────
interface StatCardProps { label: string; value: string | number; delta?: string; deltaUp?: boolean; accent?: string; icon?: string }
export const StatCard: React.FC<StatCardProps> = ({ label, value, delta, deltaUp, accent = '#3B82F6', icon }) => (
  <div className="bg-[#161A22] border border-[#1E2330] rounded-xl p-4">
    <div className="flex items-start justify-between mb-3">
      <div className="text-xs font-mono text-[#6B7694] uppercase tracking-wider">{label}</div>
      {icon && <span className="text-lg">{icon}</span>}
    </div>
    <div className="font-syne text-[26px] font-bold leading-none mb-2" style={{ color: accent }}>{value}</div>
    {delta && (
      <div className={clsx('text-xs font-medium', deltaUp ? 'text-[#10B981]' : 'text-[#6B7694]')}>
        {deltaUp ? '↑' : '→'} {delta}
      </div>
    )}
  </div>
)

// ─── Modal ───────────────────────────────────────────────────────────────────
interface ModalProps { open: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: 'sm' | 'md' | 'lg' }
export const Modal: React.FC<ModalProps> = ({ open, onClose, title, children, size = 'md' }) => {
  if (!open) return null
  const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={onClose}>
      <div className={clsx('bg-[#161A22] border border-[#1E2330] rounded-2xl w-full shadow-2xl animate-fade-up', widths[size])} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E2330]">
          <h2 className="font-syne text-[16px] font-bold text-[#E8ECF4]">{title}</h2>
          <button onClick={onClose} className="text-[#6B7694] hover:text-[#E8ECF4] transition-colors text-lg leading-none">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

// ─── Input ───────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { label?: string; error?: string }
export const Input: React.FC<InputProps> = ({ label, error, className, ...rest }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-xs font-mono text-[#6B7694] uppercase tracking-wider">{label}</label>}
    <input className={clsx('w-full px-3.5 py-2.5 rounded-lg bg-[#0A0C10] border text-[#E8ECF4] text-sm placeholder:text-[#2A3149] focus:outline-none transition-colors', error ? 'border-[#EF4444]/50 focus:border-[#EF4444]' : 'border-[#1E2330] focus:border-[#3B82F6]', className)} {...rest} />
    {error && <span className="text-xs text-[#EF4444]">{error}</span>}
  </div>
)

// ─── Textarea ────────────────────────────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { label?: string }
export const Textarea: React.FC<TextareaProps> = ({ label, className, ...rest }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-xs font-mono text-[#6B7694] uppercase tracking-wider">{label}</label>}
    <textarea className={clsx('w-full px-3.5 py-2.5 rounded-lg bg-[#0A0C10] border border-[#1E2330] text-[#E8ECF4] text-sm placeholder:text-[#2A3149] focus:outline-none focus:border-[#3B82F6] transition-colors resize-none', className)} {...rest} />
  </div>
)

// ─── Select ──────────────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { label?: string; options: { value: string | number; label: string }[] }
export const Select: React.FC<SelectProps> = ({ label, options, className, ...rest }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-xs font-mono text-[#6B7694] uppercase tracking-wider">{label}</label>}
    <select className={clsx('w-full px-3.5 py-2.5 rounded-lg bg-[#0A0C10] border border-[#1E2330] text-[#E8ECF4] text-sm focus:outline-none focus:border-[#3B82F6] transition-colors', className)} {...rest}>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
)

// ─── EmptyState ──────────────────────────────────────────────────────────────
export const EmptyState: React.FC<{ icon: string; title: string; description: string; action?: React.ReactNode }> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="text-5xl mb-4">{icon}</div>
    <div className="font-syne text-[16px] font-bold text-[#E8ECF4] mb-2">{title}</div>
    <div className="text-sm text-[#6B7694] mb-6 max-w-xs">{description}</div>
    {action}
  </div>
)

// ─── Confirm Dialog ──────────────────────────────────────────────────────────
interface ConfirmProps { open: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void; loading?: boolean }
export const ConfirmDialog: React.FC<ConfirmProps> = ({ open, title, message, onConfirm, onCancel, loading }) => (
  <Modal open={open} onClose={onCancel} title={title} size="sm">
    <p className="text-sm text-[#6B7694] mb-6">{message}</p>
    <div className="flex gap-3 justify-end">
      <Button variant="ghost" onClick={onCancel}>Cancel</Button>
      <Button variant="danger" onClick={onConfirm} loading={loading}>Delete</Button>
    </div>
  </Modal>
)
