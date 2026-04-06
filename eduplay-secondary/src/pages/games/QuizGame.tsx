import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { topicsApi } from '@/api'
import { useGameStore, calcXP } from '@/stores/gameStore'
import type { GameConfig } from '@/types'
import clsx from 'clsx'

const QUESTION_TIME = 20
const LETTERS = ['A', 'B', 'C', 'D']

export const QuizGame: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const config = location.state as GameConfig | null
  const { endGame } = useGameStore()
  const topicId = config?.topicId ?? 0

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ['quiz', topicId],
    queryFn: () => topicsApi.getQuestions(topicId),
    enabled: topicId > 0,
  })

  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTime = useRef(Date.now())

  const currentQ = questions[idx]

  const advance = useCallback(() => {
    if (idx + 1 < questions.length) {
      setIdx((i) => i + 1)
      setSelected(null)
      setAnswered(false)
      setTimeLeft(QUESTION_TIME)
    } else {
      const finalScore = score + (selected === currentQ?.correctChoiceId ? 1 : 0)
      endGame({
        gameType: 'quiz', topicId,
        score: finalScore, total: questions.length,
        xpEarned: calcXP('quiz', finalScore, questions.length),
        durationSeconds: Math.round((Date.now() - startTime.current) / 1000),
        completedAt: new Date().toISOString(),
      })
      navigate('/games/result', { replace: true })
    }
  }, [idx, questions, score, selected, currentQ, endGame, topicId, navigate])

  useEffect(() => {
    if (answered || !currentQ) return
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current!); setAnswered(true); setTimeout(advance, 900); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current!)
  }, [idx, answered, currentQ, advance])

  const handleSelect = (choiceId: number) => {
    if (answered) return
    clearInterval(timerRef.current!)
    setSelected(choiceId)
    setAnswered(true)
    if (choiceId === currentQ?.correctChoiceId) setScore((s) => s + 1)
    setTimeout(advance, 900)
  }

  if (!config) { navigate('/dashboard', { replace: true }); return null }

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <div className="text-5xl">❓</div>
      <p className="font-mono text-[#7B82A0] text-sm">Loading questions...</p>
    </div>
  )

  if (!currentQ) return null

  const progress = ((idx + 1) / questions.length) * 100
  const timerPct = (timeLeft / QUESTION_TIME) * 100

  return (
    <div className="flex flex-col gap-5 animate-fade-up max-w-xl">
      <button onClick={() => navigate('/games')} className="font-mono text-[12px] text-[#7B82A0] hover:text-[#F0F2FF] flex items-center gap-1 w-fit">
        ← back to games
      </button>

      <div className="bg-[#191C26] border border-[#252836] rounded-xl p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-[11px] bg-[#6C63FF]/15 text-[#9B87FF] px-2.5 py-1 rounded">
            ❓ QUIZ BLITZ · {config.subjectName || 'PHYSICS'}
          </span>
          <span className={clsx(
            'font-mono text-[18px] font-medium transition-colors',
            timeLeft <= 5 ? 'text-[#FF6B6B] animate-pulse' : 'text-[#FF6B6B]',
          )}>
            0:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
          </span>
        </div>

        {/* Progress bars */}
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[11px] text-[#7B82A0]">Q {idx + 1} / {questions.length}</span>
          <span className="font-mono text-[11px] text-[#6C63FF]">{score} correct</span>
        </div>
        <div className="bg-[#252836] rounded-full h-1 mb-1 overflow-hidden">
          <div className="h-full bg-[#6C63FF] rounded-full transition-all duration-400" style={{ width: `${progress}%` }} />
        </div>
        <div className="bg-[#252836] rounded-full h-0.5 mb-5 overflow-hidden">
          <div
            className={clsx('h-full rounded-full transition-all duration-1000', timeLeft <= 5 ? 'bg-[#FF6B6B]' : 'bg-[#F5A623]')}
            style={{ width: `${timerPct}%` }}
          />
        </div>

        {/* Question */}
        <div className="bg-[#0D0F14] border border-[#252836] rounded-xl p-5 mb-4">
          <p className="text-[16px] font-medium text-[#F0F2FF] leading-relaxed">{currentQ.text}</p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-2.5">
          {currentQ.choices.map((choice, i) => {
            const isCorrect = choice.id === currentQ.correctChoiceId
            const isSelected = choice.id === selected
            return (
              <button
                key={choice.id}
                onClick={() => handleSelect(choice.id)}
                disabled={answered}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left font-medium text-[13px] transition-all duration-200',
                  !answered && 'bg-[#0D0F14] border-[#252836] hover:border-[#6C63FF]/50 hover:bg-[#6C63FF]/06 text-[#F0F2FF]',
                  answered && isCorrect && 'bg-[#00D4AA]/08 border-[#00D4AA]/40 text-[#00D4AA]',
                  answered && isSelected && !isCorrect && 'bg-[#FF6B6B]/08 border-[#FF6B6B]/40 text-[#FF6B6B]',
                  answered && !isSelected && !isCorrect && 'bg-[#0D0F14] border-[#252836] text-[#7B82A0] opacity-40',
                )}
              >
                <span className={clsx(
                  'w-6 h-6 rounded-md flex items-center justify-center font-mono text-[11px] shrink-0',
                  answered && isCorrect  ? 'bg-[#00D4AA]/20 text-[#00D4AA]' :
                  answered && isSelected ? 'bg-[#FF6B6B]/20 text-[#FF6B6B]' :
                  'bg-[#252836] text-[#7B82A0]',
                )}>
                  {LETTERS[i]}
                </span>
                <span className="flex-1">{choice.text}</span>
                {answered && isCorrect  && <span className="text-[#00D4AA] text-sm">✓</span>}
                {answered && isSelected && !isCorrect && <span className="text-[#FF6B6B] text-sm">✗</span>}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
