import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/Button'

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { login, isLoading, error, clearError } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    await login({ username, password })
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#F7F3FF] font-nunito flex flex-col items-center justify-center px-6">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-200 rounded-full -translate-y-1/2 translate-x-1/4 opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-200 rounded-full translate-y-1/3 -translate-x-1/4 opacity-50 pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🎓</div>
          <h1 className="font-fredoka text-5xl text-violet-600 leading-none">
            Edu<span className="text-red-400">Play</span>
          </h1>
          <p className="text-gray-500 font-semibold mt-2 text-lg">
            Learning is an adventure!
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border-2 border-violet-100 p-7">
          <h2 className="font-fredoka text-2xl text-violet-700 mb-6 text-center">
            Sign in to play! 🚀
          </h2>

          {error && (
            <div className="mb-4 bg-red-50 border-2 border-red-200 rounded-2xl px-4 py-3 text-red-700 font-bold text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1.5 ml-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 rounded-2xl border-2 border-violet-200 bg-violet-50 text-gray-800 font-semibold placeholder:text-gray-400 focus:outline-none focus:border-violet-500 focus:bg-white transition-all"
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1.5 ml-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-2xl border-2 border-violet-200 bg-violet-50 text-gray-800 font-semibold placeholder:text-gray-400 focus:outline-none focus:border-violet-500 focus:bg-white transition-all"
                required
                autoComplete="current-password"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={isLoading}
              className="mt-2 font-fredoka text-xl tracking-wide"
            >
              Let's Play! 🎮
            </Button>
          </form>
        </div>

        {/* Decorative stars */}
        <div className="flex justify-center gap-4 mt-6 text-3xl">
          <span className="animate-bounce" style={{ animationDelay: '0ms' }}>⭐</span>
          <span className="animate-bounce" style={{ animationDelay: '150ms' }}>🌟</span>
          <span className="animate-bounce" style={{ animationDelay: '300ms' }}>⭐</span>
        </div>
      </div>
    </div>
  )
}
