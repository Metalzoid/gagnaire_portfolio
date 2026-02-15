#!/bin/sh
set -e

# Génère le client Prisma (nécessaire pour @prisma/client + console)
echo "🔧 Génération du client Prisma..."
npx prisma generate

# Vérification de DATABASE_URL (requise pour prisma migrate deploy)
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERREUR: DATABASE_URL n'est pas défini. Configurez-la dans Coolify."
  exit 1
fi

# Applique les migrations Prisma avant de démarrer l'app
echo "🔄 Application des migrations Prisma..."
if ! npx prisma migrate deploy; then
  echo "❌ Erreur lors des migrations. Vérifiez que DATABASE_URL pointe vers une base accessible."
  exit 1
fi

echo "🚀 Démarrage du serveur..."
exec node dist/index.js
