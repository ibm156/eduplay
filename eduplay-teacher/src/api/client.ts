import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('teacher_access_token')
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`
  return config
})

let isRefreshing = false
let queue: Array<(t: string) => void> = []

apiClient.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const orig = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    if (error.response?.status === 401 && !orig._retry) {
      orig._retry = true
      if (isRefreshing) {
        return new Promise((res) => { queue.push((t) => { orig.headers.Authorization = `Bearer ${t}`; res(apiClient(orig)) }) })
      }
      isRefreshing = true
      try {
        const refresh = localStorage.getItem('teacher_refresh_token')
        if (!refresh) throw new Error()
        const { data } = await axios.post(`${BASE_URL}/auth/token/refresh/`, { refresh })
        localStorage.setItem('teacher_access_token', data.access)
        queue.forEach((cb) => cb(data.access)); queue = []
        orig.headers.Authorization = `Bearer ${data.access}`
        return apiClient(orig)
      } catch {
        localStorage.removeItem('teacher_access_token')
        localStorage.removeItem('teacher_refresh_token')
        window.location.href = '/login'
        return Promise.reject(error)
      } finally { isRefreshing = false }
    }
    return Promise.reject(error)
  }
)

export default apiClient
