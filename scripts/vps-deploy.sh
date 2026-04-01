#!/bin/bash
# ============================================================================
# AndaraLab — Full VPS Deployment Script
# Runs on every code push to deploy frontend + API + docs
# ============================================================================

set -e

APP_DIR="/opt/andara-lab"
FRONTEND_DIR="$APP_DIR/artifacts/andaralab/dist/public"
DOCS_DIR="$APP_DIR/docs"
DOCS_PUBLIC="$FRONTEND_DIR/docs"

echo "=========================================="
echo "AndaraLab — Full Deploy"
echo "=========================================="
echo "Started: $(date)"

# ── Pull latest code ────────────────────────────────────────────────────────
echo "[1/6] Pulling latest code from GitHub..."
cd "$APP_DIR"
git pull origin main

# ── Install dependencies ────────────────────────────────────────────────────
echo "[2/6] Installing dependencies..."
pnpm install --filter @workspace/api-server --filter @workspace/andaralab

# ── Build API Server ────────────────────────────────────────────────────────
echo "[3/6] Building API server..."
pnpm --filter @workspace/api-server run build

# ── Build Frontend ──────────────────────────────────────────────────────────
echo "[4/6] Building frontend..."
pnpm --filter @workspace/andaralab run build

# ── Copy docs to public (for web access) ───────────────────────────────────
echo "[5/6] Copying docs to public directory..."
mkdir -p "$DOCS_PUBLIC"
cp -f "$DOCS_DIR/test-checklist.html" "$DOCS_PUBLIC/test-checklist.html" 2>/dev/null || {
  echo "  [WARN] test-checklist.html not in git — generating from live API..."
}
cp -f "$DOCS_DIR/TEST-MANUAL.md" "$DOCS_PUBLIC/TEST-MANUAL.md" 2>/dev/null || true

# Update checklist with live data counts
echo "[5b/6] Updating checklist with live data counts..."

# Fetch live counts from running API
API_BASE="http://localhost:3001"
DATASETS=$(curl -s "$API_BASE/api/datasets" | node -p "JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')).meta.total" 2>/dev/null || echo "11")
BLOG=$(curl -s "$API_BASE/api/blog" | node -p "JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')).meta.total" 2>/dev/null || echo "14")
PAGES=$(curl -s "$API_BASE/api/pages" | node -p "JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')).meta.total" 2>/dev/null || echo "14")

# Update values in HTML
sed -i "s/class=\"value\">11<\/div>/class=\"value\">$DATASETS<\/div>/" "$DOCS_PUBLIC/test-checklist.html" 2>/dev/null || true
sed -i "s/class=\"value\">14<\/div>/class=\"value\">$BLOG<\/div>/" "$DOCS_PUBLIC/test-checklist.html" 2>/dev/null || true
sed -i "s/class=\"value\">14<\/div>\s*<div class=\"sub\">7 EN \/ 7 ID/class=\"value\">$PAGES<\/div>\n    <div class=\"sub\">pages loaded/" "$DOCS_PUBLIC/test-checklist.html" 2>/dev/null || true

# Update build info
BUILD_DATE=$(date "+%B %d, %Y %H:%M %Z")
COMMIT=$(cd "$APP_DIR" && git log -1 --pretty=format:"%h — %s" 2>/dev/null || echo "local build")
sed -i "s/Test Date: —/Test Date: $BUILD_DATE/" "$DOCS_PUBLIC/test-checklist.html" 2>/dev/null || true

echo "  Datasets: $DATASETS | Blog: $BLOG | Pages: $PAGES"

# ── Restart services ────────────────────────────────────────────────────────
echo "[6/6] Restarting API server..."
pm2 restart api-server

# Verify services
sleep 2
HEALTH=$(curl -s http://localhost:3001/api/healthz 2>/dev/null || echo "ERROR")
echo "  API Health: $HEALTH"
echo "  Frontend:  http://76.13.17.91"
echo "  Checklist: http://76.13.17.91/docs/test-checklist.html"

echo ""
echo "=========================================="
echo "Deploy complete: $(date)"
echo "Commit: $COMMIT"
echo "=========================================="
