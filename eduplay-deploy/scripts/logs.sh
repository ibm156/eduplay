#!/bin/bash
SERVICE=${1:-""}
cd "$(dirname "$(dirname "${BASH_SOURCE[0]}")")"

if [ -z "$SERVICE" ]; then
    echo "Following all service logs (Ctrl+C to stop)..."
    docker compose logs -f
else
    echo "Following logs for: $SERVICE"
    docker compose logs -f "$SERVICE"
fi
