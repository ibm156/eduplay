# EduPlay Secondary — Frontend

React + TypeScript + Vite frontend for secondary school students (ages 11–18).
Dark "mission control" design with sidebar navigation, XP system, and 4 game modes.

## Quick Start

```bash
cd eduplay-secondary
npm install
npm run dev
```

Open http://localhost:5174

## Demo Accounts

| Username | Password | XP     |
|----------|----------|--------|
| amir     | 1234     | 1,240  |
| sara     | 1234     | 1,890  |
| james    | 1234     | 1,540  |
| admin    | admin    | 9,999  |

## Pages

| Route                        | Page              |
|------------------------------|-------------------|
| `/login`                     | Login             |
| `/dashboard`                 | Dashboard         |
| `/subjects`                  | Subject list      |
| `/subjects/:id/topics`       | Topic list        |
| `/games`                     | Games hub         |
| `/games/quiz`                | Quiz Blitz        |
| `/games/flashcard`           | Flashcard Flip    |
| `/games/scramble`            | Word Scramble     |
| `/games/match`               | Match It          |
| `/games/result`              | Result / XP       |
| `/leaderboard`               | Leaderboard       |
| `/profile`                   | Profile & history |

## Switching to Real Backend

Edit `src/api/index.ts` — swap 3 lines from `mockApi` to real files:

```ts
export { authApi }                from './auth'
export { subjectsApi, topicsApi } from './subjects'
export { gamesApi }               from './games'
```
