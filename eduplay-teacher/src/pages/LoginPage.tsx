import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Button, Input } from '@/components/ui/index'

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
    <div className="min-h-screen bg-[#0A0C10] flex items-center justify-center px-6">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#3B82F6]/05 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-[380px]">
        {/* Logo */}
        <div className="mb-10">
          <div className="font-syne text-[32px] font-bold text-[#E8ECF4] mb-1">
            Edu<span className="text-[#3B82F6]">Play</span>
          </div>
          <div className="font-mono text-[11px] text-[#2A3149] uppercase tracking-widest">
            Teacher Portal
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#111318] border border-[#1E2330] rounded-2xl p-7">
          <h2 className="font-syne text-[18px] font-bold text-[#E8ECF4] mb-1">Sign in</h2>
          <p className="text-sm text-[#6B7694] mb-6">
            Teacher and admin accounts only
          </p>

          {error && (
            <div className="mb-5 bg-[#EF4444]/10 border border-[#EF4444]/25 rounded-lg px-4 py-3 text-[#F87171] text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your.username"
              required
              autoComplete="username"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
            <Button type="submit" fullWidth size="lg" loading={isLoading} className="mt-1">
              Sign in →
            </Button>
          </form>
        </div>

        {/* Demo hint */}
        <div className="mt-4 bg-[#111318] border border-[#1E2330] rounded-xl p-4">
          <p className="font-mono text-[11px] text-[#2A3149] mb-2 uppercase tracking-wider">Demo accounts</p>
          <div className="flex flex-col gap-1">
            {[['teacher', 'teach1234', 'Teacher'], ['admin', 'admin1234', 'Admin']].map(([u, p, role]) => (
              <button
                key={u}
                onClick={() => { setUsername(u); setPassword(p) }}
                className="text-left font-mono text-[12px] text-[#6B7694] hover:text-[#3B82F6] transition-colors"
              >
                {u} / {p} — {role}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
