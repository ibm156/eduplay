import React from 'react'
import clsx from 'clsx'

interface BadgeProps {
  icon: string
  label: string
  color?: 'purple' | 'yellow' | 'green' | 'red' | 'blue'
  size?: 'sm' | 'md'
}

const colorMap = {
  purple: 'bg-violet-100 text-violet-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  green: 'bg-green-100 text-green-800',
  red: 'bg-red-100 text-red-800',
  blue: 'bg-blue-100 text-blue-800',
}

export const Badge: React.FC<BadgeProps> = ({ icon, label, color = 'purple', size = 'md' }) => {
  return (
    <div
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-2xl font-bold',
        colorMap[color],
        size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'
      )}
    >
      <span style={{ fontSize: size === 'sm' ? 14 : 18 }}>{icon}</span>
      {label}
    </div>
  )
}
