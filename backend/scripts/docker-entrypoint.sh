#!/bin/sh
set -e

# Applique les migrations Prisma avant de démarrer l'app
echo "🔄 Application des migrations Prisma..."
npx prisma migrate deploy

echo "🚀 Démarrage du serveur..."
exec node dist/index.js
