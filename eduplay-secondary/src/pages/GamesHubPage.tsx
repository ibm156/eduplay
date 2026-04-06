import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { subjectsApi } from '@/api'

const GAMES = [
  { id: 'quiz',      icon: '❓', name: 'Quiz Blitz',     desc: 'Timed multiple-choice — beat the clock', xp: 'up to +60 XP', tag: 'FAST'  },
  { id: 'flashcard', icon: '🃏', name: 'Flashcard Flip', desc: 'Self-paced term recall and revision',     xp: 'up to +30 XP', tag: 'LEARN' },
  { id: 'scramble',  icon: '🔤', name: 'Word Scramble',  desc: 'Unscramble key scientific terms',         xp: 'up to +45 XP', tag: 'WORDS' },
  { id: 'match',     icon: '🧩', name: 'Match It',       desc: 'Pair concepts with definitions',          xp: 'up to +40 XP', tag: 'PAIRS' },
]

export const GamesHubPage: React.FC = () => {
  const navigate = useNavigate()

  const { data: subjects = [] } = useQuery({ queryKey: ['subjects'], queryFn: subjectsApi.list })

  // Default to first subject's first topic if no state passed
  const defaultTopic = { topicId: 102, topicTitle: 'Electromagnetism', subjectName: 'Physics', gameType: '' }

  return (
    <div className="flex flex-col gap-6 animate-fade-up">
      <div>
        <h1 className="font-syne text-[22px] font-bold text-[#F0F2FF] mb-0.5">Games</h1>
        <p className="text-sm text-[#7B82A0]">Choose a game mode to start earning XP</p>
      </div>

      {/* Game cards */}
      <div className="grid grid-cols-2 gap-3">
        {GAMES.map((g) => (
          <button
            key={g.id}
            onClick={() => navigate(`/games/${g.id}`, { state: { ...defaultTopic, gameType: g.id } })}
            className="bg-[#191C26] border border-[#252836] rounded-xl p-5 text-left hover:border-[#6C63FF]/40 transition-all hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{g.icon}</span>
              <span className="font-mono text-[10px] bg-[#6C63FF]/15 text-[#9B87FF] px-2 py-0.5 rounded">
                {g.tag}
              </span>
            </div>
            <div className="font-syne text-[15px] font-bold text-[#F0F2FF] mb-1">{g.name}</div>
            <div className="text-[12px] text-[#7B82A0] mb-3">{g.desc}</div>
            <div className="font-mono text-[11px] text-[#6C63FF]">{g.xp}</div>
          </button>
        ))}
      </div>

      {/* Subject shortcuts */}
      <div>
        <h2 className="font-syne text-[15px] font-bold text-[#F0F2FF] mb-3">Play by subject</h2>
        <div className="flex flex-col gap-2">
          {subjects.map((s) => (
            <button
              key={s.id}
              onClick={() => navigate(`/subjects/${s.id}/topics`)}
              className="bg-[#191C26] border border-[#252836] rounded-xl px-4 py-3 flex items-center gap-3 hover:border-[#2E3245] transition-all"
            >
              <span className="text-xl">{s.icon}</span>
              <span className="font-medium text-[14px] text-[#F0F2FF] flex-1 text-left">{s.name}</span>
              <span className="font-mono text-[11px] text-[#7B82A0]">{s.topicCount} topics</span>
              {/* Mini progress bar */}
              <div className="w-16 bg-[#252836] rounded-full h-1 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${s.progressPercent}%`, background: s.color }}
                />
              </div>
              <span className="text-[#7B82A0] text-sm">›</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active challenge */}
      <div className="bg-[#6C63FF]/08 border border-[#6C63FF]/20 rounded-xl p-4 flex items-center gap-4">
        <span className="text-2xl">🏆</span>
        <div className="flex-1">
          <div className="font-semibold text-[14px] text-[#F0F2FF] mb-0.5">Class challenge — active now</div>
          <div className="font-mono text-[12px] text-[#7B82A0]">Quiz Blitz · Waves & Sound · ends in 2d 14h</div>
        </div>
        <button
          onClick={() => navigate('/games/quiz', { state: { ...defaultTopic, gameType: 'quiz' } })}
          className="bg-[#6C63FF] text-white text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-[#7C74FF] transition-colors shrink-0"
        >
          Join →
        </button>
      </div>
    </div>
  )
}
