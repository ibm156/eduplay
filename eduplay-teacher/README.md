# EduPlay Teacher Dashboard

Professional content management and analytics portal for teachers and admins.
Built with React 18 + TypeScript + Vite + Tailwind CSS v4 + Recharts.

## Quick Start

```bash
cd eduplay-teacher
npm install
npm run dev
# Opens on http://localhost:5175
```

## Login credentials

| Username | Password | Role    |
|----------|----------|---------|
| teacher  | teach1234| Teacher |
| admin    | admin1234| Admin   |

Student accounts are blocked — teacher portal only.

## Pages

| Page       | Path         | What it does |
|------------|--------------|--------------|
| Overview   | /dashboard   | Class stats, XP chart, top students, weak topics |
| Students   | /students    | Full student list with search, filters, per-student XP/accuracy panel |
| Content    | /content     | Add/edit/delete questions and flashcards per subject → topic |
| Analytics  | /analytics   | XP over time, accuracy distribution, game type radar, topic performance table |

## Features

- **Mock analytics** — works without backend, shows realistic data
- **Real CRUD** — questions and flashcards connect to Django `/api/admin/*` endpoints
- **Charts** — AreaChart, BarChart, RadarChart via Recharts
- **Modals** — add/edit forms with validation
- **Delete confirm dialogs** — safe deletion with confirmation
- **Search + filter** — student list searchable by name/username + year group filter

## Runs alongside the other frontends

| App             | Port  |
|-----------------|-------|
| Primary         | 5173  |
| Secondary       | 5174  |
| Teacher         | 5175  |
| Django backend  | 8000  |
