# =============================================================================
# Backend Dockerfile - Gestion multi-environnement
# Usage: NODE_ENV=development ou NODE_ENV=production
# =============================================================================

# ARG global pour sélectionner le stage final
ARG NODE_ENV=production

FROM node:20-alpine AS base

# Installation de curl pour les healthchecks + mise à jour npm
RUN apk add --no-cache curl && npm install -g npm@11

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# =============================================================================
# Stage DEVELOPMENT
# =============================================================================
FROM base AS development

# Installation de toutes les dépendances (tsx, nodemon inclus)
RUN npm ci || npm install

# Copie du code source (sera écrasé par les volumes en dev)
COPY . .

EXPOSE 3001

# tsx watch pour hot reload
CMD ["npm", "run", "dev"]

# =============================================================================
# Stage BUILDER (pour production)
# =============================================================================
FROM base AS builder

RUN npm ci || npm install

COPY . .

# DATABASE_URL requis par prisma.config.ts au build (prisma generate ne s'y connecte pas)
ARG DATABASE_URL=postgresql://build:build@localhost:5432/build
ENV DATABASE_URL=$DATABASE_URL

# Génère le client Prisma et compile TypeScript
RUN npm run build

# =============================================================================
# Stage PRODUCTION
# =============================================================================
FROM base AS production

# Copie package.json + lock pour build reproductible (aligné avec audit local)
COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

# Copie du code compilé et fichiers Prisma (migrations + config)
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./

# Script d'entrée : migrations puis démarrage
COPY scripts/docker-entrypoint.sh /app/
RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 3001

# Migrations au démarrage, puis serveur
ENTRYPOINT ["/app/docker-entrypoint.sh"]

# =============================================================================
# Stage final - sélection basée sur NODE_ENV
# =============================================================================
FROM ${NODE_ENV} AS final
