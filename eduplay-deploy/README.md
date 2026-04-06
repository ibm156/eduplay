# EduPlay — Docker Deployment

Run the entire EduPlay platform with a single command.

## What runs

| Service          | Container          | URL                              |
|------------------|--------------------|----------------------------------|
| Nginx proxy      | eduplay_nginx      | http://localhost (port 80)       |
| Primary frontend | eduplay_primary    | http://localhost/                |
| Secondary frontend| eduplay_secondary | http://localhost/secondary/      |
| Teacher dashboard| eduplay_teacher    | http://localhost/teacher/        |
| Django backend   | eduplay_backend    | http://localhost/api/            |
| Django admin     | eduplay_backend    | http://localhost/admin/          |
| PostgreSQL        | eduplay_db         | internal only                    |

---

## Prerequisites

Install these before starting:

- **Docker Desktop** — https://www.docker.com/products/docker-desktop/
- **Docker Compose** — included with Docker Desktop

Check they're installed:
```bash
docker --version        # Docker version 24+
docker compose version  # Docker Compose version 2+
```

---

## Folder structure required

Your project folder must look like this before running:

```
your-project/
├── eduplay-deploy/       ← this folder
├── eduplay-backend/      ← Django backend
├── eduplay-primary/      ← Primary React frontend
├── eduplay-secondary/    ← Secondary React frontend
└── eduplay-teacher/      ← Teacher dashboard
```

All 5 folders must be siblings (at the same level).

---

## Quick Start

### Option A — Using the start script (recommended)

```bash
cd eduplay-deploy
chmod +x scripts/start.sh
bash scripts/start.sh
```

### Option B — Manual steps

```bash
cd eduplay-deploy

# 1. Create environment file
cp .env.example .env

# 2. Build all images
docker compose build

# 3. Start everything
docker compose up -d

# 4. Watch the backend start up
docker compose logs -f backend
```

First run takes **5–10 minutes** to build all images. Subsequent starts take under 30 seconds.

---

## Login credentials

### Primary school → http://localhost/
| Username | Password |
|----------|----------|
| layla    | 1234     |
| omar     | 1234     |

### Secondary school → http://localhost/secondary/
| Username | Password |
|----------|----------|
| amir     | 1234     |
| sara     | 1234     |

### Teacher dashboard → http://localhost/teacher/
| Username | Password   |
|----------|------------|
| teacher  | teach1234  |
| admin    | admin1234  |

### Django Admin → http://localhost/admin/
| Username | Password   |
|----------|------------|
| admin    | admin1234  |

---

## Useful commands

```bash
# View all logs live
docker compose logs -f

# View logs for one service
docker compose logs -f backend
docker compose logs -f nginx
docker compose logs -f primary

# Stop everything (keeps data)
docker compose down

# Stop and delete all data (fresh start)
docker compose down -v

# Restart one service after code change
docker compose up -d --build backend

# Run Django management commands
docker compose exec backend python manage.py createsuperuser
docker compose exec backend python manage.py seed_data --clear
docker compose exec backend python manage.py shell

# Open a shell in any container
docker compose exec backend bash
docker compose exec db psql -U eduplay
```

---

## Updating after code changes

If you change the Django backend:
```bash
docker compose up -d --build backend
```

If you change a frontend:
```bash
docker compose up -d --build primary
# or secondary / teacher
```

Rebuild everything:
```bash
docker compose up -d --build
```

---

## Resetting to a clean state

```bash
bash scripts/reset.sh
```

Or manually:
```bash
docker compose down -v        # removes containers + volumes
docker compose up -d --build  # rebuilds and restarts
```

---

## Environment variables (.env)

| Variable | Default | Description |
|---|---|---|
| `HTTP_PORT` | 80 | Port Nginx listens on |
| `POSTGRES_DB` | eduplay | Database name |
| `POSTGRES_USER` | eduplay | Database user |
| `POSTGRES_PASSWORD` | change_me | Database password |
| `SECRET_KEY` | dev-key | Django secret key (change in prod!) |
| `DEBUG` | False | Django debug mode |
| `ALLOWED_HOSTS` | localhost | Comma-separated allowed hosts |
| `CORS_ALLOWED_ORIGINS` | http://localhost | Comma-separated CORS origins |
| `ACCESS_TOKEN_LIFETIME_MINUTES` | 60 | JWT access token lifetime |
| `REFRESH_TOKEN_LIFETIME_DAYS` | 7 | JWT refresh token lifetime |

---

## Architecture

```
Browser
   │
   ▼
┌─────────────────────────────────┐
│           Nginx :80             │
│                                 │
│  /           → primary:80       │
│  /secondary/ → secondary:80     │
│  /teacher/   → teacher:80       │
│  /api/       → backend:8000     │
│  /admin/     → backend:8000     │
│  /static/    → volume (files)   │
└─────────────────────────────────┘
        │              │
        ▼              ▼
  React apps      Django (Gunicorn)
  (built HTML)         │
                        ▼
                  PostgreSQL :5432
```

---

## Troubleshooting

**Backend crashes on startup:**
```bash
docker compose logs backend
# Usually a database connection issue — wait 30s and try again
docker compose restart backend
```

**Port 80 already in use:**
```bash
# Edit .env and change HTTP_PORT
HTTP_PORT=8080
docker compose up -d
# Then visit http://localhost:8080
```

**Frontend shows blank page:**
```bash
# Check if build succeeded
docker compose logs primary
# Rebuild
docker compose up -d --build primary
```

**Database migration errors:**
```bash
docker compose exec backend python manage.py migrate --run-syncdb
```

**Full clean restart:**
```bash
docker compose down -v --remove-orphans
docker system prune -f
bash scripts/start.sh
```
