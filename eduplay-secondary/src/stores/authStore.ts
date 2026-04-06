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
  addXp: (n: number) => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null })
        try {
          const tokens = await authApi.login(credentials)
          localStorage.setItem('access_token', tokens.access)
          localStorage.setItem('refresh_token', tokens.refresh)
          const user = await authApi.getMe()
          set({ user, isAuthenticated: true, isLoading: false })
        } catch {
          set({ error: 'Invalid username or password', isLoading: false })
        }
      },

      logout: async () => {
        await authApi.logout()
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        set({ user: null, isAuthenticated: false })
      },

      fetchMe: async () => {
        const token = localStorage.getItem('access_token')
        if (!token) return
        set({ isLoading: true })
        try {
          const user = await authApi.getMe()
          set({ user, isAuthenticated: true, isLoading: false })
        } catch {
          set({ isAuthenticated: false, isLoading: false })
        }
      },

      addXp: (amount) => {
        const { user } = get()
        if (!user) return
        const xp = user.xp + amount
        set({ user: { ...user, xp, level: Math.floor(xp / 500) + 1 } })
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'eduplay-sec-auth',
      partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }),
    }
  )
)
