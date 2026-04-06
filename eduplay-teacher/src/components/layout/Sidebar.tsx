import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { useAuthStore } from '@/stores/authStore'

const NAV = [
  { label: 'Overview',    path: '/dashboard',  icon: '▦' },
  { label: 'Students',    path: '/students',   icon: '◈' },
  { label: 'Content',     path: '/content',    icon: '◧' },
  { label: 'Analytics',   path: '/analytics',  icon: '◉' },
]

export const Sidebar: React.FC = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || user.username.slice(0, 2).toUpperCase()
    : 'T'

  return (
    <aside className="w-[200px] shrink-0 bg-[#111318] border-r border-[#1E2330] flex flex-col min-h-0">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-[#1E2330]">
        <div className="font-syne text-[18px] font-bold text-[#E8ECF4]">
          Edu<span className="text-[#3B82F6]">Play</span>
        </div>
        <div className="font-mono text-[10px] text-[#2A3149] mt-0.5 uppercase tracking-widest">
          Teacher Portal
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 p-2.5 flex-1">
        {NAV.map((item) => {
          const active = pathname.startsWith(item.path)
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all text-left border-l-2',
                active
                  ? 'text-[#3B82F6] bg-[#3B82F6]/08 border-l-[#3B82F6]'
                  : 'text-[#6B7694] border-l-transparent hover:text-[#E8ECF4] hover:bg-white/[0.03]',
              )}
            >
              <span className="text-base leading-none">{item.icon}</span>
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-[#1E2330]">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/20 flex items-center justify-center text-[11px] font-semibold text-[#60A5FA] shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[12px] font-semibold text-[#E8ECF4] truncate">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="font-mono text-[10px] text-[#6B7694] capitalize">{user?.role}</div>
          </div>
        </div>
        <button
          onClick={() => logout()}
          className="w-full text-left text-xs text-[#6B7694] hover:text-[#EF4444] transition-colors font-mono py-1"
        >
          Sign out →
        </button>
      </div>
    </aside>
  )
}
