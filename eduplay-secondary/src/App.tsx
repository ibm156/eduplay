import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppShell } from '@/components/layout/AppShell'
import { LoginPage }       from '@/pages/LoginPage'
import { DashboardPage }   from '@/pages/DashboardPage'
import { SubjectsPage }    from '@/pages/SubjectsPage'
import { TopicsPage }      from '@/pages/TopicsPage'
import { GamesHubPage }    from '@/pages/GamesHubPage'
import { LeaderboardPage } from '@/pages/LeaderboardPage'
import { ProfilePage }     from '@/pages/ProfilePage'
import { QuizGame }        from '@/pages/games/QuizGame'
import { FlashcardGame }   from '@/pages/games/FlashcardGame'
import { WordScrambleGame }from '@/pages/games/WordScrambleGame'
import { MatchGame }       from '@/pages/games/MatchGame'
import { ResultPage }      from '@/pages/games/ResultPage'

const qc = new QueryClient({ defaultOptions: { queries: { staleTime: 1000 * 60 * 5, retry: 1 } } })

const App: React.FC = () => (
  <QueryClientProvider client={qc}>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard"                    element={<DashboardPage />} />
          <Route path="/subjects"                     element={<SubjectsPage />} />
          <Route path="/subjects/:subjectId/topics"   element={<TopicsPage />} />
          <Route path="/games"                        element={<GamesHubPage />} />
          <Route path="/leaderboard"                  element={<LeaderboardPage />} />
          <Route path="/profile"                      element={<ProfilePage />} />
          <Route path="/games/quiz"                   element={<QuizGame />} />
          <Route path="/games/flashcard"              element={<FlashcardGame />} />
          <Route path="/games/scramble"               element={<WordScrambleGame />} />
          <Route path="/games/match"                  element={<MatchGame />} />
          <Route path="/games/result"                 element={<ResultPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
)

export default App
