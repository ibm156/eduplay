import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/authStore'
import { gamesApi } from '@/api'
import { XPBar } from '@/components/ui/XPBar'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

const GAME_ICONS: Record<string, string> = {
  quiz: '❓',
  flashcard: '🃏',
  scramble: '🔤',
  match: '🧩',
}

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuthStore()

  const { data: history = [] } = useQuery({
    queryKey: ['history'],
    queryFn: gamesApi.getHistory,
  })

  const { data: badges = [] } = useQuery({
    queryKey: ['badges'],
    queryFn: gamesApi.getBadges,
  })

  if (!user) return null

  const totalGames = history.length
  const avgScore = totalGames > 0
    ? Math.round(history.reduce((s, g) => s + g.score / g.total, 0) / totalGames * 100)
    : 0

  return (
    <div className="flex flex-col gap-6">
      {/* Avatar & name */}
      <div className="bg-gradient-to-r from-violet-500 to-indigo-500 rounded-3xl p-6 text-white text-center">
        <div className="w-20 h-20 rounded-full bg-yellow-300 border-4 border-white mx-auto mb-3 flex items-center justify-center text-4xl">
          🐸
        </div>
        <h2 className="font-fredoka text-2xl">{user.firstName} {user.lastName}</h2>
        <p className="text-violet-200 font-semibold text-sm mt-0.5">@{user.username}</p>
        <div className="mt-4 px-4">
          <XPBar xp={user.xp} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total XP', value: user.xp },
          { label: 'Games', value: totalGames },
          { label: 'Avg Score', value: `${avgScore}%` },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border-2 border-violet-100 py-4 text-center shadow-sm">
            <div className="font-fredoka text-2xl text-violet-600">{s.value}</div>
            <div className="text-xs text-gray-400 font-semibold mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Streak */}
      {user.streak > 0 && (
        <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4 flex items-center gap-3">
          <span className="text-3xl">🔥</span>
          <div>
            <div className="font-bold text-orange-700">{user.streak}-day streak!</div>
            <div className="text-xs text-orange-500">Keep playing every day</div>
          </div>
        </div>
      )}

      {/* Badges */}
      {badges.length > 0 && (
        <div>
          <h3 className="font-fredoka text-xl text-violet-700 mb-3">🏅 Badges Earned</h3>
          <div className="flex flex-wrap gap-2">
            {badges.map((b) => (
              <Badge key={b.id} icon={b.icon} label={b.name} />
            ))}
          </div>
        </div>
      )}

      {/* Recent games */}
      {history.length > 0 && (
        <div>
          <h3 className="font-fredoka text-xl text-violet-700 mb-3">📋 Recent Games</h3>
          <div className="flex flex-col gap-2">
            {history.slice(0, 8).map((session) => (
              <div
                key={session.id}
                className="bg-white border-2 border-gray-100 rounded-2xl px-4 py-3 flex items-center gap-3"
              >
                <span className="text-2xl">{GAME_ICONS[session.gameType] ?? '🎮'}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-gray-700 capitalize">{session.gameType}</div>
                  <div className="text-xs text-gray-400">
                    {new Date(session.completedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm text-gray-700">
                    {session.score}/{session.total}
                  </div>
                  <div className="text-xs text-violet-500 font-semibold">+{session.xpEarned} XP</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Logout */}
      <Button variant="ghost" fullWidth onClick={() => logout()}>
        Sign out
      </Button>
    </div>
  )
}
