import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { subjectsApi } from '@/api'

const SUBJECT_STYLES: Record<string, { bg: string; border: string; accent: string }> = {
  Maths:   { bg: 'bg-yellow-50',  border: 'border-yellow-300', accent: '#FFD93D' },
  Science: { bg: 'bg-green-50',   border: 'border-green-300',  accent: '#6BCB77' },
  English: { bg: 'bg-blue-50',    border: 'border-blue-300',   accent: '#4D96FF' },
  Art:     { bg: 'bg-pink-50',    border: 'border-pink-300',   accent: '#FF6FC8' },
}

const DEFAULT_STYLE = { bg: 'bg-violet-50', border: 'border-violet-300', accent: '#A66CFF' }

export const SubjectsPage: React.FC = () => {
  const navigate = useNavigate()

  const { data: subjects = [], isLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: subjectsApi.list,
  })

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="font-fredoka text-2xl text-violet-700">📚 Choose a Subject</h2>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-gray-100 rounded-3xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-fredoka text-2xl text-violet-700">📚 Choose a Subject</h2>

      {subjects.map((subject) => {
        const style = SUBJECT_STYLES[subject.name] ?? DEFAULT_STYLE
        const pct = Math.min(subject.progressPercent, 100)

        return (
          <button
            key={subject.id}
            onClick={() => navigate(`/subjects/${subject.id}/topics`)}
            className={`${style.bg} ${style.border} border-2 rounded-3xl p-5 text-left w-full transition-transform hover:-translate-y-1 active:translate-y-0 shadow-sm`}
          >
            <div className="flex items-center gap-4 mb-3">
              <span className="text-5xl">{subject.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-extrabold text-gray-800 text-lg leading-tight">{subject.name}</div>
                <div className="text-sm text-gray-500 mt-0.5">
                  {subject.topicCount} topics · {subject.questionCount} questions
                </div>
              </div>
              <span className="text-2xl text-gray-300">›</span>
            </div>

            {/* Progress bar */}
            <div className="bg-white rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: style.accent }}
              />
            </div>
            <div className="flex justify-between items-center mt-1.5">
              <span className="text-xs text-gray-400 font-semibold">{pct}% complete</span>
              {pct === 100 && <span className="text-xs font-bold text-green-600">✅ Done!</span>}
            </div>
          </button>
        )
      })}

      {subjects.length === 0 && (
        <div className="text-center py-12 text-gray-400 font-semibold">
          No subjects available yet 📭
        </div>
      )}
    </div>
  )
}
