// ─── Mock API ─────────────────────────────────────────────────────────────────
// Replaces all real API calls with local data.
// Swap back to the real api/* files when Django backend is ready.

import type {
  User, Subject, Topic, Question, Flashcard,
  WordScrambleItem, MatchPair, LeaderboardEntry,
  GameSession, Badge, AuthTokens, LoginCredentials,
} from '@/types'

import {
  MOCK_USERS, MOCK_SUBJECTS, MOCK_TOPICS,
  MOCK_QUESTIONS, DEFAULT_QUESTIONS,
  MOCK_FLASHCARDS, DEFAULT_FLASHCARDS,
  MOCK_SCRAMBLE, DEFAULT_SCRAMBLE,
  MOCK_MATCH, DEFAULT_MATCH,
  MOCK_LEADERBOARD, MOCK_BADGES, MOCK_HISTORY,
} from './mockData'

// Simulate a brief network delay so loading states work
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms))

// ─── Auth ─────────────────────────────────────────────────────────────────────

let currentUser: User | null = null

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthTokens> => {
    await delay()
    const record = MOCK_USERS[credentials.username.toLowerCase()]
    if (!record || record.password !== credentials.password) {
      throw new Error('Invalid credentials')
    }
    currentUser = { ...record.user }
    localStorage.setItem('mock_user', JSON.stringify(currentUser))
    return { access: 'mock-access-token', refresh: 'mock-refresh-token' }
  },

  refresh: async (): Promise<{ access: string }> => {
    return { access: 'mock-access-token' }
  },

  getMe: async (): Promise<User> => {
    await delay(100)
    const stored = localStorage.getItem('mock_user')
    if (stored) return JSON.parse(stored) as User
    if (currentUser) return currentUser
    throw new Error('Not authenticated')
  },

  logout: async (): Promise<void> => {
    await delay(100)
    currentUser = null
    localStorage.removeItem('mock_user')
  },
}

// ─── Subjects ─────────────────────────────────────────────────────────────────

export const subjectsApi = {
  list: async (): Promise<Subject[]> => {
    await delay()
    return MOCK_SUBJECTS
  },

  getTopics: async (subjectId: number): Promise<Topic[]> => {
    await delay()
    return MOCK_TOPICS[subjectId] ?? []
  },
}

// ─── Topic content ────────────────────────────────────────────────────────────

export const topicsApi = {
  getQuestions: async (topicId: number): Promise<Question[]> => {
    await delay()
    return MOCK_QUESTIONS[topicId] ?? DEFAULT_QUESTIONS.map((q) => ({ ...q, topicId }))
  },

  getFlashcards: async (topicId: number): Promise<Flashcard[]> => {
    await delay()
    return MOCK_FLASHCARDS[topicId] ?? DEFAULT_FLASHCARDS.map((f) => ({ ...f, topicId }))
  },

  getScrambleWords: async (topicId: number): Promise<WordScrambleItem[]> => {
    await delay()
    return MOCK_SCRAMBLE[topicId] ?? DEFAULT_SCRAMBLE.map((s) => ({ ...s, topicId }))
  },

  getMatchPairs: async (topicId: number): Promise<MatchPair[]> => {
    await delay()
    return MOCK_MATCH[topicId] ?? DEFAULT_MATCH.map((m) => ({ ...m, topicId }))
  },
}

// ─── Games ────────────────────────────────────────────────────────────────────

const sessionStore: GameSession[] = [...MOCK_HISTORY]
let nextSessionId = 10

export const gamesApi = {
  submitResult: async (result: Omit<GameSession, 'id' | 'completedAt'>): Promise<GameSession> => {
    await delay(200)
    const session: GameSession = {
      ...result,
      id: nextSessionId++,
      completedAt: new Date().toISOString(),
    }
    sessionStore.unshift(session)

    // Update stored user XP
    const stored = localStorage.getItem('mock_user')
    if (stored) {
      const user: User = JSON.parse(stored)
      user.xp += result.xpEarned
      user.level = Math.floor(user.xp / 500) + 1
      localStorage.setItem('mock_user', JSON.stringify(user))
    }
    return session
  },

  getHistory: async (): Promise<GameSession[]> => {
    await delay()
    return sessionStore
  },

  getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    await delay()
    // Mark current user in leaderboard
    const stored = localStorage.getItem('mock_user')
    const me: User | null = stored ? JSON.parse(stored) : null
    return MOCK_LEADERBOARD.map((e) => ({
      ...e,
      isCurrentUser: me ? e.username === me.username : false,
    }))
  },

  getBadges: async (): Promise<Badge[]> => {
    await delay()
    return MOCK_BADGES
  },
}
