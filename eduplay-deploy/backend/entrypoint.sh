#!/bin/sh
set -e

echo "==> Waiting for database..."
python - << 'PYEOF'
import time, os, sys
try:
    import psycopg2
except ImportError:
    print("psycopg2 not available, skipping wait")
    sys.exit(0)

url = os.environ.get('DATABASE_URL', '')
for i in range(30):
    try:
        psycopg2.connect(url)
        print("Database ready.")
        break
    except Exception:
        print(f"Attempt {i+1}/30 -- retrying in 2s...")
        time.sleep(2)
else:
    print("Could not connect to database after 30 attempts")
    sys.exit(1)
PYEOF

echo "==> Running migrations..."
python manage.py makemigrations --noinput
python manage.py migrate --noinput

echo "==> Seeding demo data..."
python manage.py seed_data 2>/dev/null || echo "Already seeded -- skipping"

echo "==> Collecting static files..."
python manage.py collectstatic --noinput --clear

echo "==> Starting Gunicorn on :8000..."
exec gunicorn config.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 3 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile -
