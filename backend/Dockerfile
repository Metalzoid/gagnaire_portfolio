# =============================================================================
# Backend Dockerfile - Build isolé avec backend/package-lock.json
# Contexte : racine (pour accès à shared via file:../shared)
# Usage: NODE_ENV=development ou NODE_ENV=production
# =============================================================================

ARG NODE_ENV=production

FROM node:22-alpine AS base

RUN apk update && apk upgrade --no-cache && apk add --no-cache curl && npm install -g npm@11.10.1

WORKDIR /app

# 1. Copie des fichiers de dépendances uniquement (cache layer Docker)
COPY backend/package.json backend/package-lock.json ./backend/
COPY shared/package.json ./shared/

# 2. Installation des dépendances (layer caché tant que package*.json ne change pas)
WORKDIR /app/backend
RUN npm ci

WORKDIR /app/shared
RUN npm install

# 3. Copie du code source complet
WORKDIR /app
COPY backend ./backend
COPY shared ./shared

# Build shared (requis par le backend)
WORKDIR /app/shared
RUN npm run build

# =============================================================================
# Stage DEVELOPMENT
# =============================================================================
FROM base AS development

WORKDIR /app/backend
RUN npx prisma generate

EXPOSE 3001
CMD ["npm", "run", "dev"]

# =============================================================================
# Stage BUILDER (pour production)
# =============================================================================
FROM base AS builder

ARG DATABASE_URL=postgresql://build:build@localhost:5432/build
ENV DATABASE_URL=$DATABASE_URL

WORKDIR /app/backend
RUN npm run build

# =============================================================================
# Stage PRODUCTION
# =============================================================================
FROM node:22-alpine AS production

RUN apk update && apk upgrade --no-cache && apk add --no-cache curl && npm install -g tsx

WORKDIR /app

COPY --from=builder /app/backend/package.json /app/backend/package-lock.json ./backend/
COPY --from=builder /app/backend/node_modules ./backend/node_modules
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/templates ./backend/templates
COPY --from=builder /app/backend/prisma ./backend/prisma
COPY --from=builder /app/backend/prisma.config.ts ./backend/
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/backend/scripts/docker-entrypoint.sh ./backend/
RUN chmod +x ./backend/docker-entrypoint.sh

WORKDIR /app/backend
RUN npm prune --omit=dev

# Créer le dossier uploads (sera monté en volume persistant)
RUN mkdir -p /app/backend/uploads

EXPOSE 3001
ENTRYPOINT ["/app/backend/docker-entrypoint.sh"]

# =============================================================================
# Stage final
# =============================================================================
FROM ${NODE_ENV} AS final
