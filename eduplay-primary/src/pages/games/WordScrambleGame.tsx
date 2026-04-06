import React, { useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { topicsApi } from '@/api'
import { useGameStore, calcXP } from '@/stores/gameStore'
import type { GameConfig, WordScrambleItem } from '@/types'
import { Button } from '@/components/ui/Button'
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <div className="text-5xl animate-bounce">🔤</div>
        <p className="font-fredoka text-xl text-green-600">Scrambling words...</p>
      </div>
    )
  }

  const item: WordScrambleItem | undefined = words[idx]
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

  const clearAnswer = () => setSelected([])

  const checkAnswer = () => {
    if (answer.toUpperCase() !== item.word.toUpperCase()) {
      setFeedback('wrong')
      setTimeout(() => setFeedback(null), 800)
      return
    }
    setFeedback('correct')
    const newScore = score + 1
    setTimeout(() => {
      const next = idx + 1
      if (next >= words.length) {
        endGame({
          gameType: 'scramble',
          topicId,
          score: newScore,
          total: words.length,
          xpEarned: calcXP('scramble', newScore, words.length),
          durationSeconds: Math.round((Date.now() - startTime.current) / 1000),
          completedAt: new Date().toISOString(),
        })
        navigate('/games/result', { replace: true })
      } else {
        setIdx(next)
        setSelected([])
        setFeedback(null)
        setScore(newScore)
      }
    }, 700)
  }

  const progress = ((idx + 1) / words.length) * 100

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="bg-green-100 text-green-700 font-bold text-sm px-3 py-1 rounded-full">
          🔤 Word Scramble
        </span>
        <span className="text-sm font-bold text-gray-400">{idx + 1} / {words.length}</span>
      </div>

      {/* Progress */}
      <div className="bg-green-100 rounded-full h-2.5 overflow-hidden">
        <div className="h-full bg-green-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      {/* Scramble area */}
      <div
        className={clsx(
          'rounded-3xl p-5 text-center border-2 shadow-md transition-all',
          feedback === 'correct' && 'bg-green-50 border-green-400 shadow-green-200',
          feedback === 'wrong' && 'bg-red-50 border-red-300 shadow-red-200 animate-shake',
          !feedback && 'bg-blue-50 border-blue-200 shadow-blue-100'
        )}
      >
        <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">
          {item.hint}
        </p>

        {/* Answer row */}
        <div className="flex gap-2 justify-center flex-wrap min-h-[52px] items-center mb-4 bg-white rounded-2xl py-2 px-3 border border-blue-100">
          {selected.length === 0 ? (
            <span className="text-gray-300 font-semibold text-sm">tap letters below</span>
          ) : (
            selected.map((li, pos) => (
              <button
                key={pos}
                onClick={() => unpickLetter(pos)}
                className="w-10 h-11 rounded-xl bg-blue-500 text-white font-bold font-mono text-xl shadow-[0_3px_0_#1d4ed8] active:shadow-none active:translate-y-0.5 transition-all"
              >
                {letters[li]}
              </button>
            ))
          )}
        </div>

        {/* Scrambled letters */}
        <div className="flex gap-2 justify-center flex-wrap">
          {letters.map((letter, i) => (
            <button
              key={i}
              onClick={() => pickLetter(i)}
              disabled={selected.includes(i)}
              className={clsx(
                'w-10 h-11 rounded-xl font-bold font-mono text-xl shadow-[0_3px_0_#cbd5e1] active:shadow-none active:translate-y-0.5 transition-all',
                selected.includes(i)
                  ? 'bg-gray-100 text-gray-200 cursor-not-allowed'
                  : 'bg-white text-blue-600 border border-blue-100 hover:-translate-y-1'
              )}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <p className={clsx(
          'text-center font-bold text-lg',
          feedback === 'correct' ? 'text-green-600' : 'text-red-500'
        )}>
          {feedback === 'correct' ? '✅ Correct!' : '❌ Try again!'}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="ghost" onClick={clearAnswer} disabled={selected.length === 0 || !!feedback}>
          Clear
        </Button>
        <Button
          variant="primary"
          fullWidth
          onClick={checkAnswer}
          disabled={selected.length === 0 || !!feedback}
          className="bg-green-500 shadow-[0_4px_0_#15803d] hover:bg-green-600"
        >
          Check Answer ✓
        </Button>
      </div>
    </div>
  )
}
