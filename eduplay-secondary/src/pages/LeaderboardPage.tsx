import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { gamesApi } from '@/api'

export const LeaderboardPage: React.FC = () => {
  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: gamesApi.getLeaderboard,
  })

  const maxXp = entries[0]?.xp ?? 1

  return (
    <div className="flex flex-col gap-5 animate-fade-up">
      <div>
        <h1 className="font-syne text-[22px] font-bold text-[#F0F2FF] mb-0.5">Leaderboard</h1>
        <p className="text-sm text-[#7B82A0]">Year 9 — ranked by total XP</p>
      </div>

      {/* Top 3 podium */}
      {entries.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 mb-2">
          {[entries[1], entries[0], entries[2]].map((e, i) => {
            const isFirst = i === 1
            const colors = ['#7B82A0', '#F5A623', '#CD7C2F']
            const medals = ['🥈', '🥇', '🥉']
            return (
              <div
                key={e.userId}
                className={[
                  'bg-[#191C26] border rounded-xl p-4 text-center flex flex-col items-center gap-2',
                  isFirst ? 'border-[#F5A623]/30 -translate-y-2' : 'border-[#252836]',
                ].join(' ')}
              >
                <span className="text-2xl">{medals[i]}</span>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-[12px] font-bold"
                  style={{ background: `${colors[i]}20`, color: colors[i] }}
                >
                  {e.avatarInitials}
                </div>
                <div className="text-[13px] font-semibold text-[#F0F2FF] truncate w-full">{e.displayName}</div>
                <div className="font-mono text-[12px]" style={{ color: colors[i] }}>
                  {e.xp.toLocaleString()} XP
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Full table */}
      <div className="bg-[#191C26] border border-[#252836] rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-6 flex flex-col gap-3">
            {[1,2,3,4,5].map((i) => <div key={i} className="h-12 bg-[#252836] rounded-lg animate-pulse" />)}
          </div>
        ) : (
          entries.map((e, i) => (
            <div
              key={e.userId}
              className={[
                'flex items-center gap-3 px-4 py-3.5',
                i < entries.length - 1 ? 'border-b border-[#252836]' : '',
                e.isCurrentUser ? 'bg-[#6C63FF]/06' : '',
              ].join(' ')}
            >
              <span className="font-mono text-[12px] text-[#7B82A0] w-6 text-center shrink-0">
                #{e.rank}
              </span>

              <div className="w-9 h-9 rounded-lg bg-[#252836] flex items-center justify-center text-[12px] font-semibold text-[#7B82A0] shrink-0">
                {e.avatarInitials}
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-medium text-[14px] text-[#F0F2FF] flex items-center gap-2">
                  {e.displayName}
                  {e.isCurrentUser && (
                    <span className="font-mono text-[10px] bg-[#6C63FF]/15 text-[#9B87FF] px-1.5 py-0.5 rounded">you</span>
                  )}
                </div>
                <div className="font-mono text-[11px] text-[#7B82A0]">
                  {e.yearGroup ?? 'Year 9'} · {e.gamesPlayed} games
                </div>
              </div>

              <div className="text-right">
                <div className="font-mono text-[13px] font-medium text-[#6C63FF]">
                  {e.xp.toLocaleString()}
                </div>
                {/* Mini bar */}
                <div className="w-16 bg-[#252836] rounded-full h-1 mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#6C63FF] transition-all duration-700"
                    style={{ width: `${(e.xp / maxXp) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))
        )}

        {entries.length === 0 && !isLoading && (
          <div className="text-center py-12 text-[#7B82A0] text-sm">
            No scores yet — be the first to play!
          </div>
        )}
      </div>
    </div>
  )
}
