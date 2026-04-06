import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { analyticsApi } from '@/api'
import { StatCard, Badge } from '@/components/ui/index'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'

const GAME_ICONS: Record<string, string> = { quiz: '❓', flashcard: '🃏', scramble: '🔤', match: '🧩' }
const GAME_COLORS: Record<string, string> = { quiz: '#3B82F6', flashcard: '#10B981', scramble: '#F59E0B', match: '#8B5CF6' }

function timeAgo(iso: string | null): string {
  if (!iso) return 'Never'
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'Just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['class-analytics'],
    queryFn: analyticsApi.getClassAnalytics,
  })

  if (isLoading || !analytics) {
    return (
      <div className="flex flex-col gap-6 animate-fade-up">
        <div className="h-8 w-64 bg-[#161A22] rounded-lg animate-pulse" />
        <div className="grid grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-28 bg-[#161A22] rounded-xl animate-pulse" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-7 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="font-syne text-[22px] font-bold text-[#E8ECF4] mb-0.5">Class Overview</h1>
        <p className="text-sm text-[#6B7694]">Real-time performance across all students and subjects</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total students"   value={analytics.totalStudents}              icon="👥" accent="#3B82F6" />
        <StatCard label="Active today"     value={analytics.activeToday}               icon="🟢" accent="#10B981" delta={`${analytics.totalStudents - analytics.activeToday} inactive`} />
        <StatCard label="Games played"     value={analytics.totalGamesPlayed}          icon="🎮" accent="#8B5CF6" delta="this term" />
        <StatCard label="Class accuracy"   value={`${analytics.avgClassAccuracy}%`}   icon="🎯" accent="#F59E0B" delta="avg score" deltaUp={analytics.avgClassAccuracy >= 75} />
      </div>

      {/* XP Over Time + Game Breakdown */}
      <div className="grid grid-cols-3 gap-4">
        {/* XP Chart */}
        <div className="col-span-2 bg-[#161A22] border border-[#1E2330] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-syne text-[14px] font-bold text-[#E8ECF4]">XP earned over time</div>
              <div className="font-mono text-[11px] text-[#6B7694]">Last 14 days · all students</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={analytics.xpOverTime} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6B7694', fontFamily: 'DM Mono' }} tickLine={false} axisLine={false} interval={2} />
              <YAxis tick={{ fontSize: 10, fill: '#6B7694', fontFamily: 'DM Mono' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#161A22', border: '1px solid #1E2330', borderRadius: 8, fontSize: 12, fontFamily: 'DM Mono' }} labelStyle={{ color: '#E8ECF4' }} itemStyle={{ color: '#3B82F6' }} />
              <Area type="monotone" dataKey="totalXp" stroke="#3B82F6" strokeWidth={2} fill="url(#xpGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Game type breakdown */}
        <div className="bg-[#161A22] border border-[#1E2330] rounded-xl p-5">
          <div className="font-syne text-[14px] font-bold text-[#E8ECF4] mb-1">Games by type</div>
          <div className="font-mono text-[11px] text-[#6B7694] mb-4">sessions this term</div>
          <div className="flex flex-col gap-3">
            {analytics.gameTypeBreakdown.map((g) => (
              <div key={g.gameType}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{GAME_ICONS[g.gameType]}</span>
                    <span className="text-xs font-medium text-[#E8ECF4] capitalize">{g.gameType}</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#6B7694]">{g.count} sessions</span>
                </div>
                <div className="bg-[#1E2330] rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${(g.count / Math.max(...analytics.gameTypeBreakdown.map(x => x.count))) * 100}%`,
                      background: GAME_COLORS[g.gameType],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top students + Weak topics */}
      <div className="grid grid-cols-2 gap-4">
        {/* Top students */}
        <div className="bg-[#161A22] border border-[#1E2330] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E2330]">
            <div className="font-syne text-[14px] font-bold text-[#E8ECF4]">Top students</div>
            <button onClick={() => navigate('/students')} className="font-mono text-[11px] text-[#3B82F6] hover:text-[#60A5FA]">view all →</button>
          </div>
          {analytics.topStudents.slice(0, 5).map((s, i) => (
            <div key={s.id} className="flex items-center gap-3 px-5 py-3 border-b border-[#1E2330] last:border-0 hover:bg-white/[0.02] transition-colors">
              <span className="font-mono text-[11px] text-[#6B7694] w-4">#{i + 1}</span>
              <div className="w-7 h-7 rounded-lg bg-[#3B82F6]/15 flex items-center justify-center text-[11px] font-semibold text-[#60A5FA] shrink-0">
                {s.avatarInitials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium text-[#E8ECF4] truncate">{s.displayName}</div>
                <div className="font-mono text-[10px] text-[#6B7694]">{s.yearGroup}</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-[12px] text-[#3B82F6]">{s.xp.toLocaleString()} XP</div>
                <div className="font-mono text-[10px] text-[#6B7694]">{s.avgAccuracy}% acc</div>
              </div>
            </div>
          ))}
        </div>

        {/* Weak topics */}
        <div className="bg-[#161A22] border border-[#1E2330] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E2330]">
            <div className="font-syne text-[14px] font-bold text-[#E8ECF4]">Topics needing attention</div>
            <Badge label="low accuracy" color="red" dot />
          </div>
          {analytics.weakTopics.map((t) => (
            <div key={t.topicId} className="flex items-center gap-3 px-5 py-3.5 border-b border-[#1E2330] last:border-0">
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium text-[#E8ECF4] truncate">{t.topicTitle}</div>
                <div className="font-mono text-[10px] text-[#6B7694]">{t.subjectName} · {t.studentsAttempted} students</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 bg-[#1E2330] rounded-full h-1.5 overflow-hidden">
                  <div className="h-full rounded-full bg-[#EF4444]" style={{ width: `${t.avgAccuracy}%` }} />
                </div>
                <span className="font-mono text-[12px] text-[#EF4444] w-8 text-right">{t.avgAccuracy}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
