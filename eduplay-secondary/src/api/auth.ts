import apiClient from './client'
import type { AuthTokens, LoginCredentials, User } from '@/types'

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthTokens> => {
    const { data } = await apiClient.post<AuthTokens & { user: User }>('/auth/token/', credentials)
    return data
  },
  refresh: async (refresh: string): Promise<{ access: string }> => {
    const { data } = await apiClient.post<{ access: string }>('/auth/token/refresh/', { refresh })
    return data
  },
  getMe: async (): Promise<User> => {
    const { data } = await apiClient.get<User>('/auth/me/')
    return data
  },
  logout: async (): Promise<void> => {
    const refresh = localStorage.getItem('refresh_token')
    if (refresh) await apiClient.post('/auth/logout/', { refresh }).catch(() => {})
  },
}
