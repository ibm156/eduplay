import React, { useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { topicsApi } from '@/api'
import { useGameStore, calcXP } from '@/stores/gameStore'
import type { GameConfig } from '@/types'

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

  if (!config) { navigate('/dashboard', { replace: true }); return null }

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <div className="text-5xl">🃏</div>
      <p className="font-mono text-[#7B82A0] text-sm">Loading cards...</p>
    </div>
  )

  const card = cards[idx]
  const total = cards.length

  const handleAnswer = (remembered: boolean) => {
    const newGot = got + (remembered ? 1 : 0)
    const newMissed = missed + (remembered ? 0 : 1)
    const next = idx + 1
    if (next >= total) {
      endGame({
        gameType: 'flashcard', topicId,
        score: newGot, total,
        xpEarned: calcXP('flashcard', newGot, total),
        durationSeconds: Math.round((Date.now() - startTime.current) / 1000),
        completedAt: new Date().toISOString(),
      })
      navigate('/games/result', { replace: true })
    } else {
      remembered ? setGot(newGot) : setMissed(newMissed)
      setIdx(next)
      setFlipped(false)
    }
  }

  const progress = ((idx + 1) / total) * 100

  return (
    <div className="flex flex-col gap-5 animate-fade-up max-w-xl">
      <button onClick={() => navigate('/games')} className="font-mono text-[12px] text-[#7B82A0] hover:text-[#F0F2FF] flex items-center gap-1 w-fit">
        ← back to games
      </button>

      <div className="bg-[#191C26] border border-[#252836] rounded-xl p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-[11px] bg-[#00D4AA]/12 text-[#00D4AA] px-2.5 py-1 rounded">
            🃏 FLASHCARD FLIP
          </span>
          <span className="font-mono text-[12px] text-[#7B82A0]">{idx + 1} / {total}</span>
        </div>

        {/* Progress */}
        <div className="bg-[#252836] rounded-full h-1 mb-5 overflow-hidden">
          <div className="h-full bg-[#00D4AA] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        {/* Card */}
        <button
          onClick={() => setFlipped((f) => !f)}
          className="w-full bg-[#0D0F14] border border-[#252836] hover:border-[#2E3245] rounded-xl p-8 text-center min-h-[200px] flex flex-col items-center justify-center gap-4 transition-all mb-4 group"
        >
          {!flipped ? (
            <>
              <span className="font-mono text-[11px] text-[#6C63FF] uppercase tracking-widest">
                {card?.category}
              </span>
              <span className="font-syne text-[26px] font-bold text-[#F0F2FF]">{card?.term}</span>
              <span className="font-mono text-[11px] text-[#3A3F5C] group-hover:text-[#7B82A0] transition-colors">
                click to reveal definition
              </span>
            </>
          ) : (
            <>
              <span className="font-mono text-[11px] text-[#6C63FF] uppercase tracking-widest">
                {card?.category}
              </span>
              <span className="text-[15px] font-medium text-[#F0F2FF] leading-relaxed max-w-xs">
                {card?.definition}
              </span>
              <span className="font-mono text-[11px] text-[#3A3F5C]">click to flip back</span>
            </>
          )}
        </button>

        {/* Score counters */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-[#00D4AA]/06 border border-[#00D4AA]/20 rounded-xl py-3 text-center">
            <div className="font-syne text-[22px] font-bold text-[#00D4AA]">{got}</div>
            <div className="font-mono text-[11px] text-[#7B82A0]">recalled</div>
          </div>
          <div className="bg-[#FF6B6B]/06 border border-[#FF6B6B]/20 rounded-xl py-3 text-center">
            <div className="font-syne text-[22px] font-bold text-[#FF6B6B]">{missed}</div>
            <div className="font-mono text-[11px] text-[#7B82A0]">need more practice</div>
          </div>
        </div>

        {/* Actions — only after flip */}
        {flipped && (
          <div className="flex gap-3 animate-fade-up">
            <button
              onClick={() => handleAnswer(false)}
              className="flex-1 bg-transparent border border-[#FF6B6B]/30 text-[#FF6B6B] rounded-xl py-3 font-semibold text-[13px] hover:bg-[#FF6B6B]/08 transition-all"
            >
              ✕ Need more practice
            </button>
            <button
              onClick={() => handleAnswer(true)}
              className="flex-1 bg-transparent border border-[#00D4AA]/30 text-[#00D4AA] rounded-xl py-3 font-semibold text-[13px] hover:bg-[#00D4AA]/08 transition-all"
            >
              ✓ Got it
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
