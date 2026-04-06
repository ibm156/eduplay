import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '@/stores/gameStore'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/Button'
import { useMutation } from '@tanstack/react-query'
import { gamesApi } from '@/api'

const STAR_MESSAGES: Record<1 | 2 | 3, string> = {
  1: 'Keep trying! 💪',
  2: 'Well done! 👏',
  3: 'Amazing! 🎉',
}

const GAME_LABELS: Record<string, string> = {
  quiz: 'Quiz Blitz',
  flashcard: 'Flashcard Flip',
  scramble: 'Word Scramble',
  match: 'Match It!',
}

export const ResultPage: React.FC = () => {
  const navigate = useNavigate()
  const { lastResult, clearGame } = useGameStore()
  const { addXp } = useAuthStore()

  const submitMutation = useMutation({ mutationFn: gamesApi.submitResult })

  useEffect(() => {
    if (!lastResult) {
      navigate('/dashboard', { replace: true })
      return
    }
    // Submit result to backend & add XP locally
    const { completedAt, ...payload } = lastResult
    void submitMutation.mutateAsync(payload)
    addXp(lastResult.xpEarned)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!lastResult) return null

  const { score, total, xpEarned, gameType } = lastResult
  const pct = score / total
  const stars: 1 | 2 | 3 = pct >= 0.9 ? 3 : pct >= 0.6 ? 2 : 1

  const handlePlayAgain = () => {
    clearGame()
    navigate(-1)
  }

  const handleHome = () => {
    clearGame()
    navigate('/dashboard')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
      {/* Big emoji */}
      <div className="text-8xl animate-bounce">{stars === 3 ? '🎉' : stars === 2 ? '👏' : '💪'}</div>

      {/* Title */}
      <div>
        <h2 className="font-fredoka text-4xl text-violet-700 mb-1">
          {STAR_MESSAGES[stars]}
        </h2>
        <p className="text-gray-500 font-semibold">
          {GAME_LABELS[gameType] ?? gameType}
        </p>
      </div>

      {/* Score */}
      <div className="bg-white rounded-3xl border-2 border-violet-100 px-10 py-6 shadow-sm">
        <div className="font-fredoka text-6xl text-violet-600 mb-1">
          {score}/{total}
        </div>
        <div className="text-gray-500 font-semibold">correct answers</div>
      </div>

      {/* Stars */}
      <div className="flex gap-3">
        {[1, 2, 3].map((s) => (
          <span key={s} className={`text-5xl transition-all ${s <= stars ? 'opacity-100' : 'opacity-20'}`}>
            ⭐
          </span>
        ))}
      </div>

      {/* XP earned */}
      <div className="bg-violet-100 border-2 border-violet-200 rounded-2xl px-6 py-4 font-bold text-violet-700 text-lg">
        +{xpEarned} XP earned!
      </div>

      {/* Actions */}
      <div className="flex gap-3 w-full max-w-xs">
        <Button variant="ghost" fullWidth onClick={handlePlayAgain}>
          🔄 Again
        </Button>
        <Button variant="primary" fullWidth onClick={handleHome}>
          🏠 Home
        </Button>
      </div>
    </div>
  )
}
