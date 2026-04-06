import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { gamesApi } from '@/api'

const RANK_ICONS = ['🥇', '🥈', '🥉']

export const LeaderboardPage: React.FC = () => {
  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => gamesApi.getLeaderboard(),
  })

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-fredoka text-2xl text-violet-700">🏆 Leaderboard</h2>
        <p className="text-sm text-gray-500 font-semibold mt-1">See how you rank against your classmates!</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border-2 border-violet-100 overflow-hidden shadow-sm">
          {entries.map((entry, i) => (
            <div
              key={entry.userId}
              className={[
                'flex items-center gap-3 px-4 py-3.5',
                i < entries.length - 1 ? 'border-b border-dashed border-violet-100' : '',
                entry.isCurrentUser ? 'bg-violet-50' : '',
              ].join(' ')}
            >
              <span className="font-fredoka text-xl min-w-[28px] text-center">
                {i < 3 ? RANK_ICONS[i] : `#${i + 1}`}
              </span>

              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                style={{
                  background: entry.isCurrentUser ? '#EDE8FB' : '#F3F4F6',
                  color: entry.isCurrentUser ? '#7C3AED' : '#6B7280',
                }}
              >
                {entry.avatarInitials}
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-800 text-sm truncate">
                  {entry.displayName}
                  {entry.isCurrentUser && (
                    <span className="ml-1 text-xs text-violet-500 font-semibold">(you)</span>
                  )}
                </div>
                <div className="text-xs text-gray-400">{entry.gamesPlayed} games played</div>
              </div>

              <div className="text-right">
                <div className="font-bold text-violet-600">{entry.xp} XP</div>
              </div>
            </div>
          ))}

          {entries.length === 0 && (
            <div className="text-center py-12 text-gray-400 font-semibold">
              No scores yet — play some games! 🎮
            </div>
          )}
        </div>
      )}
    </div>
  )
}
