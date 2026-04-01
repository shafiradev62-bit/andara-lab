#!/bin/bash
# ============================================================================
# VPS API Server Deployment Script
# Run this on your VPS to deploy the api-server
# ============================================================================

set -e

APP_DIR="/opt/andaralab-api"
PORT=3001
REPO_URL="https://github.com/shafiradev62-bit/andara-lab.git"
BRANCH="main"

echo "========================================"
echo "AndaraLab API Server - VPS Deployment"
echo "========================================"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root: sudo $0"
  exit 1
fi

# Install Node.js 20 if not present
if ! command -v node &> /dev/null; then
  echo "[1/6] Installing Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

# Install pnpm globally if not present
if ! command -v pnpm &> /dev/null; then
  echo "[2/6] Installing pnpm..."
  npm install -g pnpm
fi

# Install PM2 globally if not present
if ! command -v pm2 &> /dev/null; then
  echo "[3/6] Installing PM2..."
  npm install -g pm2
fi

# Clone or update repository
echo "[4/6] Setting up application..."
if [ -d "$APP_DIR/.git" ]; then
  echo "Pulling latest changes..."
  cd "$APP_DIR"
  git pull origin $BRANCH
else
  echo "Cloning repository..."
  rm -rf "$APP_DIR"
  git clone -b $BRANCH $REPO_URL "$APP_DIR"
  cd "$APP_DIR"
fi

# Install dependencies and build api-server
echo "[5/6] Installing dependencies..."
cd "$APP_DIR/UI-Mirror-Clone"
pnpm install --filter @workspace/api-server

echo "Building api-server..."
pnpm --filter @workspace/api-server run build

# Start/restart with PM2
echo "[6/6] Starting API server on port $PORT..."
cd "$APP_DIR/UI-Mirror-Clone/artifacts/api-server"

# Stop existing instance if running
pm2 stop api-server 2>/dev/null || true
pm2 delete api-server 2>/dev/null || true

# Start fresh
pm2 start dist/index.mjs \
  --name "api-server" \
  -- env PORT=$PORT NODE_ENV=production

# Save PM2 process list
pm2 save

# Setup PM2 startup script (systemd)
pm2 startup 2>/dev/null || echo "PM2 startup hook failed - run 'sudo env PATH=$PATH:/usr/bin pm2 startup' manually"

# Show status
echo ""
echo "========================================"
echo "Deployment complete!"
echo "========================================"
echo "API Server running at: http://76.13.17.91:$PORT"
echo "Health check:          http://76.13.17.91:$PORT/api/healthz"
echo ""
echo "Useful commands:"
echo "  pm2 status           - Check server status"
echo "  pm2 logs api-server  - View logs"
echo "  pm2 restart api-server - Restart server"
echo "  pm2 deploy-api.sh    - Redeploy"
echo ""
pm2 list
