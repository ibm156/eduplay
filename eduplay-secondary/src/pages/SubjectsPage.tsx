import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { subjectsApi } from '@/api'

export const SubjectsPage: React.FC = () => {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('All')
  const { data: subjects = [], isLoading } = useQuery({ queryKey: ['subjects'], queryFn: subjectsApi.list })

  const filters = ['All', 'Science', 'Humanities', 'Maths']
  const scienceSubjects = ['Physics', 'Chemistry', 'Biology']
  const humanitiesSubjects = ['History', 'English Lit.']

  const filtered = subjects.filter((s) => {
    if (filter === 'All') return true
    if (filter === 'Science') return scienceSubjects.includes(s.name)
    if (filter === 'Humanities') return humanitiesSubjects.includes(s.name)
    if (filter === 'Maths') return s.name === 'Mathematics'
    return true
  })

  return (
    <div className="flex flex-col gap-6 animate-fade-up">
      <div>
        <h1 className="font-syne text-[22px] font-bold text-[#F0F2FF] mb-0.5">Your subjects</h1>
        <p className="text-sm text-[#7B82A0]">{subjects.length} subjects enrolled this year</p>
      </div>

      <div className="flex gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={[
              'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all',
              filter === f
                ? 'bg-[#6C63FF]/15 border-[#6C63FF]/40 text-[#9B87FF]'
                : 'bg-transparent border-[#252836] text-[#7B82A0] hover:border-[#2E3245] hover:text-[#F0F2FF]',
            ].join(' ')}
          >
            {f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="h-40 bg-[#191C26] rounded-xl animate-pulse border border-[#252836]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filtered.map((subject) => {
            const pct = Math.min(subject.progressPercent, 100)
            return (
              <button
                key={subject.id}
                onClick={() => navigate(`/subjects/${subject.id}/topics`)}
                className="bg-[#191C26] border border-[#252836] rounded-xl p-5 text-left hover:border-[#2E3245] hover:-translate-y-0.5 transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl" style={{ background: subject.color }} />
                <div className="text-[26px] mb-3">{subject.icon}</div>
                <div className="font-semibold text-[15px] text-[#F0F2FF] mb-1">{subject.name}</div>
                <div className="font-mono text-[11px] text-[#7B82A0] mb-3">
                  {subject.topicCount} topics · {subject.questionCount} Qs
                </div>
                <div className="bg-[#252836] rounded-full h-1.5 overflow-hidden mb-2">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: subject.color }} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-[#7B82A0]">{pct}% complete</span>
                  {pct === 100
                    ? <span className="font-mono text-[11px] text-[#00D4AA]">✓ done</span>
                    : <span className="font-mono text-[11px]" style={{ color: subject.accentColor }}>+XP</span>}
                </div>
              </button>
            )
          })}
          {filtered.length === 0 && (
            <p className="col-span-2 text-center text-[#7B82A0] py-12 text-sm">No subjects match this filter</p>
          )}
        </div>
      )}
    </div>
  )
}
