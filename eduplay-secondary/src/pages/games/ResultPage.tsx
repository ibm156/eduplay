import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '@/stores/gameStore'
import { useAuthStore } from '@/stores/authStore'
import { calcStars } from '@/stores/gameStore'
import { useMutation } from '@tanstack/react-query'
import { gamesApi } from '@/api'
import { Button } from '@/components/ui/Button'

const GAME_LABELS: Record<string, string> = {
  quiz: 'Quiz Blitz', flashcard: 'Flashcard Flip', scramble: 'Word Scramble', match: 'Match It',
}

const MESSAGES: Record<1 | 2 | 3, { title: string; sub: string }> = {
  1: { title: 'Keep revising',  sub: 'Review the material and try again' },
  2: { title: 'Well done',      sub: 'Good effort — push for a perfect score' },
  3: { title: 'Outstanding',    sub: 'Perfect score — you nailed it' },
}

export const ResultPage: React.FC = () => {
  const navigate = useNavigate()
  const { lastResult, clearGame } = useGameStore()
  const { addXp } = useAuthStore()
  const submitMutation = useMutation({ mutationFn: gamesApi.submitResult })

  useEffect(() => {
    if (!lastResult) { navigate('/dashboard', { replace: true }); return }
    const { completedAt: _c, ...payload } = lastResult
    void submitMutation.mutateAsync(payload)
    addXp(lastResult.xpEarned)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!lastResult) return null

  const { score, total, xpEarned, gameType } = lastResult
  const pct = Math.round((score / total) * 100)
  const stars = calcStars(score, total)
  const msg = MESSAGES[stars]

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 animate-fade-up max-w-sm mx-auto">
      {/* Status badge */}
      <span className="font-mono text-[11px] bg-[#6C63FF]/15 text-[#9B87FF] px-3 py-1 rounded uppercase tracking-wider">
        {GAME_LABELS[gameType] ?? gameType} complete
      </span>

      {/* Title */}
      <div className="text-center">
        <h1 className="font-syne text-[32px] font-bold text-[#F0F2FF] mb-1">{msg.title}</h1>
        <p className="text-[#7B82A0] text-sm">{msg.sub}</p>
      </div>

      {/* Score ring */}
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" fill="none" stroke="#252836" strokeWidth="8" />
          <circle
            cx="60" cy="60" r="50" fill="none"
            stroke={stars === 3 ? '#00D4AA' : stars === 2 ? '#6C63FF' : '#FF6B6B'}
            strokeWidth="8" strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 50}`}
            strokeDashoffset={`${2 * Math.PI * 50 * (1 - pct / 100)}`}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-syne text-[28px] font-bold text-[#F0F2FF]">{pct}%</span>
          <span className="font-mono text-[11px] text-[#7B82A0]">{score}/{total}</span>
        </div>
      </div>

      {/* Stars */}
      <div className="flex gap-2">
        {[1,2,3].map((s) => (
          <span key={s} className={`text-[28px] transition-all ${s <= stars ? 'opacity-100' : 'opacity-15'}`}>★</span>
        ))}
      </div>

      {/* XP earned */}
      <div className="w-full bg-[#191C26] border border-[#6C63FF]/25 rounded-xl px-5 py-4 text-center">
        <div className="font-mono text-[11px] text-[#7B82A0] mb-1">XP EARNED</div>
        <div className="font-syne text-[28px] font-bold text-[#6C63FF]">+{xpEarned}</div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 w-full">
        <Button variant="ghost" fullWidth onClick={() => { clearGame(); navigate(-1) }}>
          Play again
        </Button>
        <Button variant="primary" fullWidth onClick={() => { clearGame(); navigate('/dashboard') }}>
          Dashboard →
        </Button>
      </div>
    </div>
  )
}
