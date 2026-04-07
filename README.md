# EduPlay — CI/CD with GitHub Actions

Automated testing and Docker Hub image publishing on every push.

---

## What happens on each push

```
git push origin main
        │
        ├── backend.yml
        │     ├── Run pytest (users, content, games, progress tests)
        │     ├── Generate coverage report
        │     └── ✅ Pass → Build & push eduplay-backend:latest
        │
        ├── primary.yml
        │     ├── npm ci + tsc --noEmit
        │     ├── npm run build
        │     └── ✅ Pass → Build & push eduplay-primary:latest
        │
        ├── secondary.yml
        │     └── same as primary → eduplay-secondary:latest
        │
        └── teacher.yml
              └── same as primary → eduplay-teacher:latest

git push origin v1.2.0  (version tag)
        │
        └── release.yml
              └── Build ALL images for linux/amd64 + linux/arm64
                  Push with tags: v1.2.0, 1.2, latest
```

Workflows **only run** when relevant files change — pushing to `eduplay-primary/`
does NOT trigger the backend workflow, saving CI minutes.

---

## Setup Guide

### Step 1 — Create a GitHub repository

Go to https://github.com/new and create a new repository called `eduplay`.

### Step 2 — Push all project folders

Your repo should contain all 5 folders at the root:

```
eduplay/                    ← GitHub repo root
├── .github/
│   └── workflows/
│       ├── backend.yml
│       ├── primary.yml
│       ├── secondary.yml
│       ├── teacher.yml
│       └── release.yml
├── eduplay-backend/
├── eduplay-primary/
├── eduplay-secondary/
├── eduplay-teacher/
└── eduplay-deploy/
```

Push everything:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/eduplay.git
git push -u origin main
```

### Step 3 — Create a Docker Hub account

1. Go to https://hub.docker.com and sign up
2. Create an **Access Token**:
   - Click your profile → Account Settings → Security
   - Click "New Access Token"
   - Name it `github-actions`
   - Permission: **Read, Write, Delete**
   - Copy the token (you only see it once!)

### Step 4 — Add GitHub Secrets

In your GitHub repo:
1. Go to **Settings → Secrets and variables → Actions**
2. Click **New repository secret** for each:

| Secret Name | Value |
|---|---|
| `DOCKERHUB_USERNAME` | Your Docker Hub username |
| `DOCKERHUB_TOKEN` | The access token from Step 3 |

### Step 5 — Verify it works

Push any change to trigger the workflow:
```bash
# Edit any file in eduplay-backend/
git add .
git commit -m "Test CI pipeline"
git push origin main
```

Go to your GitHub repo → **Actions** tab → watch the workflows run.

---

## Running tests locally

```bash
cd eduplay-backend

# Install test dependencies
pip install pytest pytest-django pytest-cov

# Run all tests
pytest

# Run with coverage report
pytest --cov=apps --cov-report=term-missing

# Run specific test file
pytest apps/users/tests.py -v

# Run specific test class
pytest apps/games/tests.py::TestLeaderboard -v
```

---

## Workflow files explained

| File | Triggers on | What it does |
|---|---|---|
| `backend.yml` | Push to `eduplay-backend/**` | pytest → push backend image |
| `primary.yml` | Push to `eduplay-primary/**` | tsc + build → push primary image |
| `secondary.yml` | Push to `eduplay-secondary/**` | tsc + build → push secondary image |
| `teacher.yml` | Push to `eduplay-teacher/**` | tsc + build → push teacher image |
| `release.yml` | Push tag `v*.*.*` or manual | Build ALL images multi-arch |

---

## After images are pushed — deploy

On your server (or local machine):

```bash
# Pull latest images and restart
docker compose pull
docker compose up -d

# Or update just one service
docker compose pull backend
docker compose up -d backend
```

Update your `docker-compose.yml` to use Docker Hub images instead of building locally:

```yaml
# Instead of:
backend:
  build:
    context: ../eduplay-backend

# Use:
backend:
  image: YOUR_DOCKERHUB_USERNAME/eduplay-backend:latest
```

Then deployment is just:
```bash
docker compose pull && docker compose up -d
```

---

## Making a release

```bash
git tag v1.0.0
git push origin v1.0.0
```

This triggers `release.yml` which builds multi-platform images (amd64 + arm64)
and tags them as `v1.0.0`, `1.0`, and `latest`.

---

## Test coverage

Tests cover:

| App | Tests |
|---|---|
| users | Login, token refresh, /me endpoint, XP add, level up, streak logic |
| content | Subject list, topic list, question list, correct answer exposure, teacher CRUD, student permissions |
| games | Session submit, XP update, streak update, score validation, history, leaderboard |
| progress | Badge awarding, duplicate prevention, badge endpoints, stats structure |
