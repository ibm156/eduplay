import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { analyticsApi } from '@/api'
import { Badge } from '@/components/ui/index'
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend,
} from 'recharts'

const GAME_COLORS: Record<string, string> = {
  quiz: '#3B82F6', flashcard: '#10B981', scramble: '#F59E0B', match: '#8B5CF6',
}
const GAME_ICONS: Record<string, string> = {
  quiz: '❓', flashcard: '🃏', scramble: '🔤', match: '🧩',
}

const CustomTooltip: React.FC<{ active?: boolean; payload?: {value: number; name: string}[]; label?: string }> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#161A22] border border-[#1E2330] rounded-lg px-3 py-2.5 text-xs font-mono shadow-xl">
      <div className="text-[#6B7694] mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="text-[#E8ECF4]">{p.value}</div>
      ))}
    </div>
  )
}

export const AnalyticsPage: React.FC = () => {
  const [tab, setTab] = useState<'overview' | 'topics' | 'games'>('overview')

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['class-analytics'],
    queryFn: analyticsApi.getClassAnalytics,
  })

  if (isLoading || !analytics) {
    return (
      <div className="flex flex-col gap-6 animate-fade-up">
        <div className="h-8 w-48 bg-[#161A22] rounded animate-pulse" />
        <div className="grid grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-64 bg-[#161A22] rounded-xl animate-pulse border border-[#1E2330]" />)}
        </div>
      </div>
    )
  }

  const radarData = analytics.gameTypeBreakdown.map((g) => ({
    game: g.gameType.charAt(0).toUpperCase() + g.gameType.slice(1),
    accuracy: g.avgAccuracy,
    sessions: Math.round((g.count / Math.max(...analytics.gameTypeBreakdown.map(x => x.count))) * 100),
  }))

  const accuracyBuckets = [
    { range: '0–50%',  count: 0, color: '#EF4444' },
    { range: '51–70%', count: 0, color: '#F59E0B' },
    { range: '71–85%', count: 0, color: '#3B82F6' },
    { range: '86–100%',count: 0, color: '#10B981' },
  ]
  analytics.topStudents.forEach((s) => {
    if (s.avgAccuracy <= 50)      accuracyBuckets[0].count++
    else if (s.avgAccuracy <= 70) accuracyBuckets[1].count++
    else if (s.avgAccuracy <= 85) accuracyBuckets[2].count++
    else                           accuracyBuckets[3].count++
  })

  const tabs = [
    { id: 'overview', label: 'Overview'     },
    { id: 'topics',   label: 'Topic performance' },
    { id: 'games',    label: 'Game breakdown' },
  ] as const

  return (
    <div className="flex flex-col gap-6 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="font-syne text-[22px] font-bold text-[#E8ECF4] mb-0.5">Analytics</h1>
        <p className="text-sm text-[#6B7694]">Deep dive into class performance and learning patterns</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#111318] border border-[#1E2330] rounded-xl p-1 w-fit">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              tab === t.id
                ? 'bg-[#161A22] text-[#E8ECF4] shadow-sm'
                : 'text-[#6B7694] hover:text-[#E8ECF4]',
            ].join(' ')}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {tab === 'overview' && (
        <div className="flex flex-col gap-4">
          {/* XP over time */}
          <div className="bg-[#161A22] border border-[#1E2330] rounded-xl p-5">
            <div className="font-syne text-[14px] font-bold text-[#E8ECF4] mb-0.5">Class XP over time</div>
            <div className="font-mono text-[11px] text-[#6B7694] mb-4">Last 14 days</div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={analytics.xpOverTime} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6B7694', fontFamily: 'DM Mono' }} tickLine={false} axisLine={false} interval={2} />
                <YAxis tick={{ fontSize: 10, fill: '#6B7694', fontFamily: 'DM Mono' }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="totalXp" stroke="#3B82F6" strokeWidth={2} fill="url(#grad1)" dot={false} name="XP" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Accuracy distribution + Radar */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#161A22] border border-[#1E2330] rounded-xl p-5">
              <div className="font-syne text-[14px] font-bold text-[#E8ECF4] mb-0.5">Accuracy distribution</div>
              <div className="font-mono text-[11px] text-[#6B7694] mb-4">Students by score range</div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={accuracyBuckets} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <XAxis dataKey="range" tick={{ fontSize: 10, fill: '#6B7694', fontFamily: 'DM Mono' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#6B7694', fontFamily: 'DM Mono' }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Students">
                    {accuracyBuckets.map((b, i) => <Cell key={i} fill={b.color} fillOpacity={0.85} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-[#161A22] border border-[#1E2330] rounded-xl p-5">
              <div className="font-syne text-[14px] font-bold text-[#E8ECF4] mb-0.5">Game type radar</div>
              <div className="font-mono text-[11px] text-[#6B7694] mb-4">Accuracy vs engagement</div>
              <ResponsiveContainer width="100%" height={180}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#1E2330" />
                  <PolarAngleAxis dataKey="game" tick={{ fontSize: 10, fill: '#6B7694', fontFamily: 'DM Mono' }} />
                  <Radar name="Accuracy" dataKey="accuracy" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.15} strokeWidth={2} />
                  <Radar name="Engagement" dataKey="sessions" stroke="#10B981" fill="#10B981" fillOpacity={0.1} strokeWidth={2} />
                  <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'DM Mono', color: '#6B7694' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Topics tab */}
      {tab === 'topics' && (
        <div className="flex flex-col gap-3">
          <div className="bg-[#161A22] border border-[#1E2330] rounded-xl overflow-hidden">
            <div className="grid grid-cols-5 px-5 py-3 border-b border-[#1E2330] font-mono text-[11px] text-[#6B7694] uppercase tracking-wider">
              <div className="col-span-2">Topic</div>
              <div>Subject</div>
              <div>Students</div>
              <div>Avg accuracy</div>
            </div>
            {[...analytics.weakTopics]
              .sort((a, b) => a.avgAccuracy - b.avgAccuracy)
              .map((t) => (
                <div key={t.topicId} className="grid grid-cols-5 items-center px-5 py-3.5 border-b border-[#1E2330] last:border-0 hover:bg-white/[0.02] transition-colors">
                  <div className="col-span-2 text-[13px] font-medium text-[#E8ECF4]">{t.topicTitle}</div>
                  <div className="font-mono text-[12px] text-[#6B7694]">{t.subjectName}</div>
                  <div className="font-mono text-[12px] text-[#6B7694]">{t.studentsAttempted}</div>
                  <div className="flex items-center gap-2.5">
                    <div className="flex-1 bg-[#1E2330] rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${t.avgAccuracy}%`,
                          background: t.avgAccuracy >= 80 ? '#10B981' : t.avgAccuracy >= 60 ? '#F59E0B' : '#EF4444',
                        }}
                      />
                    </div>
                    <span className="font-mono text-[12px] w-8 text-right" style={{ color: t.avgAccuracy >= 80 ? '#10B981' : t.avgAccuracy >= 60 ? '#F59E0B' : '#EF4444' }}>
                      {t.avgAccuracy}%
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Games tab */}
      {tab === 'games' && (
        <div className="grid grid-cols-2 gap-4">
          {analytics.gameTypeBreakdown.map((g) => (
            <div key={g.gameType} className="bg-[#161A22] border border-[#1E2330] rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{GAME_ICONS[g.gameType]}</span>
                <div>
                  <div className="font-syne text-[14px] font-bold text-[#E8ECF4] capitalize">{g.gameType}</div>
                  <div className="font-mono text-[11px] text-[#6B7694]">{g.count} sessions played</div>
                </div>
                <div className="ml-auto">
                  <Badge
                    label={`${g.avgAccuracy}% acc`}
                    color={g.avgAccuracy >= 80 ? 'green' : g.avgAccuracy >= 60 ? 'amber' : 'red'}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Avg accuracy',   value: g.avgAccuracy,   max: 100, color: GAME_COLORS[g.gameType] },
                  { label: 'Total XP earned', value: Math.min(g.totalXp / 50, 100), max: 100, color: '#F59E0B', display: g.totalXp.toLocaleString() + ' XP' },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-xs text-[#6B7694]">{row.label}</span>
                      <span className="font-mono text-[11px] text-[#6B7694]">{row.display ?? `${row.value}%`}</span>
                    </div>
                    <div className="bg-[#1E2330] rounded-full h-1.5 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${row.value}%`, background: row.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
