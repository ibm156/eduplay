// ─── User & Auth ────────────────────────────────────────────────────────────

export type UserRole = 'student' | 'teacher' | 'admin'

export interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  avatar?: string
  xp: number
  level: number
  streak: number
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface LoginCredentials {
  username: string
  password: string
}

// ─── Subjects & Topics ───────────────────────────────────────────────────────

export interface Subject {
  id: number
  name: string
  icon: string
  color: string
  gradeLevel: string
  topicCount: number
  questionCount: number
  progressPercent: number
}

export interface Topic {
  id: number
  subjectId: number
  title: string
  description: string
  order: number
  questionCount: number
  isCompleted: boolean
}

// ─── Questions & Content ─────────────────────────────────────────────────────

export type QuestionType = 'multiple_choice' | 'true_false'

export interface Choice {
  id: number
  text: string
}

export interface Question {
  id: number
  topicId: number
  type: QuestionType
  text: string
  choices: Choice[]
  correctChoiceId: number
}

export interface Flashcard {
  id: number
  topicId: number
  term: string
  definition: string
  category: string
}

export interface WordScrambleItem {
  id: number
  topicId: number
  word: string
  hint: string
  scrambled: string
}

export interface MatchPair {
  id: number
  topicId: number
  term: string
  definition: string
}

// ─── Games ───────────────────────────────────────────────────────────────────

export type GameType = 'quiz' | 'flashcard' | 'scramble' | 'match'

export interface GameConfig {
  gameType: GameType
  topicId: number
  topicTitle: string
  subjectName: string
}

export interface GameResult {
  gameType: GameType
  topicId: number
  score: number
  total: number
  xpEarned: number
  durationSeconds: number
  completedAt: string
}

export interface GameSession {
  id: number
  gameType: GameType
  topicId: number
  score: number
  total: number
  xpEarned: number
  completedAt: string
}

// ─── Leaderboard & Badges ────────────────────────────────────────────────────

export interface LeaderboardEntry {
  rank: number
  userId: number
  username: string
  displayName: string
  avatarInitials: string
  xp: number
  gamesPlayed: number
  isCurrentUser: boolean
}

export interface Badge {
  id: number
  name: string
  icon: string
  description: string
  earnedAt?: string
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface ApiError {
  detail?: string
  [key: string]: unknown
}
