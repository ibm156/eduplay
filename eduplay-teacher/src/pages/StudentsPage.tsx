import React, { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { analyticsApi } from '@/api'
import { Badge, Input, StatCard } from '@/components/ui/index'
import type { StudentProgress } from '@/types'
import clsx from 'clsx'

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

function accuracyColor(acc: number): 'green' | 'amber' | 'red' {
  if (acc >= 80) return 'green'
  if (acc >= 60) return 'amber'
  return 'red'
}

function streakColor(streak: number): 'green' | 'amber' | 'gray' {
  if (streak >= 7) return 'green'
  if (streak >= 3) return 'amber'
  return 'gray'
}

const StudentRow: React.FC<{ student: StudentProgress; onClick: () => void; selected: boolean }> = ({ student, onClick, selected }) => (
  <div
    onClick={onClick}
    className={clsx(
      'flex items-center gap-4 px-5 py-3.5 border-b border-[#1E2330] last:border-0 cursor-pointer transition-all',
      selected ? 'bg-[#3B82F6]/06' : 'hover:bg-white/[0.02]',
    )}
  >
    <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/15 flex items-center justify-center text-[11px] font-semibold text-[#60A5FA] shrink-0">
      {student.avatarInitials}
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-[13px] font-medium text-[#E8ECF4] truncate">{student.displayName}</div>
      <div className="font-mono text-[10px] text-[#6B7694]">{student.yearGroup} · @{student.username}</div>
    </div>
    <div className="flex items-center gap-3">
      <Badge label={`${student.avgAccuracy}%`} color={accuracyColor(student.avgAccuracy)} />
      <Badge label={`${student.streak}d 🔥`}   color={streakColor(student.streak)} />
      <div className="text-right hidden lg:block">
        <div className="font-mono text-[12px] text-[#3B82F6]">{student.xp.toLocaleString()} XP</div>
        <div className="font-mono text-[10px] text-[#6B7694]">{timeAgo(student.lastActive)}</div>
      </div>
    </div>
  </div>
)

const StudentDetail: React.FC<{ student: StudentProgress }> = ({ student }) => {
  const xpPerLevel = 500
  const levelXp = student.xp % xpPerLevel
  const pct = Math.min((levelXp / xpPerLevel) * 100, 100)

  return (
    <div className="flex flex-col gap-4 animate-fade-up">
      {/* Header */}
      <div className="bg-[#161A22] border border-[#1E2330] rounded-xl p-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#3B82F6]/15 flex items-center justify-center text-[16px] font-bold text-[#60A5FA]">
            {student.avatarInitials}
          </div>
          <div>
            <div className="font-syne text-[16px] font-bold text-[#E8ECF4]">{student.displayName}</div>
            <div className="font-mono text-[11px] text-[#6B7694]">@{student.username} · {student.yearGroup}</div>
          </div>
          <div className="ml-auto">
            <Badge label={student.streak >= 7 ? 'On fire 🔥' : `${student.streak}d streak`} color={streakColor(student.streak)} />
          </div>
        </div>

        {/* XP bar */}
        <div className="mb-1 flex justify-between">
          <span className="font-mono text-[11px] text-[#6B7694]">Level {student.level}</span>
          <span className="font-mono text-[11px] text-[#6B7694]">{levelXp} / {xpPerLevel} XP</span>
        </div>
        <div className="bg-[#1E2330] rounded-full h-1.5 overflow-hidden">
          <div className="h-full rounded-full bg-[#3B82F6] transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Total XP"      value={student.xp.toLocaleString()} accent="#3B82F6" />
        <StatCard label="Games played"  value={student.gamesPlayed}          accent="#8B5CF6" />
        <StatCard label="Avg accuracy"  value={`${student.avgAccuracy}%`}   accent={student.avgAccuracy >= 80 ? '#10B981' : student.avgAccuracy >= 60 ? '#F59E0B' : '#EF4444'} />
        <StatCard label="Day streak"    value={student.streak}               accent="#F59E0B" />
      </div>

      {/* Last active */}
      <div className="bg-[#161A22] border border-[#1E2330] rounded-xl px-5 py-4 flex items-center justify-between">
        <span className="text-sm text-[#6B7694]">Last active</span>
        <span className="font-mono text-[13px] text-[#E8ECF4]">{timeAgo(student.lastActive)}</span>
      </div>

      {/* Performance indicator */}
      <div className="bg-[#161A22] border border-[#1E2330] rounded-xl p-5">
        <div className="font-syne text-[13px] font-bold text-[#E8ECF4] mb-3">Performance</div>
        <div className="flex flex-col gap-2.5">
          {[
            { label: 'Accuracy', value: student.avgAccuracy, color: student.avgAccuracy >= 80 ? '#10B981' : student.avgAccuracy >= 60 ? '#F59E0B' : '#EF4444' },
            { label: 'Engagement', value: Math.min(student.gamesPlayed * 2, 100), color: '#3B82F6' },
            { label: 'Streak strength', value: Math.min(student.streak * 7, 100), color: '#F59E0B' },
          ].map((row) => (
            <div key={row.label}>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-[#6B7694]">{row.label}</span>
                <span className="font-mono text-[11px] text-[#6B7694]">{Math.round(row.value)}%</span>
              </div>
              <div className="bg-[#1E2330] rounded-full h-1.5 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${row.value}%`, background: row.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const StudentsPage: React.FC = () => {
  const [search, setSearch] = useState('')
  const [yearFilter, setYearFilter] = useState('All')
  const [selected, setSelected] = useState<StudentProgress | null>(null)

  const { data: students = [], isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: analyticsApi.getStudents,
  })

  const yearGroups = ['All', ...Array.from(new Set(students.map((s) => s.yearGroup))).sort()]

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchSearch = search === '' ||
        s.displayName.toLowerCase().includes(search.toLowerCase()) ||
        s.username.toLowerCase().includes(search.toLowerCase())
      const matchYear = yearFilter === 'All' || s.yearGroup === yearFilter
      return matchSearch && matchYear
    })
  }, [students, search, yearFilter])

  const avgAccuracy = students.length > 0
    ? Math.round(students.reduce((s, u) => s + u.avgAccuracy, 0) / students.length) : 0
  const activeNow = students.filter((s) => s.lastActive && Date.now() - new Date(s.lastActive).getTime() < 1000 * 60 * 30).length

  return (
    <div className="flex flex-col gap-6 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="font-syne text-[22px] font-bold text-[#E8ECF4] mb-0.5">Students</h1>
        <p className="text-sm text-[#6B7694]">{students.length} students enrolled</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard label="Enrolled"      value={students.length} accent="#3B82F6" />
        <StatCard label="Active now"    value={activeNow}       accent="#10B981" />
        <StatCard label="Avg accuracy"  value={`${avgAccuracy}%`} accent="#F59E0B" />
        <StatCard label="Total XP"      value={students.reduce((s, u) => s + u.xp, 0).toLocaleString()} accent="#8B5CF6" />
      </div>

      <div className="grid grid-cols-5 gap-4">
        {/* Student list */}
        <div className="col-span-3 bg-[#161A22] border border-[#1E2330] rounded-xl overflow-hidden">
          {/* Filters */}
          <div className="px-5 py-4 border-b border-[#1E2330] flex items-center gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-1.5 shrink-0">
              {yearGroups.map((y) => (
                <button
                  key={y}
                  onClick={() => setYearFilter(y)}
                  className={clsx(
                    'px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all',
                    yearFilter === y
                      ? 'bg-[#3B82F6]/15 border-[#3B82F6]/40 text-[#60A5FA]'
                      : 'bg-transparent border-[#1E2330] text-[#6B7694] hover:border-[#262D3D]',
                  )}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          {isLoading ? (
            <div className="flex flex-col gap-0">
              {[1,2,3,4,5].map((i) => (
                <div key={i} className="h-16 border-b border-[#1E2330] animate-pulse bg-[#161A22]" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-[#6B7694] text-sm">No students found</div>
          ) : (
            filtered.map((s) => (
              <StudentRow
                key={s.id}
                student={s}
                onClick={() => setSelected(s.id === selected?.id ? null : s)}
                selected={s.id === selected?.id}
              />
            ))
          )}
        </div>

        {/* Detail panel */}
        <div className="col-span-2">
          {selected ? (
            <StudentDetail student={selected} />
          ) : (
            <div className="bg-[#161A22] border border-[#1E2330] rounded-xl flex flex-col items-center justify-center py-16 text-center">
              <div className="text-4xl mb-3">👆</div>
              <div className="text-sm font-medium text-[#E8ECF4] mb-1">Select a student</div>
              <div className="text-xs text-[#6B7694]">Click any row to view their progress</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
