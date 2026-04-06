import apiClient from './client'
import type { GameResult, GameSession, LeaderboardEntry, Badge } from '@/types'

export const gamesApi = {
  submitResult: async (result: Omit<GameResult, 'completedAt'>): Promise<GameSession> => {
    const { data } = await apiClient.post<GameSession>('/games/sessions/', result)
    return data
  },

  getHistory: async (): Promise<GameSession[]> => {
    const { data } = await apiClient.get<GameSession[]>('/games/sessions/my/')
    return data
  },

  getLeaderboard: async (subjectId?: number): Promise<LeaderboardEntry[]> => {
    const params = subjectId ? { subject: subjectId } : {}
    const { data } = await apiClient.get<LeaderboardEntry[]>('/games/leaderboard/', { params })
    return data
  },

  getBadges: async (): Promise<Badge[]> => {
    const { data } = await apiClient.get<Badge[]>('/games/badges/my/')
    return data
  },
}
