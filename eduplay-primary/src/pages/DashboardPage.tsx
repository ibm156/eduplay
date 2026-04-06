import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/authStore'
import { gamesApi } from '@/api'
import { Badge } from '@/components/ui/Badge'

const SUBJECT_CONFIG = [
  { icon: '🔢', name: 'Maths', color: 'bg-yellow-100 border-yellow-300', prog: '#FFD93D' },
  { icon: '🔬', name: 'Science', color: 'bg-green-100 border-green-300', prog: '#6BCB77' },
  { icon: '📖', name: 'English', color: 'bg-blue-100 border-blue-300', prog: '#4D96FF' },
  { icon: '🎨', name: 'Art', color: 'bg-pink-100 border-pink-300', prog: '#FF6FC8' },
]

const GAME_CARDS = [
  { icon: '❓', name: 'Quiz Blitz', tag: 'FAST', bg: 'bg-red-50', path: '/games/quiz' },
  { icon: '🃏', name: 'Flashcard Flip', tag: 'LEARN', bg: 'bg-yellow-50', path: '/games/flashcard' },
  { icon: '🔤', name: 'Word Scramble', tag: 'WORDS', bg: 'bg-green-50', path: '/games/scramble' },
  { icon: '🧩', name: 'Match It!', tag: 'PAIRS', bg: 'bg-blue-50', path: '/games/match' },
]

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const { data: leaderboard = [] } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => gamesApi.getLeaderboard(),
  })

  const { data: badges = [] } = useQuery({
    queryKey: ['badges'],
    queryFn: () => gamesApi.getBadges(),
  })

  const firstName = user?.firstName || user?.username || 'Student'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="flex flex-col gap-6">
      {/* Hero */}
      <div className="bg-gradient-to-r from-violet-500 to-indigo-500 rounded-3xl p-5 text-white relative overflow-hidden">
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-6xl opacity-30 select-none">⭐</div>
        <h2 className="font-fredoka text-2xl mb-1">
          {greeting}, {firstName}! 👋
        </h2>
        <p className="text-violet-200 font-semibold text-sm">
          {user?.streak ? `🔥 ${user.streak}-day streak! Keep it up!` : 'Ready to learn something new?'}
        </p>
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div>
          <h3 className="font-fredoka text-xl text-violet-700 mb-3">🏅 Your Badges</h3>
          <div className="flex flex-wrap gap-2">
            {badges.map((b) => (
              <Badge key={b.id} icon={b.icon} label={b.name} color="purple" />
            ))}
          </div>
        </div>
      )}

      {/* Subjects */}
      <div>
        <h3 className="font-fredoka text-xl text-violet-700 mb-3">📚 Subjects</h3>
        <div className="grid grid-cols-2 gap-3">
          {SUBJECT_CONFIG.map((s) => (
            <button
              key={s.name}
              onClick={() => navigate('/subjects')}
              className={`${s.color} border-2 rounded-3xl p-4 text-left transition-transform hover:-translate-y-1 active:translate-y-0 shadow-sm`}
            >
              <div className="text-4xl mb-2">{s.icon}</div>
              <div className="font-extrabold text-gray-800 text-base">{s.name}</div>
              <div className="text-xs text-gray-500 mt-0.5">Tap to explore</div>
            </button>
          ))}
        </div>
      </div>

      {/* Games */}
      <div>
        <h3 className="font-fredoka text-xl text-violet-700 mb-3">🎮 Play a Game</h3>
        <div className="grid grid-cols-2 gap-3">
          {GAME_CARDS.map((g) => (
            <button
              key={g.name}
              onClick={() => navigate(g.path)}
              className={`${g.bg} border-2 border-gray-100 rounded-3xl p-4 text-center transition-transform hover:-translate-y-1 active:translate-y-0 shadow-sm flex flex-col items-center gap-2`}
            >
              <span className="text-4xl">{g.icon}</span>
              <span className="font-extrabold text-gray-800 text-sm">{g.name}</span>
              <span className="bg-violet-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {g.tag}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div>
        <h3 className="font-fredoka text-xl text-violet-700 mb-3">🏆 Leaderboard</h3>
        <div className="bg-white rounded-3xl border-2 border-violet-100 overflow-hidden shadow-sm">
          {leaderboard.slice(0, 5).map((entry, i) => (
            <div
              key={entry.userId}
              className={`flex items-center gap-3 px-4 py-3 ${
                i < leaderboard.length - 1 ? 'border-b border-dashed border-violet-100' : ''
              } ${entry.isCurrentUser ? 'bg-violet-50' : ''}`}
            >
              <span className="font-fredoka text-xl min-w-[28px]">
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
              </span>
              <div className="w-9 h-9 rounded-full bg-violet-200 flex items-center justify-center font-bold text-violet-700 text-sm shrink-0">
                {entry.avatarInitials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-gray-800 truncate">
                  {entry.displayName}
                  {entry.isCurrentUser && (
                    <span className="ml-1 text-xs text-violet-500">(you)</span>
                  )}
                </div>
                <div className="text-xs text-gray-400">{entry.gamesPlayed} games</div>
              </div>
              <span className="font-bold text-violet-600 text-sm">{entry.xp} XP</span>
            </div>
          ))}
          {leaderboard.length === 0 && (
            <div className="text-center py-8 text-gray-400 font-semibold">
              No scores yet — be the first! 🚀
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
