import React, { useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { topicsApi } from '@/api'
import { useGameStore, calcXP } from '@/stores/gameStore'
import type { GameConfig } from '@/types'
import clsx from 'clsx'

export const WordScrambleGame: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const config = location.state as GameConfig | null
  const { endGame } = useGameStore()
  const topicId = config?.topicId ?? 0

  const { data: words = [], isLoading } = useQuery({
    queryKey: ['scramble', topicId],
    queryFn: () => topicsApi.getScrambleWords(topicId),
    enabled: topicId > 0,
  })

  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<number[]>([])
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const startTime = useRef(Date.now())

  if (!config) { navigate('/dashboard', { replace: true }); return null }

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <div className="text-5xl">🔤</div>
      <p className="font-mono text-[#7B82A0] text-sm">Scrambling words...</p>
    </div>
  )

  const item = words[idx]
  if (!item) return null
  const letters = item.scrambled.split('')
  const answer = selected.map((i) => letters[i]).join('')

  const pickLetter = (i: number) => {
    if (selected.includes(i) || feedback) return
    setSelected((s) => [...s, i])
  }

  const unpickLetter = (pos: number) => {
    if (feedback) return
    setSelected((s) => s.filter((_, p) => p !== pos))
  }

  const checkAnswer = () => {
    if (answer.toUpperCase() !== item.word.toUpperCase()) {
      setFeedback('wrong')
      setTimeout(() => setFeedback(null), 700)
      return
    }
    setFeedback('correct')
    const newScore = score + 1
    setTimeout(() => {
      const next = idx + 1
      if (next >= words.length) {
        endGame({
          gameType: 'scramble', topicId,
          score: newScore, total: words.length,
          xpEarned: calcXP('scramble', newScore, words.length),
          durationSeconds: Math.round((Date.now() - startTime.current) / 1000),
          completedAt: new Date().toISOString(),
        })
        navigate('/games/result', { replace: true })
      } else {
        setIdx(next); setSelected([]); setFeedback(null); setScore(newScore)
      }
    }, 700)
  }

  const progress = ((idx + 1) / words.length) * 100

  return (
    <div className="flex flex-col gap-5 animate-fade-up max-w-xl">
      <button onClick={() => navigate('/games')} className="font-mono text-[12px] text-[#7B82A0] hover:text-[#F0F2FF] flex items-center gap-1 w-fit">
        ← back to games
      </button>

      <div className="bg-[#191C26] border border-[#252836] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-[11px] bg-[#4DA6FF]/12 text-[#4DA6FF] px-2.5 py-1 rounded">
            🔤 WORD SCRAMBLE
          </span>
          <span className="font-mono text-[12px] text-[#7B82A0]">{idx + 1} / {words.length}</span>
        </div>

        <div className="bg-[#252836] rounded-full h-1 mb-5 overflow-hidden">
          <div className="h-full bg-[#4DA6FF] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        <div className={clsx(
          'bg-[#0D0F14] border rounded-xl p-5 mb-4 transition-all',
          feedback === 'correct' ? 'border-[#00D4AA]/50 animate-fade-up' :
          feedback === 'wrong'   ? 'border-[#FF6B6B]/50 animate-shake'   :
          'border-[#252836]',
        )}>
          <p className="font-mono text-[12px] text-[#6C63FF] mb-4">{item.hint}</p>

          {/* Answer row */}
          <div className="flex gap-2 justify-center flex-wrap min-h-[52px] items-center bg-[#13161D] border border-[#252836] rounded-xl py-2 px-3 mb-4">
            {selected.length === 0 ? (
              <span className="font-mono text-[12px] text-[#3A3F5C]">tap letters below to build your answer</span>
            ) : (
              selected.map((li, pos) => (
                <button
                  key={pos}
                  onClick={() => unpickLetter(pos)}
                  className="w-9 h-10 rounded-lg bg-[#6C63FF] text-white font-mono font-medium text-[16px] hover:bg-[#7C74FF] transition-colors"
                >
                  {letters[li]}
                </button>
              ))
            )}
          </div>

          {/* Source letters */}
          <div className="flex gap-2 justify-center flex-wrap">
            {letters.map((letter, i) => (
              <button
                key={i}
                onClick={() => pickLetter(i)}
                disabled={selected.includes(i)}
                className={clsx(
                  'w-9 h-10 rounded-lg font-mono font-medium text-[16px] border transition-all',
                  selected.includes(i)
                    ? 'bg-[#252836] text-[#3A3F5C] border-[#252836] cursor-not-allowed'
                    : 'bg-[#191C26] text-[#F0F2FF] border-[#2E3245] hover:border-[#4DA6FF]/50 hover:-translate-y-1',
                )}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {feedback && (
          <p className={clsx(
            'text-center font-mono text-[13px] font-medium mb-3',
            feedback === 'correct' ? 'text-[#00D4AA]' : 'text-[#FF6B6B]',
          )}>
            {feedback === 'correct' ? '✓ Correct!' : '✗ Not quite — try again'}
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => setSelected([])}
            disabled={selected.length === 0 || !!feedback}
            className="px-4 py-2.5 rounded-lg border border-[#252836] text-[#7B82A0] text-[13px] font-medium hover:border-[#2E3245] hover:text-[#F0F2FF] transition-all disabled:opacity-30"
          >
            Clear
          </button>
          <button
            onClick={checkAnswer}
            disabled={selected.length === 0 || !!feedback}
            className="flex-1 py-2.5 rounded-lg bg-[#4DA6FF] text-white text-[13px] font-semibold hover:bg-[#6AB8FF] transition-colors disabled:opacity-30"
          >
            Check answer →
          </button>
        </div>
      </div>
    </div>
  )
}
