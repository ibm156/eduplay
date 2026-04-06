# EduPlay — Primary School Frontend

React + TypeScript + Vite frontend for the EduPlay primary school learning games platform.

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Django backend running on port 8000

### 1. Install dependencies
```bash
cd eduplay-primary
npm install
```

### 2. Configure environment
```bash
cp .env.example .env.local
# Edit .env.local if your backend runs on a different port
```

### 3. Start development server
```bash
npm run dev
```

Open http://localhost:5173

The Vite dev server proxies all `/api` requests to `http://localhost:8000`
so no CORS issues in development.

---

## Project Structure

```
src/
├── api/            # Axios API layer (auth, subjects, games)
├── components/
│   ├── layout/     # AppShell (auth guard + header + nav), BottomNav
│   └── ui/         # Button, Badge, XPBar
├── pages/
│   ├── games/      # QuizGame, FlashcardGame, WordScrambleGame, MatchGame, ResultPage
│   ├── DashboardPage.tsx
│   ├── SubjectsPage.tsx
│   ├── TopicsPage.tsx
│   ├── LeaderboardPage.tsx
│   ├── LoginPage.tsx
│   └── ProfilePage.tsx
├── stores/         # Zustand: authStore, gameStore
├── types/          # Shared TypeScript types
├── App.tsx         # Router setup
└── main.tsx        # Entry point
```

## Game Flow

```
Login → Dashboard → Subjects → Topics → Pick Game → Play → Result (+XP)
```

## Key Libraries

| Library | Purpose |
|---|---|
| React Router v6 | Client-side routing |
| Zustand | Auth & game state |
| TanStack Query | Server state, caching |
| Axios | HTTP + JWT refresh |
| Tailwind CSS | Styling |
| clsx | Conditional classnames |

## Building for Production

```bash
npm run build
# Output: dist/
```

Deploy the `dist/` folder to any static host (Vercel, Netlify, Nginx).
Set `VITE_API_URL` to your production Django backend URL.

## Connecting to Django

The frontend expects these API endpoints (provided by the Django backend):

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/token/` | POST | Login → JWT tokens |
| `/api/auth/token/refresh/` | POST | Refresh access token |
| `/api/auth/me/` | GET | Current user profile |
| `/api/auth/logout/` | POST | Blacklist refresh token |
| `/api/subjects/` | GET | List subjects |
| `/api/subjects/:id/topics/` | GET | Topics for a subject |
| `/api/topics/:id/questions/` | GET | Quiz questions |
| `/api/topics/:id/flashcards/` | GET | Flashcards |
| `/api/topics/:id/scramble/` | GET | Word scramble items |
| `/api/topics/:id/match/` | GET | Match pairs |
| `/api/games/sessions/` | POST | Submit game result |
| `/api/games/sessions/my/` | GET | Student game history |
| `/api/games/leaderboard/` | GET | XP leaderboard |
| `/api/games/badges/my/` | GET | Student badges |
