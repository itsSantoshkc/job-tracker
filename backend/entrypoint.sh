#!/bin/sh
set -e

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Seeding database..."
npx prisma db seed || true

echo "Starting server..."
exec node dist/src/main.js
