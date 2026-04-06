import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppShell }      from '@/components/layout/AppShell'
import { LoginPage }     from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { StudentsPage }  from '@/pages/StudentsPage'
import { ContentPage }   from '@/pages/ContentPage'
import { AnalyticsPage } from '@/pages/AnalyticsPage'

const qc = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 3, retry: 1 } },
})

const App: React.FC = () => (
  <QueryClientProvider client={qc}>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/students"  element={<StudentsPage />} />
          <Route path="/content"   element={<ContentPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
)

export default App
