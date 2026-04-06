import { create } from 'zustand'
import type { GameConfig, GameResult, GameType } from '@/types'

interface GameState {
  activeGame: GameConfig | null
  lastResult: GameResult | null

  startGame: (config: GameConfig) => void
  endGame: (result: GameResult) => void
  clearGame: () => void
}

export const useGameStore = create<GameState>()((set) => ({
  activeGame: null,
  lastResult: null,

  startGame: (config) => set({ activeGame: config, lastResult: null }),

  endGame: (result) => set({ lastResult: result, activeGame: null }),

  clearGame: () => set({ activeGame: null, lastResult: null }),
}))

// ─── XP helpers ──────────────────────────────────────────────────────────────

export const XP_TABLE: Record<GameType, (score: number, total: number) => number> = {
  quiz: (score, total) => Math.round((score / total) * 50) + (score === total ? 20 : 0),
  flashcard: (score, total) => Math.round((score / total) * 30),
  scramble: (score, total) => Math.round((score / total) * 40) + (score === total ? 15 : 0),
  match: (score, total) => Math.round((score / total) * 35) + (score === total ? 10 : 0),
}

export function calcXP(gameType: GameType, score: number, total: number): number {
  return XP_TABLE[gameType](score, total)
}

export function calcStars(score: number, total: number): 1 | 2 | 3 {
  const pct = score / total
  if (pct >= 0.9) return 3
  if (pct >= 0.6) return 2
  return 1
}
