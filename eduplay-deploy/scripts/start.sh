#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(dirname "$SCRIPT_DIR")"

cd "$DEPLOY_DIR"

echo ""
echo "╔══════════════════════════════════════╗"
echo "║       EduPlay — Starting Up          ║"
echo "╚══════════════════════════════════════╝"
echo ""

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "→ Creating .env from .env.example..."
    cp .env.example .env
    echo "  ✓ .env created. Edit it to change passwords and secrets."
fi

echo "→ Building images (this takes a few minutes on first run)..."
docker compose build --parallel

echo ""
echo "→ Starting all services..."
docker compose up -d

echo ""
echo "→ Waiting for backend to be ready..."
attempt=0
until docker compose exec -T backend python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/admin/')" 2>/dev/null; do
    attempt=$((attempt + 1))
    if [ $attempt -ge 30 ]; then
        echo "  Backend taking longer than expected. Check: docker compose logs backend"
        break
    fi
    echo "  Waiting... ($attempt/30)"
    sleep 5
done

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║                   EduPlay is running!                    ║"
echo "╠══════════════════════════════════════════════════════════╣"
echo "║  Primary school      →  http://localhost/                ║"
echo "║  Secondary school    →  http://localhost/secondary/      ║"
echo "║  Teacher dashboard   →  http://localhost/teacher/        ║"
echo "║  Django API          →  http://localhost/api/            ║"
echo "║  Django Admin        →  http://localhost/admin/          ║"
echo "╠══════════════════════════════════════════════════════════╣"
echo "║  Primary:   layla / 1234    omar / 1234                  ║"
echo "║  Secondary: amir / 1234     sara / 1234                  ║"
echo "║  Teacher:   teacher / teach1234                          ║"
echo "║  Admin:     admin / admin1234                            ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "Useful commands:"
echo "  docker compose logs -f          (follow all logs)"
echo "  docker compose logs -f backend  (backend logs only)"
echo "  docker compose down             (stop everything)"
echo "  ./scripts/reset.sh              (wipe data and restart)"
echo ""
