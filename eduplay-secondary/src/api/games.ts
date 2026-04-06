import apiClient from './client'
import type { GameSession, LeaderboardEntry, Badge } from '@/types'

export const gamesApi = {
  submitResult: async (result: Omit<GameSession, 'id' | 'completedAt'>): Promise<GameSession> => {
    const { data } = await apiClient.post<{ session: GameSession }>('/games/sessions/', {
      game_type:        result.gameType,
      topic_id:         result.topicId,
      score:            result.score,
      total:            result.total,
      xp_earned:        result.xpEarned,
      duration_seconds: result.durationSeconds,
    })
    return data.session
  },
  getHistory: async (): Promise<GameSession[]> => {
    const { data } = await apiClient.get<GameSession[]>('/games/sessions/my/')
    return data
  },
  getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    const { data } = await apiClient.get<LeaderboardEntry[]>('/games/leaderboard/')
    return data
  },
  getBadges: async (): Promise<Badge[]> => {
    const { data } = await apiClient.get<Badge[]>('/progress/badges/my/')
    return data
  },
}
