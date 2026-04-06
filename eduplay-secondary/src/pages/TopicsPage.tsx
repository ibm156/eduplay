import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { subjectsApi } from '@/api'
import clsx from 'clsx'

const GAME_OPTIONS = [
  { id: 'quiz',      icon: '❓', name: 'Quiz Blitz',     desc: 'Timed multiple-choice',   xp: '+60 XP' },
  { id: 'flashcard', icon: '🃏', name: 'Flashcard Flip', desc: 'Self-paced recall',        xp: '+30 XP' },
  { id: 'scramble',  icon: '🔤', name: 'Word Scramble',  desc: 'Unscramble key terms',     xp: '+45 XP' },
  { id: 'match',     icon: '🧩', name: 'Match It',       desc: 'Pair concepts & meanings', xp: '+40 XP' },
]

export const TopicsPage: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>()
  const navigate = useNavigate()
  const id = Number(subjectId)
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null)

  const { data: topics = [], isLoading } = useQuery({
    queryKey: ['topics', id],
    queryFn: () => subjectsApi.getTopics(id),
    enabled: !isNaN(id),
  })

  const selectedTopic = topics.find((t) => t.id === selectedTopicId)

  return (
    <div className="flex flex-col gap-5 animate-fade-up">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/subjects')}
          className="font-mono text-[12px] text-[#7B82A0] hover:text-[#F0F2FF] transition-colors flex items-center gap-1"
        >
          ← subjects
        </button>
      </div>

      <div>
        <h1 className="font-syne text-[22px] font-bold text-[#F0F2FF] mb-0.5">Topics</h1>
        <p className="text-sm text-[#7B82A0]">Select a topic then choose your game</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {[1,2,3,4].map((i) => <div key={i} className="h-14 bg-[#191C26] rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopicId(topic.id === selectedTopicId ? null : topic.id)}
              className={clsx(
                'bg-[#191C26] border rounded-xl px-4 py-3.5 w-full text-left flex items-center gap-3 transition-all',
                selectedTopicId === topic.id
                  ? 'border-[#6C63FF]/50 bg-[#6C63FF]/06'
                  : 'border-[#252836] hover:border-[#2E3245]',
              )}
            >
              <div className={clsx(
                'w-2 h-2 rounded-full shrink-0',
                topic.isCompleted ? 'bg-[#00D4AA]' : 'bg-[#252836] border border-[#2E3245]',
              )} />
              <span className="font-medium text-[14px] text-[#F0F2FF] flex-1">{topic.title}</span>
              <span className="font-mono text-[11px] text-[#7B82A0]">{topic.questionCount} Qs</span>
              {topic.isCompleted && (
                <span className="font-mono text-[11px] text-[#00D4AA]">✓</span>
              )}
              <span className="text-[#7B82A0] text-sm ml-1">
                {selectedTopicId === topic.id ? '▲' : '▼'}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Game picker */}
      {selectedTopic && (
        <div className="animate-fade-up">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-[#252836]" />
            <span className="font-mono text-[11px] text-[#7B82A0] px-2">
              {selectedTopic.title} — pick a game
            </span>
            <div className="h-px flex-1 bg-[#252836]" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {GAME_OPTIONS.map((g) => (
              <button
                key={g.id}
                onClick={() => navigate(`/games/${g.id}`, {
                  state: {
                    topicId: selectedTopic.id,
                    topicTitle: selectedTopic.title,
                    subjectName: '',
                    gameType: g.id,
                  },
                })}
                className="bg-[#191C26] border border-[#252836] rounded-xl p-4 text-left hover:border-[#6C63FF]/40 transition-all hover:-translate-y-0.5 group"
              >
                <div className="text-2xl mb-2">{g.icon}</div>
                <div className="font-semibold text-[13px] text-[#F0F2FF] mb-0.5">{g.name}</div>
                <div className="text-[11px] text-[#7B82A0] mb-2">{g.desc}</div>
                <div className="font-mono text-[11px] text-[#6C63FF]">{g.xp}</div>
              </button>
            ))}
          </div>

          {/* Active class challenge banner */}
          <div className="mt-3 bg-[#6C63FF]/08 border border-[#6C63FF]/20 rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="text-xl">🏆</span>
            <div className="flex-1">
              <div className="text-[13px] font-semibold text-[#F0F2FF]">Class challenge — active</div>
              <div className="font-mono text-[11px] text-[#7B82A0]">Quiz Blitz · {selectedTopic.title} · ends in 2d 14h</div>
            </div>
            <button
              onClick={() => navigate('/games/quiz', {
                state: { topicId: selectedTopic.id, topicTitle: selectedTopic.title, subjectName: '', gameType: 'quiz' },
              })}
              className="bg-[#6C63FF] text-white text-[12px] font-semibold px-3 py-1.5 rounded-lg hover:bg-[#7C74FF] transition-colors shrink-0"
            >
              Join →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
