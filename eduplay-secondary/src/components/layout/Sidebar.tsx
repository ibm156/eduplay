import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { useAuthStore } from '@/stores/authStore'
import { XPBar } from '@/components/ui/index'

const NAV = [
  { label: 'Dashboard', path: '/dashboard', icon: <GridIcon /> },
  { label: 'Subjects',  path: '/subjects',  icon: <ListIcon /> },
  { label: 'Games',     path: '/games',     icon: <GameIcon /> },
  { label: 'Scores',    path: '/leaderboard', icon: <StarIcon /> },
  { label: 'Profile',   path: '/profile',   icon: <UserIcon /> },
]

function initials(user: { firstName: string; lastName: string }) {
  return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
}

export const Sidebar: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  return (
    <aside className="w-[180px] shrink-0 bg-[#13161D] border-r border-[#252836] flex flex-col min-h-0">
      {/* Logo */}
      <div className="px-4 pt-5 pb-4 border-b border-[#252836]">
        <div className="font-syne text-[20px] font-bold text-[#F0F2FF] tracking-tight">
          Edu<span className="text-[#6C63FF]">Play</span>
        </div>
        <div className="font-mono text-[10px] text-[#3A3F5C] mt-0.5">v2 · SECONDARY</div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 p-2 flex-1">
        {NAV.map((item) => {
          const active = location.pathname.startsWith(item.path)
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={clsx(
                'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 text-left border-l-2',
                active
                  ? 'text-[#6C63FF] bg-[#6C63FF]/08 border-l-[#6C63FF]'
                  : 'text-[#7B82A0] border-l-transparent hover:text-[#F0F2FF] hover:bg-white/[0.03]',
              )}
            >
              <span className={clsx('shrink-0', active ? 'text-[#6C63FF]' : 'text-[#7B82A0]')}>
                {item.icon}
              </span>
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* User footer */}
      {user && (
        <div
          className="p-3 border-t border-[#252836] cursor-pointer hover:bg-white/[0.02] transition-colors"
          onClick={() => navigate('/profile')}
        >
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#6C63FF]/20 flex items-center justify-center text-[11px] font-semibold text-[#9B87FF] shrink-0">
              {initials(user)}
            </div>
            <div className="min-w-0">
              <div className="text-[12px] font-semibold text-[#F0F2FF] truncate">{user.firstName} {user.lastName[0]}.</div>
              <div className="font-mono text-[10px] text-[#7B82A0]">{user.yearGroup ?? 'Student'}</div>
            </div>
          </div>
          <XPBar xp={user.xp} compact />
        </div>
      )}
    </aside>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function GridIcon() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.9"/><rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.4"/><rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.4"/><rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.4"/></svg>
}
function ListIcon() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h12M2 12h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
}
function GameIcon() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="4" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M5.5 8.5h2M6.5 7.5v2M10.5 8.5h.01M12 8.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
}
function StarIcon() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1L2 5.3l4.2-.7L8 1z" stroke="currentColor" strokeWidth="1.2"/></svg>
}
function UserIcon() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/><path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
}
