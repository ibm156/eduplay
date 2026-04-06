#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$(dirname "$SCRIPT_DIR")"

echo ""
echo "⚠  This will delete ALL data (database, media files) and rebuild."
read -p "   Are you sure? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo "→ Stopping all containers..."
docker compose down

echo "→ Removing volumes (database + media)..."
docker compose down -v

echo "→ Removing built images..."
docker compose rm -f
docker rmi -f $(docker images "eduplay*" -q) 2>/dev/null || true

echo "→ Rebuilding and starting fresh..."
bash scripts/start.sh
