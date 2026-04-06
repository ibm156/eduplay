import React, { useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { topicsApi } from '@/api'
import { useGameStore, calcXP } from '@/stores/gameStore'
import type { GameConfig, MatchPair } from '@/types'
import clsx from 'clsx'

type Side = 'term' | 'def'
interface Sel { side: Side; key: string }

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }

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
  const [selection, setSelection] = useState<Sel | null>(null)
  const [shuffledLeft, setShuffledLeft] = useState<MatchPair[]>([])
  const [shuffledRight, setShuffledRight] = useState<MatchPair[]>([])
  const initialised = useRef(false)
  const startTime = useRef(Date.now())
  const wrongCount = useRef(0)

  if (!config) { navigate('/dashboard', { replace: true }); return null }

  if (pairs.length > 0 && !initialised.current) {
    setShuffledLeft(shuffle(pairs))
    setShuffledRight(shuffle(pairs))
    initialised.current = true
  }

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <div className="text-5xl">🧩</div>
      <p className="font-mono text-[#7B82A0] text-sm">Setting up pairs...</p>
    </div>
  )

  const handleClick = (side: Side, key: string) => {
    if (matched.includes(key)) return
    if (!selection) { setSelection({ side, key }); return }
    if (selection.side === side) { setSelection({ side, key }); return }

    if (selection.key === key) {
      const newMatched = [...matched, key]
      setMatched(newMatched)
      setSelection(null)
      if (newMatched.length === pairs.length) {
        const score = Math.max(pairs.length - wrongCount.current, 0)
        endGame({
          gameType: 'match', topicId,
          score, total: pairs.length,
          xpEarned: calcXP('match', score, pairs.length),
          durationSeconds: Math.round((Date.now() - startTime.current) / 1000),
          completedAt: new Date().toISOString(),
        })
        setTimeout(() => navigate('/games/result', { replace: true }), 600)
      }
    } else {
      wrongCount.current++
      setWrong([selection.key, key])
      setTimeout(() => { setWrong([]); setSelection(null) }, 700)
    }
  }

  const itemClass = (side: Side, key: string) => clsx(
    'rounded-xl border px-3 py-3.5 text-[13px] font-medium cursor-pointer transition-all duration-150 text-center flex items-center justify-center min-h-[52px]',
    matched.includes(key) && side === 'term' && 'bg-[#00D4AA]/08 border-[#00D4AA]/40 text-[#00D4AA]',
    matched.includes(key) && side === 'def'  && 'bg-[#4DA6FF]/08 border-[#4DA6FF]/40 text-[#4DA6FF]',
    wrong.includes(key)   && 'bg-[#FF6B6B]/08 border-[#FF6B6B]/40 text-[#FF6B6B] animate-shake',
    selection?.side === side && selection?.key === key && !matched.includes(key) && !wrong.includes(key) &&
      'bg-[#6C63FF]/10 border-[#6C63FF]/50 text-[#9B87FF] scale-[1.02]',
    !matched.includes(key) && !wrong.includes(key) &&
      !(selection?.side === side && selection?.key === key) &&
      'bg-[#0D0F14] border-[#252836] text-[#F0F2FF] hover:border-[#2E3245]',
  )

  return (
    <div className="flex flex-col gap-5 animate-fade-up max-w-xl">
      <button onClick={() => navigate('/games')} className="font-mono text-[12px] text-[#7B82A0] hover:text-[#F0F2FF] flex items-center gap-1 w-fit">
        ← back to games
      </button>

      <div className="bg-[#191C26] border border-[#252836] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-[11px] bg-[#9B87FF]/15 text-[#9B87FF] px-2.5 py-1 rounded">
            🧩 MATCH IT
          </span>
          <span className="font-mono text-[12px] text-[#7B82A0]">{matched.length} / {pairs.length} matched</span>
        </div>

        <div className="bg-[#252836] rounded-full h-1 mb-5 overflow-hidden">
          <div
            className="h-full bg-[#9B87FF] rounded-full transition-all duration-500"
            style={{ width: `${(matched.length / Math.max(pairs.length, 1)) * 100}%` }}
          />
        </div>

        <p className="font-mono text-[12px] text-[#7B82A0] text-center mb-4">
          Select a concept, then its matching definition
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="font-mono text-[10px] text-[#7B82A0] uppercase tracking-wider mb-2 text-center">Concepts</p>
            <div className="flex flex-col gap-2">
              {shuffledLeft.map((p) => (
                <button key={p.id} className={itemClass('term', p.term)} onClick={() => handleClick('term', p.term)}>
                  {p.term}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-mono text-[10px] text-[#7B82A0] uppercase tracking-wider mb-2 text-center">Definitions</p>
            <div className="flex flex-col gap-2">
              {shuffledRight.map((p) => (
                <button key={p.id} className={itemClass('def', p.term)} onClick={() => handleClick('def', p.term)}>
                  {p.definition}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
