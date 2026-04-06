import apiClient from './client'
import type { Subject, Topic, Question, Flashcard, WordScramble, MatchPair } from '@/types'

// ─── Subjects ────────────────────────────────────────────────────────────────
export const subjectsApi = {
  list: () => apiClient.get<Subject[]>('/subjects/').then((r) => r.data),
}

// ─── Topics ──────────────────────────────────────────────────────────────────
export const topicsApi = {
  list: (subjectId: number) =>
    apiClient.get<Topic[]>(`/subjects/${subjectId}/topics/`).then((r) => r.data),

  create: (data: Partial<Topic>) =>
    apiClient.post<Topic>(`/subjects/${data.subjectId}/topics/`, data).then((r) => r.data),

  update: (id: number, data: Partial<Topic>) =>
    apiClient.patch<Topic>(`/admin/topics/${id}/`, data).then((r) => r.data),

  delete: (id: number) => apiClient.delete(`/admin/topics/${id}/`),
}

// ─── Questions ───────────────────────────────────────────────────────────────
export const questionsApi = {
  list: (topicId: number) =>
    apiClient.get<Question[]>(`/admin/questions/?topic=${topicId}`).then((r) => r.data),

  create: (data: Partial<Question>) =>
    apiClient.post<Question>('/admin/questions/', data).then((r) => r.data),

  update: (id: number, data: Partial<Question>) =>
    apiClient.patch<Question>(`/admin/questions/${id}/`, data).then((r) => r.data),

  delete: (id: number) => apiClient.delete(`/admin/questions/${id}/`),
}

// ─── Flashcards ──────────────────────────────────────────────────────────────
export const flashcardsApi = {
  list: (topicId: number) =>
    apiClient.get<Flashcard[]>(`/admin/flashcards/?topic=${topicId}`).then((r) => r.data),

  create: (data: Partial<Flashcard>) =>
    apiClient.post<Flashcard>('/admin/flashcards/', data).then((r) => r.data),

  update: (id: number, data: Partial<Flashcard>) =>
    apiClient.patch<Flashcard>(`/admin/flashcards/${id}/`, data).then((r) => r.data),

  delete: (id: number) => apiClient.delete(`/admin/flashcards/${id}/`),
}

// ─── Word Scramble ────────────────────────────────────────────────────────────
export const scrambleApi = {
  list: (topicId: number) =>
    apiClient.get<WordScramble[]>(`/admin/scramble/?topic=${topicId}`).then((r) => r.data),

  create: (data: Partial<WordScramble>) =>
    apiClient.post<WordScramble>('/admin/scramble/', data).then((r) => r.data),

  update: (id: number, data: Partial<WordScramble>) =>
    apiClient.patch<WordScramble>(`/admin/scramble/${id}/`, data).then((r) => r.data),

  delete: (id: number) => apiClient.delete(`/admin/scramble/${id}/`),
}

// ─── Match Pairs ─────────────────────────────────────────────────────────────
export const matchApi = {
  list: (topicId: number) =>
    apiClient.get<MatchPair[]>(`/admin/match/?topic=${topicId}`).then((r) => r.data),

  create: (data: Partial<MatchPair>) =>
    apiClient.post<MatchPair>('/admin/match/', data).then((r) => r.data),

  update: (id: number, data: Partial<MatchPair>) =>
    apiClient.patch<MatchPair>(`/admin/match/${id}/`, data).then((r) => r.data),

  delete: (id: number) => apiClient.delete(`/admin/match/${id}/`),
}
