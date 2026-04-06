import React, { useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { topicsApi } from '@/api'
import { useGameStore, calcXP } from '@/stores/gameStore'
import type { GameConfig, MatchPair } from '@/types'
import clsx from 'clsx'

type Side = 'term' | 'def'

interface Selection { side: Side; key: string }

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export const MatchGame: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const config = location.state as GameConfig | null
  const { endGame } = useGameStore()

  const topicId = config?.topicId ?? 0
  const { data: pairs = [], isLoading } = useQuery({
    queryKey: ['match', topicId],
    queryFn: () => topicsApi.getMatchPairs(topicId),
    enabled: topicId > 0,
  })

  const [matched, setMatched] = useState<string[]>([])
  const [wrong, setWrong] = useState<string[]>([])
  const [selection, setSelection] = useState<Selection | null>(null)
  const [shuffledLeft, setShuffledLeft] = useState<MatchPair[]>([])
  const [shuffledRight, setShuffledRight] = useState<MatchPair[]>([])
  const initialised = useRef(false)
  const startTime = useRef(Date.now())
  const wrongCount = useRef(0)

  if (!config) { navigate('/dashboard', { replace: true }); return null }

  // Initialise shuffles once data arrives
  if (pairs.length > 0 && !initialised.current) {
    setShuffledLeft(shuffle(pairs))
    setShuffledRight(shuffle(pairs))
    initialised.current = true
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <div className="text-5xl animate-bounce">🧩</div>
        <p className="font-fredoka text-xl text-blue-600">Setting up pairs...</p>
      </div>
    )
  }

  const handleClick = (side: Side, key: string) => {
    if (matched.includes(key)) return

    if (!selection) {
      setSelection({ side, key })
      return
    }

    // Same side — just switch selection
    if (selection.side === side) {
      setSelection({ side, key })
      return
    }

    // Opposite sides — check match
    if (selection.key === key) {
      // Correct!
      const newMatched = [...matched, key]
      setMatched(newMatched)
      setSelection(null)

      if (newMatched.length === pairs.length) {
        const total = pairs.length
        const score = total - wrongCount.current
        endGame({
          gameType: 'match',
          topicId,
          score: Math.max(score, 0),
          total,
          xpEarned: calcXP('match', Math.max(score, 0), total),
          durationSeconds: Math.round((Date.now() - startTime.current) / 1000),
          completedAt: new Date().toISOString(),
        })
        setTimeout(() => navigate('/games/result', { replace: true }), 600)
      }
    } else {
      // Wrong pair
      wrongCount.current++
      setWrong([selection.key, key])
      setTimeout(() => {
        setWrong([])
        setSelection(null)
      }, 700)
    }
  }

  const isSelected = (side: Side, key: string) =>
    selection?.side === side && selection?.key === key

  const itemClass = (side: Side, key: string) =>
    clsx(
      'rounded-2xl border-2 py-3 px-3 text-sm font-bold text-center cursor-pointer transition-all duration-200 min-h-[52px] flex items-center justify-center',
      matched.includes(key) && side === 'term' && 'bg-green-50 border-green-400 text-green-800',
      matched.includes(key) && side === 'def' && 'bg-blue-50 border-blue-300 text-blue-800',
      wrong.includes(key) && 'bg-red-50 border-red-300 text-red-600 animate-shake',
      isSelected(side, key) && !matched.includes(key) && !wrong.includes(key) &&
        'bg-violet-100 border-violet-500 text-violet-800 scale-105',
      !matched.includes(key) && !wrong.includes(key) && !isSelected(side, key) &&
        'bg-white border-gray-100 hover:border-violet-300 text-gray-700'
    )

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="bg-blue-100 text-blue-700 font-bold text-sm px-3 py-1 rounded-full">
          🧩 Match It!
        </span>
        <span className="text-sm font-bold text-gray-400">
          {matched.length} / {pairs.length} matched
        </span>
      </div>

      {/* Progress */}
      <div className="bg-blue-100 rounded-full h-2.5 overflow-hidden">
        <div
          className="h-full bg-blue-400 rounded-full transition-all duration-500"
          style={{ width: `${(matched.length / Math.max(pairs.length, 1)) * 100}%` }}
        />
      </div>

      <p className="text-center text-gray-500 font-semibold text-sm">
        Tap a term, then tap its matching meaning!
      </p>

      {/* Columns */}
      <div className="grid grid-cols-2 gap-3">
        {/* Terms */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Terms</p>
          {shuffledLeft.map((p) => (
            <button key={p.id} className={itemClass('term', p.term)} onClick={() => handleClick('term', p.term)}>
              {p.term}
            </button>
          ))}
        </div>

        {/* Definitions */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Meanings</p>
          {shuffledRight.map((p) => (
            <button key={p.id} className={itemClass('def', p.term)} onClick={() => handleClick('def', p.term)}>
              {p.definition}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
