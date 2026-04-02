#!/usr/bin/env bash
# Rebuild and restart AndaraLab on the VPS (Docker Compose).
# Run from repo root on the server, e.g.:
#   cd /opt/andara-lab && bash scripts/vps-docker-rebuild.sh

set -euo pipefail

APP_DIR="${1:-$(cd "$(dirname "$0")/.." && pwd)}"
cd "$APP_DIR"

echo "[vps-docker-rebuild] Working dir: $APP_DIR"

# Legacy container names (older compose project) may still hold 80 / 3001
for c in andaralab-backend-1 andaralab-frontend-1; do
  docker stop "$c" 2>/dev/null || true
  docker rm "$c" 2>/dev/null || true
done

docker compose build
docker compose up -d

echo "[vps-docker-rebuild] Done. docker compose ps:"
docker compose ps
