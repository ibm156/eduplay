import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { useAuthStore } from '@/stores/authStore'
import { XPBar } from '@/components/ui/XPBar'

export const AppShell: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen bg-[#F7F3FF] font-nunito">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white border-b-2 border-violet-100 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <span className="font-fredoka text-2xl text-violet-600">
            Edu<span className="text-red-400">Play</span>
          </span>
          {user && <XPBar xp={user.xp} />}
          <div className="w-9 h-9 rounded-full bg-yellow-300 border-2 border-white shadow flex items-center justify-center text-lg shrink-0">
            🐸
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-lg mx-auto px-4 pt-4 pb-28">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  )
}
