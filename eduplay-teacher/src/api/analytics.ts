import apiClient from './client'
import type { StudentProgress, ClassAnalytics } from '@/types'

export const analyticsApi = {
  getClassAnalytics: async (): Promise<ClassAnalytics> => {
    try {
      const { data } = await apiClient.get<ClassAnalytics>('/progress/class-analytics/')
      return data
    } catch {
      // Return mock analytics if endpoint not available
      return MOCK_ANALYTICS
    }
  },

  getStudents: async (): Promise<StudentProgress[]> => {
    try {
      const { data } = await apiClient.get<StudentProgress[]>('/auth/users/?role=student')
      return data
    } catch {
      return MOCK_STUDENTS
    }
  },
}

// ─── Mock Analytics (used when backend endpoint isn't ready) ─────────────────
const MOCK_STUDENTS: StudentProgress[] = [
  { id: 1, username: 'layla',  displayName: 'Layla M.',  avatarInitials: 'LM', yearGroup: 'Year 4', xp: 620,  level: 2, streak: 5,  gamesPlayed: 17, avgAccuracy: 84, lastActive: new Date(Date.now() - 1000*60*30).toISOString() },
  { id: 2, username: 'omar',   displayName: 'Omar A.',   avatarInitials: 'OA', yearGroup: 'Year 4', xp: 890,  level: 2, streak: 8,  gamesPlayed: 23, avgAccuracy: 91, lastActive: new Date(Date.now() - 1000*60*60*2).toISOString() },
  { id: 3, username: 'zara',   displayName: 'Zara H.',   avatarInitials: 'ZH', yearGroup: 'Year 5', xp: 750,  level: 2, streak: 3,  gamesPlayed: 19, avgAccuracy: 78, lastActive: new Date(Date.now() - 1000*60*60*5).toISOString() },
  { id: 4, username: 'priya',  displayName: 'Priya L.',  avatarInitials: 'PL', yearGroup: 'Year 5', xp: 510,  level: 2, streak: 2,  gamesPlayed: 14, avgAccuracy: 72, lastActive: new Date(Date.now() - 1000*60*60*24).toISOString() },
  { id: 5, username: 'amir',   displayName: 'Amir M.',   avatarInitials: 'AM', yearGroup: 'Year 9', xp: 1240, level: 3, streak: 12, gamesPlayed: 31, avgAccuracy: 88, lastActive: new Date(Date.now() - 1000*60*10).toISOString() },
  { id: 6, username: 'sara',   displayName: 'Sara K.',   avatarInitials: 'SK', yearGroup: 'Year 9', xp: 1890, level: 4, streak: 20, gamesPlayed: 42, avgAccuracy: 95, lastActive: new Date(Date.now() - 1000*60*60).toISOString() },
  { id: 7, username: 'james',  displayName: 'James T.',  avatarInitials: 'JT', yearGroup: 'Year 9', xp: 1540, level: 4, streak: 7,  gamesPlayed: 28, avgAccuracy: 82, lastActive: new Date(Date.now() - 1000*60*60*3).toISOString() },
  { id: 8, username: 'chloe',  displayName: 'Chloe R.',  avatarInitials: 'CR', yearGroup: 'Year 9', xp: 980,  level: 2, streak: 4,  gamesPlayed: 22, avgAccuracy: 76, lastActive: new Date(Date.now() - 1000*60*60*48).toISOString() },
]

const MOCK_ANALYTICS: ClassAnalytics = {
  totalStudents: 8,
  activeToday: 3,
  totalGamesPlayed: 196,
  avgClassAccuracy: 83,
  topStudents: MOCK_STUDENTS.slice(0, 5).sort((a, b) => b.xp - a.xp),
  weakTopics: [
    { topicId: 3,  topicTitle: 'Fractions',        subjectName: 'Maths',    totalAttempts: 24, avgAccuracy: 58, studentsAttempted: 6 },
    { topicId: 7,  topicTitle: 'Punctuation',       subjectName: 'English',  totalAttempts: 18, avgAccuracy: 62, studentsAttempted: 5 },
    { topicId: 12, topicTitle: 'Organic Chemistry', subjectName: 'Chemistry',totalAttempts: 15, avgAccuracy: 64, studentsAttempted: 4 },
    { topicId: 5,  topicTitle: 'Space & Planets',   subjectName: 'Science',  totalAttempts: 20, avgAccuracy: 67, studentsAttempted: 5 },
  ],
  gameTypeBreakdown: [
    { gameType: 'quiz',      count: 72, avgAccuracy: 81, totalXp: 2880 },
    { gameType: 'flashcard', count: 58, avgAccuracy: 90, totalXp: 1740 },
    { gameType: 'scramble',  count: 41, avgAccuracy: 78, totalXp: 1845 },
    { gameType: 'match',     count: 25, avgAccuracy: 85, totalXp: 875  },
  ],
  xpOverTime: Array.from({ length: 14 }, (_, i) => ({
    date: new Date(Date.now() - (13 - i) * 86400000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    totalXp: Math.floor(800 + Math.random() * 600 + i * 80),
  })),
}
