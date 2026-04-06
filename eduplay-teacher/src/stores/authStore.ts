import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, LoginCredentials } from '@/types'
import { authApi } from '@/api'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (c: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  fetchMe: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null })
        try {
          const { tokens, user } = await authApi.login(credentials)
          if (user.role !== 'teacher' && user.role !== 'admin') {
            throw new Error('Access restricted to teachers and admins.')
          }
          localStorage.setItem('teacher_access_token', tokens.access)
          localStorage.setItem('teacher_refresh_token', tokens.refresh)
          set({ user, isAuthenticated: true, isLoading: false })
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : 'Invalid credentials'
          set({ error: msg, isLoading: false })
        }
      },

      logout: async () => {
        await authApi.logout()
        localStorage.removeItem('teacher_access_token')
        localStorage.removeItem('teacher_refresh_token')
        set({ user: null, isAuthenticated: false })
      },

      fetchMe: async () => {
        const token = localStorage.getItem('teacher_access_token')
        if (!token) return
        set({ isLoading: true })
        try {
          const user = await authApi.getMe()
          set({ user, isAuthenticated: true, isLoading: false })
        } catch {
          set({ isAuthenticated: false, isLoading: false })
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'eduplay-teacher-auth',
      partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }),
    }
  )
)
