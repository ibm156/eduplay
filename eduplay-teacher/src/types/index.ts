// ─── Auth ────────────────────────────────────────────────────────────────────
export interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  role: 'student' | 'teacher' | 'admin'
  schoolLevel: string
  yearGroup: string
  xp: number
  level: number
  streak: number
}
export interface LoginCredentials { username: string; password: string }
export interface AuthTokens { access: string; refresh: string }

// ─── Content ─────────────────────────────────────────────────────────────────
export interface Subject {
  id: number
  name: string
  icon: string
  color: string
  gradeLevel: string
  topicCount: number
  questionCount: number
}

export interface Topic {
  id: number
  subjectId: number
  subjectName?: string
  title: string
  description: string
  order: number
  questionCount: number
  isActive: boolean
}

export interface Choice {
  id?: number
  text: string
  isCorrect: boolean
  order: number
}

export interface Question {
  id: number
  topicId: number
  topicTitle?: string
  type: 'multiple_choice' | 'true_false'
  text: string
  explanation: string
  choices: Choice[]
  isActive: boolean
}

export interface Flashcard {
  id: number
  topicId: number
  topicTitle?: string
  term: string
  definition: string
  category: string
  order: number
}

export interface WordScramble {
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

// ─── Analytics ───────────────────────────────────────────────────────────────
export interface StudentProgress {
  id: number
  username: string
  displayName: string
  avatarInitials: string
  yearGroup: string
  xp: number
  level: number
  streak: number
  gamesPlayed: number
  avgAccuracy: number
  lastActive: string | null
}

export interface TopicPerformance {
  topicId: number
  topicTitle: string
  subjectName: string
  totalAttempts: number
  avgAccuracy: number
  studentsAttempted: number
}

export interface GameTypeStats {
  gameType: string
  count: number
  avgAccuracy: number
  totalXp: number
}

export interface ClassAnalytics {
  totalStudents: number
  activeToday: number
  totalGamesPlayed: number
  avgClassAccuracy: number
  topStudents: StudentProgress[]
  weakTopics: TopicPerformance[]
  gameTypeBreakdown: GameTypeStats[]
  xpOverTime: { date: string; totalXp: number }[]
}
