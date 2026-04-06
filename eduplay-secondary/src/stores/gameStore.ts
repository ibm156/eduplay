import { create } from 'zustand'
import type { GameConfig, GameResult, GameType } from '@/types'

interface GameState {
  activeGame: GameConfig | null
  lastResult: GameResult | null
  startGame: (c: GameConfig) => void
  endGame: (r: GameResult) => void
  clearGame: () => void
}

export const useGameStore = create<GameState>()((set) => ({
  activeGame: null,
  lastResult: null,
  startGame: (config) => set({ activeGame: config, lastResult: null }),
  endGame: (result) => set({ lastResult: result, activeGame: null }),
  clearGame: () => set({ activeGame: null, lastResult: null }),
}))

const XP_TABLE: Record<GameType, (s: number, t: number) => number> = {
  quiz:      (s, t) => Math.round((s / t) * 60) + (s === t ? 20 : 0),
  flashcard: (s, t) => Math.round((s / t) * 30),
  scramble:  (s, t) => Math.round((s / t) * 45) + (s === t ? 15 : 0),
  match:     (s, t) => Math.round((s / t) * 40) + (s === t ? 10 : 0),
}

export const calcXP = (type: GameType, score: number, total: number) =>
  XP_TABLE[type](score, total)

export const calcStars = (score: number, total: number): 1 | 2 | 3 => {
  const p = score / total
  return p >= 0.9 ? 3 : p >= 0.6 ? 2 : 1
}
