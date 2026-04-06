# EduPlay Backend — Django REST API

Full backend for the EduPlay primary & secondary school learning games platform.

## Tech Stack

| Package | Purpose |
|---|---|
| Django 5 | Web framework |
| Django REST Framework | API layer |
| SimpleJWT | JWT authentication |
| django-cors-headers | CORS for React frontends |
| django-filter | Query filtering |
| SQLite (dev) / PostgreSQL (prod) | Database |
| WhiteNoise | Static file serving |
| Gunicorn | Production WSGI server |

---

## Quick Start (Development)

### 1 — Clone and set up virtual environment
```bash
cd eduplay-backend

# Windows
python -m venv venv
venv\Scripts\activate

# Mac / Linux
python -m venv venv
source venv/bin/activate
```

### 2 — Install dependencies
```bash
pip install -r requirements.txt
```

### 3 — Configure environment
```bash
cp .env.example .env
# .env is already set up for SQLite — no changes needed for local dev
```

### 4 — Run migrations
```bash
python manage.py migrate
```

### 5 — Seed demo data
```bash
python manage.py seed_data
```

This creates all subjects, topics, questions, flashcards, scramble words,
match pairs, badges and demo users in one command.

### 6 — Start the server
```bash
python manage.py runserver
```

API available at: http://localhost:8000/api/
Admin panel at:   http://localhost:8000/admin/

---

## Demo Accounts

| Username | Password | Role | Level |
|---|---|---|---|
| layla | 1234 | Primary student | Yr 4 |
| omar | 1234 | Primary student | Yr 4 |
| amir | 1234 | Secondary student | Yr 9 |
| sara | 1234 | Secondary student | Yr 9 |
| james | 1234 | Secondary student | Yr 9 |
| teacher | teach1234 | Teacher | Staff |
| admin | admin1234 | Admin | Staff |

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/token/` | Login — returns access + refresh + user |
| POST | `/api/auth/token/refresh/` | Refresh access token |
| POST | `/api/auth/logout/` | Blacklist refresh token |
| GET | `/api/auth/me/` | Current user profile |
| PATCH | `/api/auth/me/` | Update profile |
| POST | `/api/auth/register/` | Create new account |

### Content (student read-only)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/subjects/` | List subjects (filtered by user's school level) |
| GET | `/api/subjects/:id/topics/` | Topics for a subject |
| GET | `/api/topics/:id/questions/` | Quiz questions (randomised, limit=10) |
| GET | `/api/topics/:id/flashcards/` | Flashcards (randomised) |
| GET | `/api/topics/:id/scramble/` | Word scramble items |
| GET | `/api/topics/:id/match/` | Match pairs |

### Games
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/games/sessions/` | Submit completed game — awards XP + badges |
| GET | `/api/games/sessions/my/` | Current student's game history |
| GET | `/api/games/leaderboard/` | Top students by XP |

### Progress
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/progress/badges/` | All available badges |
| GET | `/api/progress/badges/my/` | Badges earned by current user |
| GET | `/api/progress/stats/` | Student stats (XP, accuracy, by game type) |

### Teacher / Admin (CRUD)
| Method | Endpoint | Description |
|---|---|---|
| GET/POST | `/api/admin/questions/` | Manage questions |
| GET/POST | `/api/admin/flashcards/` | Manage flashcards |
| GET/POST | `/api/admin/scramble/` | Manage scramble words |
| GET/POST | `/api/admin/match/` | Manage match pairs |

---

## Connecting the React Frontends

Edit `src/api/index.ts` in both frontend projects:

```ts
// Change from:
export { authApi }                from './mockApi'
export { subjectsApi, topicsApi } from './mockApi'
export { gamesApi }               from './mockApi'

// To:
export { authApi }                from './auth'
export { subjectsApi, topicsApi } from './subjects'
export { gamesApi }               from './games'
```

The Vite dev proxy already forwards `/api` → `http://localhost:8000`, so
no CORS issues during development.

Login credentials to use in the frontends:

- Primary frontend (port 5173): `layla / 1234` or `omar / 1234`
- Secondary frontend (port 5174): `amir / 1234` or `sara / 1234`

---

## Project Structure

```
eduplay-backend/
├── config/
│   ├── settings.py    Full settings with env vars
│   ├── urls.py        Root URL router
│   └── wsgi.py
├── apps/
│   ├── users/         Custom User model + JWT auth views
│   ├── content/       Subject, Topic, Question, Flashcard, Scramble, Match
│   │   └── management/commands/seed_data.py
│   ├── games/         GameSession + leaderboard
│   └── progress/      Badge model + awarding service + stats
├── requirements.txt
└── .env.example
```

---

## Production Deployment (Railway / Render)

1. Set environment variables:
   ```
   SECRET_KEY=<strong-random-key>
   DEBUG=False
   DATABASE_URL=postgresql://...
   ALLOWED_HOSTS=yourdomain.com
   CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```

2. Run on deploy:
   ```bash
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py collectstatic --noinput
   python manage.py seed_data
   gunicorn config.wsgi:application
   ```
