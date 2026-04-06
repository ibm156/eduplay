import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { subjectsApi } from '@/api'

const DOT_COLORS = [
  '#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF',
  '#FF6FC8', '#A66CFF', '#FF9F45', '#00D4AA',
]

const GAME_OPTIONS = [
  { id: 'quiz',      icon: '❓', name: 'Quiz Blitz',      tag: 'FAST',  bg: 'bg-red-50 border-red-200' },
  { id: 'flashcard', icon: '🃏', name: 'Flashcard Flip',  tag: 'LEARN', bg: 'bg-yellow-50 border-yellow-200' },
  { id: 'scramble',  icon: '🔤', name: 'Word Scramble',   tag: 'WORDS', bg: 'bg-green-50 border-green-200' },
  { id: 'match',     icon: '🧩', name: 'Match It!',       tag: 'PAIRS', bg: 'bg-blue-50 border-blue-200' },
]

export const TopicsPage: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>()
  const navigate = useNavigate()
  const id = Number(subjectId)

  const { data: topics = [], isLoading } = useQuery({
    queryKey: ['topics', id],
    queryFn: () => subjectsApi.getTopics(id),
    enabled: !isNaN(id),
  })

  const [selectedTopicId, setSelectedTopicId] = React.useState<number | null>(null)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-8 w-48 bg-gray-100 rounded-full animate-pulse" />
        {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />)}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <button
        onClick={() => navigate('/subjects')}
        className="flex items-center gap-2 text-violet-600 font-bold text-sm w-fit"
      >
        ← Back to subjects
      </button>

      <h2 className="font-fredoka text-2xl text-violet-700">📌 Choose a Topic</h2>

      <div className="flex flex-col gap-2">
        {topics.map((topic, i) => (
          <button
            key={topic.id}
            onClick={() => setSelectedTopicId(topic.id === selectedTopicId ? null : topic.id)}
            className={`bg-white border-2 rounded-2xl px-4 py-3.5 w-full text-left flex items-center gap-3 transition-all ${
              selectedTopicId === topic.id
                ? 'border-violet-400 shadow-md'
                : 'border-gray-100 hover:border-violet-200'
            }`}
          >
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ background: DOT_COLORS[i % DOT_COLORS.length] }}
            />
            <span className="font-bold text-gray-800 flex-1">{topic.title}</span>
            <span className="text-xs text-gray-400 font-semibold">{topic.questionCount} Qs</span>
            {topic.isCompleted && <span className="text-green-500 text-sm">✅</span>}
            <span className="text-gray-300">›</span>
          </button>
        ))}

        {topics.length === 0 && (
          <p className="text-center text-gray-400 py-8 font-semibold">No topics yet 📭</p>
        )}
      </div>

      {/* Game picker - shown when topic selected */}
      {selectedTopicId !== null && (
        <div className="animate-fade-in">
          <h3 className="font-fredoka text-xl text-violet-700 mb-3">🎮 Pick a Game</h3>
          <div className="grid grid-cols-2 gap-3">
            {GAME_OPTIONS.map((g) => (
              <button
                key={g.id}
                onClick={() =>
                  navigate(`/games/${g.id}`, {
                    state: {
                      topicId: selectedTopicId,
                      topicTitle: topics.find((t) => t.id === selectedTopicId)?.title ?? '',
                      subjectName: '',
                    },
                  })
                }
                className={`${g.bg} border-2 rounded-3xl p-4 text-center flex flex-col items-center gap-2 transition-transform hover:-translate-y-1 active:translate-y-0 shadow-sm`}
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
      )}
    </div>
  )
}
