import React from 'react'

interface XPBarProps {
  xp: number
  xpPerLevel?: number
}

export const XPBar: React.FC<XPBarProps> = ({ xp, xpPerLevel = 500 }) => {
  const currentLevelXp = xp % xpPerLevel
  const percent = Math.min((currentLevelXp / xpPerLevel) * 100, 100)
  const level = Math.floor(xp / xpPerLevel) + 1

  return (
    <div className="flex items-center gap-2 flex-1">
      <span className="text-xs font-bold text-violet-600 bg-violet-100 px-2 py-0.5 rounded-full whitespace-nowrap">
        Lv {level}
      </span>
      <div className="flex-1 bg-violet-100 rounded-full h-2.5 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-xs font-bold text-gray-500 whitespace-nowrap">
        {currentLevelXp}/{xpPerLevel}
      </span>
    </div>
  )
}
