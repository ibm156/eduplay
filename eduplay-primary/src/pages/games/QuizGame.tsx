import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { topicsApi } from '@/api'
import { useGameStore, calcXP, calcStars } from '@/stores/gameStore'
import type { GameConfig, Question } from '@/types'
import clsx from 'clsx'

const QUESTION_TIME = 15 // seconds per question
const LETTERS = ['A', 'B', 'C', 'D']

export const QuizGame: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const config = location.state as GameConfig | null
  const { endGame } = useGameStore()

  const topicId = config?.topicId ?? 0
  const { data: questions = [], isLoading } = useQuery({
    queryKey: ['quiz-questions', topicId],
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

  const currentQ: Question | undefined = questions[idx]

  const advance = useCallback(() => {
    if (idx + 1 < questions.length) {
      setIdx((i) => i + 1)
      setSelected(null)
      setAnswered(false)
      setTimeLeft(QUESTION_TIME)
    } else {
      const finalScore = score + (selected === currentQ?.correctChoiceId ? 1 : 0)
      endGame({
        gameType: 'quiz',
        topicId,
        score: finalScore,
        total: questions.length,
        xpEarned: calcXP('quiz', finalScore, questions.length),
        durationSeconds: Math.round((Date.now() - startTime.current) / 1000),
        completedAt: new Date().toISOString(),
      })
      navigate('/games/result', { replace: true })
    }
  }, [idx, questions, score, selected, currentQ, endGame, topicId, navigate])

  // Countdown timer
  useEffect(() => {
    if (answered || !currentQ) return
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!)
          setAnswered(true)
          setTimeout(advance, 1000)
          return 0
        }
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

  if (!config) {
    navigate('/dashboard', { replace: true })
    return null
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <div className="text-5xl animate-bounce">❓</div>
        <p className="font-fredoka text-xl text-violet-600">Loading questions...</p>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="font-fredoka text-xl text-violet-600">No questions yet! 📭</p>
      </div>
    )
  }

  const progress = ((idx + 1) / questions.length) * 100
  const timerPct = (timeLeft / QUESTION_TIME) * 100

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="bg-red-100 text-red-700 font-bold text-sm px-3 py-1 rounded-full">
          ❓ Quiz Blitz
        </span>
        <span
          className={clsx(
            'font-fredoka text-2xl',
            timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-violet-600'
          )}
        >
          0:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
        </span>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs font-bold text-gray-400 mb-1.5">
          <span>Question {idx + 1} of {questions.length}</span>
          <span>{score} correct</span>
        </div>
        <div className="bg-violet-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-full bg-violet-500 rounded-full transition-all duration-400"
            style={{ width: `${progress}%` }}
          />
        </div>
        {/* Timer bar */}
        <div className="bg-gray-100 rounded-full h-1.5 mt-1 overflow-hidden">
          <div
            className={clsx(
              'h-full rounded-full transition-all duration-1000',
              timeLeft <= 5 ? 'bg-red-400' : 'bg-yellow-400'
            )}
            style={{ width: `${timerPct}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-violet-50 rounded-3xl p-5 text-center border-2 border-violet-100">
        <p className="font-bold text-gray-800 text-lg leading-snug">{currentQ?.text}</p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2.5">
        {currentQ?.choices.map((choice, i) => {
          const isCorrect = choice.id === currentQ.correctChoiceId
          const isSelected = choice.id === selected
          return (
            <button
              key={choice.id}
              onClick={() => handleSelect(choice.id)}
              disabled={answered}
              className={clsx(
                'flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 text-left font-bold transition-all duration-200',
                !answered && 'hover:border-violet-400 hover:bg-violet-50 bg-white border-gray-100',
                answered && isCorrect && 'bg-green-50 border-green-400 text-green-800',
                answered && isSelected && !isCorrect && 'bg-red-50 border-red-400 text-red-700',
                answered && !isSelected && !isCorrect && 'bg-white border-gray-100 opacity-50'
              )}
            >
              <span
                className={clsx(
                  'w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0',
                  answered && isCorrect ? 'bg-green-200 text-green-800' :
                  answered && isSelected ? 'bg-red-200 text-red-700' :
                  'bg-violet-100 text-violet-700'
                )}
              >
                {LETTERS[i]}
              </span>
              <span className="text-sm">{choice.text}</span>
              {answered && isCorrect && <span className="ml-auto text-lg">✅</span>}
              {answered && isSelected && !isCorrect && <span className="ml-auto text-lg">❌</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
