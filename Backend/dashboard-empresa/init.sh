#!/bin/bash
set -e

echo "===== Dashboard Empresa Startup ====="

# Wait for MongoDB to be ready
echo "Waiting for MongoDB..."
./wait-for-it.sh mongodb:27017 --timeout=60 --strict

# Set DATABASE_URL for Prisma
export DATABASE_URL="mongodb://mongodb:27017/ticketmaster?replicaSet=rs0"

# Run Prisma db push to sync schema
echo "Applying DB schema: prisma db push"
pnpm exec prisma db push --schema=/app/prisma/schema.prisma --skip-generate || true

echo "Starting all Dashboard Empresa services..."

# Start all services concurrently (excluding ia-service)
pnpm exec concurrently --names "gateway,auth,merch,categoria" --prefix-colors "blue,green,yellow,magenta" \
  "node dist/apps/api-gateway/main.js" \
  "node dist/apps/auth-service/main.js" \
  "node dist/apps/merch-service/main.js" \
  "node dist/apps/ia-service/main.js" \
  "node dist/apps/categoria-service/main.js"
