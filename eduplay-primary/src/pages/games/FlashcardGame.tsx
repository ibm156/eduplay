import React, { useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { topicsApi } from '@/api'
import { useGameStore, calcXP } from '@/stores/gameStore'
import type { GameConfig } from '@/types'
import { Button } from '@/components/ui/Button'

export const FlashcardGame: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const config = location.state as GameConfig | null
  const { endGame } = useGameStore()

  const topicId = config?.topicId ?? 0
  const { data: cards = [], isLoading } = useQuery({
    queryKey: ['flashcards', topicId],
    queryFn: () => topicsApi.getFlashcards(topicId),
    enabled: topicId > 0,
  })

  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [got, setGot] = useState(0)
  const [missed, setMissed] = useState(0)
  const startTime = useRef(Date.now())

  if (!config) {
    navigate('/dashboard', { replace: true })
    return null
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <div className="text-5xl animate-bounce">🃏</div>
        <p className="font-fredoka text-xl text-yellow-600">Loading cards...</p>
      </div>
    )
  }

  const card = cards[idx]
  const total = cards.length
  const done = idx >= total

  const handleAnswer = (remembered: boolean) => {
    if (remembered) setGot((g) => g + 1)
    else setMissed((m) => m + 1)
    const next = idx + 1
    if (next >= total) {
      const finalScore = got + (remembered ? 1 : 0)
      endGame({
        gameType: 'flashcard',
        topicId,
        score: finalScore,
        total,
        xpEarned: calcXP('flashcard', finalScore, total),
        durationSeconds: Math.round((Date.now() - startTime.current) / 1000),
        completedAt: new Date().toISOString(),
      })
      navigate('/games/result', { replace: true })
    } else {
      setIdx(next)
      setFlipped(false)
    }
  }

  const progress = ((idx + 1) / total) * 100

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="bg-yellow-100 text-yellow-700 font-bold text-sm px-3 py-1 rounded-full">
          🃏 Flashcard Flip
        </span>
        <span className="text-sm font-bold text-gray-400">
          {idx + 1} / {total}
        </span>
      </div>

      {/* Progress */}
      <div className="bg-yellow-100 rounded-full h-2.5 overflow-hidden">
        <div
          className="h-full bg-yellow-400 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Instruction */}
      {!flipped && (
        <p className="text-center text-gray-500 font-semibold text-sm">
          Tap the card to see the answer!
        </p>
      )}

      {/* Flashcard */}
      {!done && card && (
        <button
          onClick={() => setFlipped((f) => !f)}
          className="bg-yellow-50 border-2 border-yellow-300 rounded-3xl p-8 text-center min-h-[180px] flex flex-col items-center justify-center gap-3 shadow-[0_6px_0_#fde047] active:shadow-none active:translate-y-1 transition-all"
        >
          {!flipped ? (
            <>
              <span className="font-fredoka text-3xl text-yellow-800">{card.term}</span>
              <span className="text-yellow-400 text-sm font-semibold">Tap to flip ↩</span>
            </>
          ) : (
            <>
              <span className="text-xs font-bold text-yellow-500 uppercase tracking-widest">
                {card.category}
              </span>
              <span className="font-bold text-gray-700 text-base leading-snug">{card.definition}</span>
            </>
          )}
        </button>
      )}

      {/* Score counters */}
      <div className="flex gap-3">
        <div className="flex-1 bg-green-50 border-2 border-green-200 rounded-2xl py-3 text-center">
          <div className="font-fredoka text-2xl text-green-600">{got}</div>
          <div className="text-xs font-bold text-green-500">Got it!</div>
        </div>
        <div className="flex-1 bg-red-50 border-2 border-red-200 rounded-2xl py-3 text-center">
          <div className="font-fredoka text-2xl text-red-500">{missed}</div>
          <div className="text-xs font-bold text-red-400">Need more practice</div>
        </div>
      </div>

      {/* Buttons — only show after flip */}
      {flipped && (
        <div className="flex gap-3">
          <Button
            variant="danger"
            fullWidth
            onClick={() => handleAnswer(false)}
            className="py-4 text-base"
          >
            😕 Not yet
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={() => handleAnswer(true)}
            className="py-4 text-base bg-green-500 shadow-[0_4px_0_#15803d] hover:bg-green-600"
          >
            😄 Got it!
          </Button>
        </div>
      )}
    </div>
  )
}
