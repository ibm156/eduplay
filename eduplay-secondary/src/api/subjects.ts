import apiClient from './client'
import type { Subject, Topic, Question, Flashcard, WordScrambleItem, MatchPair } from '@/types'

export const subjectsApi = {
  list: async (): Promise<Subject[]> => {
    const { data } = await apiClient.get<Subject[]>('/subjects/')
    return data
  },
  getTopics: async (subjectId: number): Promise<Topic[]> => {
    const { data } = await apiClient.get<Topic[]>(`/subjects/${subjectId}/topics/`)
    return data
  },
}

export const topicsApi = {
  getQuestions: async (topicId: number): Promise<Question[]> => {
    const { data } = await apiClient.get<Question[]>(`/topics/${topicId}/questions/`)
    return data
  },
  getFlashcards: async (topicId: number): Promise<Flashcard[]> => {
    const { data } = await apiClient.get<Flashcard[]>(`/topics/${topicId}/flashcards/`)
    return data
  },
  getScrambleWords: async (topicId: number): Promise<WordScrambleItem[]> => {
    const { data } = await apiClient.get<WordScrambleItem[]>(`/topics/${topicId}/scramble/`)
    return data
  },
  getMatchPairs: async (topicId: number): Promise<MatchPair[]> => {
    const { data } = await apiClient.get<MatchPair[]>(`/topics/${topicId}/match/`)
    return data
  },
}
