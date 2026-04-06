import React from 'react'
import clsx from 'clsx'

// ─── Badge ───────────────────────────────────────────────────────────────────
type BadgeColor = 'purple' | 'green' | 'amber' | 'red' | 'blue' | 'gray'

const BC: Record<BadgeColor, string> = {
  purple: 'bg-[#6C63FF]/15 text-[#9B87FF]',
  green:  'bg-[#00D4AA]/12 text-[#00D4AA]',
  amber:  'bg-[#F5A623]/15 text-[#F5A623]',
  red:    'bg-[#FF6B6B]/15 text-[#FF6B6B]',
  blue:   'bg-[#4DA6FF]/15 text-[#4DA6FF]',
  gray:   'bg-[#7B82A0]/15 text-[#7B82A0]',
}

interface BadgeProps {
  label: string
  color?: BadgeColor
  icon?: string
  mono?: boolean
}

export const Badge: React.FC<BadgeProps> = ({ label, color = 'purple', icon, mono }) => (
  <span className={clsx(
    'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold',
    mono && 'font-mono',
    BC[color],
  )}>
    {icon && <span style={{ fontSize: 12 }}>{icon}</span>}
    {label}
  </span>
)

// ─── StatCard ────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string
  value: string | number
  delta?: string
  deltaUp?: boolean
  accent?: string
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, delta, deltaUp, accent = '#6C63FF' }) => (
  <div className="bg-[#191C26] border border-[#252836] rounded-xl p-3.5">
    <div className="font-syne text-[22px] font-bold leading-tight mb-1" style={{ color: accent }}>
      {value}
    </div>
    <div className="text-[11px] font-mono text-[#7B82A0] mb-1">{label}</div>
    {delta && (
      <div className={clsx('text-[11px] font-semibold', deltaUp ? 'text-[#00D4AA]' : 'text-[#7B82A0]')}>
        {deltaUp ? '↑' : '–'} {delta}
      </div>
    )}
  </div>
)

// ─── XPBar ───────────────────────────────────────────────────────────────────
interface XPBarProps { xp: number; xpPerLevel?: number; compact?: boolean }

export const XPBar: React.FC<XPBarProps> = ({ xp, xpPerLevel = 500, compact }) => {
  const levelXp = xp % xpPerLevel
  const pct = Math.min((levelXp / xpPerLevel) * 100, 100)
  const level = Math.floor(xp / xpPerLevel) + 1

  if (compact) {
    return (
      <div className="flex items-center gap-2 flex-1">
        <span className="text-[11px] font-mono text-[#6C63FF] shrink-0">Lv {level}</span>
        <div className="flex-1 bg-[#252836] rounded-full h-1.5 overflow-hidden">
          <div className="h-full rounded-full bg-[#6C63FF] transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-[11px] font-mono text-[#7B82A0] shrink-0">{xp} XP</span>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="text-xs font-mono text-[#6C63FF]">Level {level}</span>
        <span className="text-xs font-mono text-[#7B82A0]">{levelXp} / {xpPerLevel} XP</span>
      </div>
      <div className="bg-[#252836] rounded-full h-2 overflow-hidden">
        <div className="h-full rounded-full bg-[#6C63FF] transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
