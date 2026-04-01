#!/bin/bash

# VPS Deployment Script for AndaraLab
# IP: 76.13.17.91
# SSH Key: ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIHiJ4FqnnJFpvAwvppiXJRDEP0BChI0qCdapjN7n8P7p

set -e

echo "🚀 AndaraLab VPS Deployment"
echo "=========================="
echo ""

# Configuration
VPS_USER="root"
VPS_IP="76.13.17.91"
PROJECT_NAME="andaralab"
CONTAINER_NAME="${PROJECT_NAME}-app"

echo "📦 Building Docker images locally..."

# Build frontend
echo "Building frontend..."
docker build -f Dockerfile.frontend -t ${PROJECT_NAME}-frontend .

# Build backend
echo "Building backend..."
docker build -f Dockerfile -t ${PROJECT_NAME}-backend .

echo ""
echo "📤 Transferring images to VPS..."

# Save and transfer images
docker save ${PROJECT_NAME}-frontend | gzip > frontend.tar.gz
docker save ${PROJECT_NAME}-backend | gzip > backend.tar.gz

# Transfer to VPS
scp -o StrictHostKeyChecking=no frontend.tar.gz backend.tar.gz docker-compose.yml ${VPS_USER}@${VPS_IP}:/root/

echo ""
echo "🔧 Deploying on VPS..."

# SSH into VPS and deploy
ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_IP} << 'ENDSSH'
cd /root

echo "Stopping existing containers..."
docker stop ${CONTAINER_NAME}-frontend ${CONTAINER_NAME}-backend 2>/dev/null || true
docker rm ${CONTAINER_NAME}-frontend ${CONTAINER_NAME}-backend 2>/dev/null || true

echo "Loading Docker images..."
docker load < frontend.tar.gz
docker load < backend.tar.gz

echo "Starting new containers..."
docker compose up -d

echo "Cleaning up..."
rm frontend.tar.gz backend.tar.gz

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Access your application:"
echo "   Frontend: http://${VPS_IP}"
echo "   Backend API: http://${VPS_IP}:3001"
echo "   Admin Panel: http://${VPS_IP}/admin"
echo ""
echo "📊 Container status:"
docker ps --filter name=${CONTAINER_NAME}
ENDSSH

# Cleanup local files
rm -f frontend.tar.gz backend.tar.gz

echo ""
echo "✨ Deployment successful!"
echo "Application running at: http://${VPS_IP}"
