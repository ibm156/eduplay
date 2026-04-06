import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/authStore'
import { gamesApi } from '@/api'
import { XPBar, Badge } from '@/components/ui/index'
import { Button } from '@/components/ui/Button'

const GAME_LABELS: Record<string, string> = {
  quiz: 'Quiz Blitz', flashcard: 'Flashcard Flip', scramble: 'Word Scramble', match: 'Match It',
}
const GAME_ICONS: Record<string, string> = {
  quiz: '❓', flashcard: '🃏', scramble: '🔤', match: '🧩',
}

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuthStore()

  const { data: history = [] } = useQuery({ queryKey: ['history'], queryFn: gamesApi.getHistory })
  const { data: badges = [] }  = useQuery({ queryKey: ['badges'],  queryFn: gamesApi.getBadges  })

  if (!user) return null

  const totalGames = history.length
  const avgAcc = totalGames > 0
    ? Math.round(history.reduce((s, g) => s + g.score / g.total, 0) / totalGames * 100)
    : 0
  const totalXpFromGames = history.reduce((s, g) => s + g.xpEarned, 0)

  return (
    <div className="flex flex-col gap-6 animate-fade-up">
      {/* Header card */}
      <div className="bg-[#191C26] border border-[#252836] rounded-xl p-6">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-xl bg-[#6C63FF]/20 flex items-center justify-center font-syne text-[18px] font-bold text-[#9B87FF] shrink-0">
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <div>
            <h1 className="font-syne text-[20px] font-bold text-[#F0F2FF]">
              {user.firstName} {user.lastName}
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-[12px] text-[#7B82A0]">@{user.username}</span>
              <span className="font-mono text-[10px] bg-[#6C63FF]/15 text-[#9B87FF] px-1.5 py-0.5 rounded">
                {user.yearGroup ?? 'Year 9'}
              </span>
            </div>
          </div>
        </div>
        <XPBar xp={user.xp} />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#191C26] border border-[#252836] rounded-xl p-4 text-center">
          <div className="font-syne text-[22px] font-bold text-[#6C63FF]">{user.xp.toLocaleString()}</div>
          <div className="font-mono text-[11px] text-[#7B82A0] mt-0.5">total XP</div>
        </div>
        <div className="bg-[#191C26] border border-[#252836] rounded-xl p-4 text-center">
          <div className="font-syne text-[22px] font-bold text-[#00D4AA]">{avgAcc}%</div>
          <div className="font-mono text-[11px] text-[#7B82A0] mt-0.5">accuracy</div>
        </div>
        <div className="bg-[#191C26] border border-[#252836] rounded-xl p-4 text-center">
          <div className="font-syne text-[22px] font-bold text-[#F5A623]">{user.streak}</div>
          <div className="font-mono text-[11px] text-[#7B82A0] mt-0.5">day streak 🔥</div>
        </div>
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div>
          <h2 className="font-syne text-[15px] font-bold text-[#F0F2FF] mb-3">Badges</h2>
          <div className="bg-[#191C26] border border-[#252836] rounded-xl p-4">
            <div className="flex flex-wrap gap-2">
              {badges.map((b) => (
                <div key={b.id} className="flex items-center gap-2 bg-[#0D0F14] border border-[#252836] rounded-lg px-3 py-2">
                  <span style={{ fontSize: 18 }}>{b.icon}</span>
                  <div>
                    <div className="text-[12px] font-semibold text-[#F0F2FF]">{b.name}</div>
                    <div className="font-mono text-[10px] text-[#7B82A0]">{b.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Game history */}
      {history.length > 0 && (
        <div>
          <h2 className="font-syne text-[15px] font-bold text-[#F0F2FF] mb-3">Game history</h2>
          <div className="bg-[#191C26] border border-[#252836] rounded-xl overflow-hidden">
            {history.slice(0, 10).map((s, i) => {
              const pct = Math.round((s.score / s.total) * 100)
              return (
                <div
                  key={s.id}
                  className={[
                    'flex items-center gap-3 px-4 py-3.5',
                    i < history.length - 1 ? 'border-b border-[#252836]' : '',
                  ].join(' ')}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#6C63FF]/10 flex items-center justify-center text-base shrink-0">
                    {GAME_ICONS[s.gameType] ?? '🎮'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[13px] text-[#F0F2FF]">
                      {GAME_LABELS[s.gameType] ?? s.gameType}
                    </div>
                    <div className="font-mono text-[11px] text-[#7B82A0]">
                      {new Date(s.completedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-[13px] text-[#F0F2FF]">
                      {s.score}/{s.total}
                      <span className={`ml-1 text-[11px] ${pct >= 80 ? 'text-[#00D4AA]' : pct >= 60 ? 'text-[#F5A623]' : 'text-[#FF6B6B]'}`}>
                        ({pct}%)
                      </span>
                    </div>
                    <div className="font-mono text-[11px] text-[#6C63FF]">+{s.xpEarned} XP</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Sign out */}
      <Button variant="ghost" fullWidth onClick={() => logout()}>
        Sign out
      </Button>
    </div>
  )
}
