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
    <div className="min-h-screen bg-[#0D0F14] flex items-center justify-center px-6 font-dm">
      {/* Subtle glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#6C63FF]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="font-syne text-4xl font-bold text-[#F0F2FF] tracking-tight mb-1">
            Edu<span className="text-[#6C63FF]">Play</span>
          </div>
          <div className="font-mono text-[11px] text-[#3A3F5C] tracking-widest uppercase">
            Secondary · Mission Control
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#13161D] border border-[#252836] rounded-2xl p-7">
          <h2 className="font-syne text-[18px] font-bold text-[#F0F2FF] mb-1">Sign in</h2>
          <p className="text-sm text-[#7B82A0] mb-6">Enter your school credentials to continue</p>

          {error && (
            <div className="mb-5 bg-[#FF6B6B]/10 border border-[#FF6B6B]/25 rounded-lg px-4 py-3 text-[#FF6B6B] text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-mono text-[#7B82A0] mb-1.5 uppercase tracking-wider">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your.username"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0D0F14] border border-[#252836] text-[#F0F2FF] text-sm font-mono placeholder:text-[#3A3F5C] focus:outline-none focus:border-[#6C63FF] transition-colors"
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#7B82A0] mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0D0F14] border border-[#252836] text-[#F0F2FF] text-sm font-mono placeholder:text-[#3A3F5C] focus:outline-none focus:border-[#6C63FF] transition-colors"
                required
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" fullWidth size="lg" loading={isLoading} className="mt-1 font-semibold">
              Sign in →
            </Button>
          </form>
        </div>

        {/* Demo accounts hint */}
        <div className="mt-5 bg-[#13161D] border border-[#252836] rounded-xl p-4">
          <p className="font-mono text-[11px] text-[#3A3F5C] mb-2 uppercase tracking-wider">Demo accounts</p>
          <div className="flex flex-col gap-1">
            {[['amir', '1234'], ['sara', '1234'], ['admin', 'admin']].map(([u, p]) => (
              <button
                key={u}
                onClick={() => { setUsername(u); setPassword(p) }}
                className="text-left font-mono text-[12px] text-[#7B82A0] hover:text-[#6C63FF] transition-colors"
              >
                {u} / {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
