import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/authStore'
import { gamesApi } from '@/api'
import { StatCard, Badge } from '@/components/ui/index'

const GAME_ICONS: Record<string, string> = { quiz: '❓', flashcard: '🃏', scramble: '🔤', match: '🧩' }
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const { data: leaderboard = [] } = useQuery({ queryKey: ['leaderboard'], queryFn: gamesApi.getLeaderboard })
  const { data: history = [] } = useQuery({ queryKey: ['history'], queryFn: gamesApi.getHistory })
  const { data: badges = [] } = useQuery({ queryKey: ['badges'], queryFn: gamesApi.getBadges })

  if (!user) return null

  const totalGames = history.length
  const avgAcc = totalGames > 0
    ? Math.round(history.reduce((s, g) => s + g.score / g.total, 0) / totalGames * 100)
    : 0
  const myRank = leaderboard.find((e) => e.isCurrentUser)?.rank ?? '—'
  const streak = user.streak ?? 0

  return (
    <div className="flex flex-col gap-6 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="font-syne text-[22px] font-bold text-[#F0F2FF] mb-0.5">
          {greeting}, {user.firstName}
        </h1>
        <p className="text-sm text-[#7B82A0]">
          {user.yearGroup} · {totalGames} games played this term
        </p>
      </div>

      {/* Streak */}
      <div className="bg-[#191C26] border border-[#252836] rounded-xl p-4 flex items-center gap-4">
        <span className="text-3xl">🔥</span>
        <div className="flex-1">
          <div className="font-syne text-[18px] font-bold text-[#F5A623]">{streak}-day streak</div>
          <div className="font-mono text-[11px] text-[#7B82A0]">keep it going</div>
        </div>
        <div className="flex gap-1.5">
          {DAYS.map((d, i) => {
            const done = i < (streak % 7)
            const today = i === (streak % 7)
            return (
              <div key={i} className={[
                'w-6 h-6 rounded-full flex items-center justify-center font-mono text-[9px] border',
                today ? 'bg-[#F5A623] border-[#F5A623] text-white' :
                done  ? 'bg-[#F5A623]/20 border-[#F5A623]/40 text-[#F5A623]' :
                        'bg-[#252836] border-[#252836] text-[#3A3F5C]',
              ].join(' ')}>
                {d}
              </div>
            )
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard label="total xp"   value={user.xp.toLocaleString()} delta="+120 this week" deltaUp accent="#6C63FF" />
        <StatCard label="accuracy"   value={`${avgAcc}%`}             delta="+3% avg"        deltaUp accent="#00D4AA" />
        <StatCard label="games"      value={totalGames}                delta="this term"            accent="#F5A623" />
        <StatCard label="class rank" value={`#${myRank}`}             delta="↑ up 2"         deltaUp accent="#9B87FF" />
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div>
          <h2 className="font-syne text-[15px] font-bold text-[#F0F2FF] mb-3">Badges</h2>
          <div className="flex flex-wrap gap-2">
            {badges.map((b) => (
              <Badge key={b.id} label={b.name} icon={b.icon} color="purple" />
            ))}
          </div>
        </div>
      )}

      {/* Recent activity + Leaderboard side by side */}
      <div className="grid grid-cols-2 gap-4">
        {/* Activity */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-syne text-[15px] font-bold text-[#F0F2FF]">Recent activity</h2>
            <button onClick={() => navigate('/profile')} className="font-mono text-[11px] text-[#6C63FF] hover:text-[#9B87FF]">
              view all →
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {history.slice(0, 4).map((s) => (
              <div key={s.id} className="bg-[#191C26] border border-[#252836] rounded-xl px-3.5 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base bg-[#6C63FF]/10 shrink-0">
                  {GAME_ICONS[s.gameType] ?? '🎮'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-[#F0F2FF] capitalize">{s.gameType}</div>
                  <div className="font-mono text-[11px] text-[#7B82A0]">{s.score}/{s.total} correct</div>
                </div>
                <div className="font-mono text-[12px] text-[#6C63FF]">+{s.xpEarned}</div>
              </div>
            ))}
            {history.length === 0 && (
              <p className="text-sm text-[#7B82A0] text-center py-6">No games yet — start playing!</p>
            )}
          </div>
        </div>

        {/* Leaderboard */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-syne text-[15px] font-bold text-[#F0F2FF]">Leaderboard</h2>
            <button onClick={() => navigate('/leaderboard')} className="font-mono text-[11px] text-[#6C63FF] hover:text-[#9B87FF]">
              full board →
            </button>
          </div>
          <div className="bg-[#191C26] border border-[#252836] rounded-xl overflow-hidden">
            {leaderboard.slice(0, 5).map((e, i) => (
              <div key={e.userId} className={[
                'flex items-center gap-3 px-3.5 py-3',
                i < leaderboard.length - 1 ? 'border-b border-[#252836]' : '',
                e.isCurrentUser ? 'bg-[#6C63FF]/06' : '',
              ].join(' ')}>
                <span className="font-mono text-[12px] text-[#7B82A0] w-5 text-center">#{e.rank}</span>
                <div className="w-7 h-7 rounded-lg bg-[#252836] flex items-center justify-center text-[11px] font-semibold text-[#7B82A0] shrink-0">
                  {e.avatarInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-[#F0F2FF] truncate">
                    {e.displayName}
                    {e.isCurrentUser && <span className="ml-1 text-[11px] text-[#6C63FF]">(you)</span>}
                  </div>
                </div>
                <span className="font-mono text-[12px] text-[#6C63FF]">{e.xp.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-syne text-[15px] font-bold text-[#F0F2FF] mb-3">Quick play</h2>
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: '❓', label: 'Quiz Blitz',     sub: 'up to +60 XP', path: '/games/quiz'      },
            { icon: '🃏', label: 'Flashcard Flip', sub: 'up to +30 XP', path: '/games/flashcard' },
            { icon: '🔤', label: 'Word Scramble',  sub: 'up to +45 XP', path: '/games/scramble'  },
            { icon: '🧩', label: 'Match It',       sub: 'up to +40 XP', path: '/games/match'     },
          ].map((g) => (
            <button
              key={g.label}
              onClick={() => navigate(g.path)}
              className="bg-[#191C26] border border-[#252836] rounded-xl p-4 text-center hover:border-[#2E3245] transition-all hover:-translate-y-0.5"
            >
              <div className="text-2xl mb-2">{g.icon}</div>
              <div className="text-[13px] font-semibold text-[#F0F2FF] mb-1">{g.label}</div>
              <div className="font-mono text-[11px] text-[#6C63FF]">{g.sub}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
