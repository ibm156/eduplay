import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import clsx from 'clsx'

const NAV_ITEMS = [
  { label: 'Home', icon: '🏠', path: '/dashboard' },
  { label: 'Subjects', icon: '📚', path: '/subjects' },
  { label: 'Scores', icon: '🏆', path: '/leaderboard' },
  { label: 'Profile', icon: '👤', path: '/profile' },
]

export const BottomNav: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-lg mx-auto">
      <div className="bg-white border-t-2 border-violet-100 flex items-center justify-around px-2 py-2 rounded-t-3xl shadow-[0_-4px_20px_rgba(109,40,217,0.1)]">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname.startsWith(item.path)
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={clsx(
                'flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl transition-all duration-200',
                isActive
                  ? 'bg-violet-100 text-violet-700'
                  : 'text-gray-400 hover:text-violet-500 hover:bg-violet-50'
              )}
            >
              <span style={{ fontSize: 22 }}>{item.icon}</span>
              <span className="text-[11px] font-bold">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
