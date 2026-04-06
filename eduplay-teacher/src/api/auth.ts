import apiClient from './client'
import type { AuthTokens, LoginCredentials, User } from '@/types'

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<{ tokens: AuthTokens; user: User }> => {
    const { data } = await apiClient.post<AuthTokens & { user: User }>('/auth/token/', credentials)
    return { tokens: { access: data.access, refresh: data.refresh }, user: data.user }
  },
  getMe: async (): Promise<User> => {
    const { data } = await apiClient.get<User>('/auth/me/')
    return data
  },
  logout: async (): Promise<void> => {
    const refresh = localStorage.getItem('teacher_refresh_token')
    if (refresh) await apiClient.post('/auth/logout/', { refresh }).catch(() => {})
  },
}
