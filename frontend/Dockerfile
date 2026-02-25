# =============================================================================
# Frontend Dockerfile - Build isolé avec frontend/package-lock.json
# Contexte : racine (pour accès à shared via file:../shared)
# Usage: NODE_ENV=development ou NODE_ENV=production
# =============================================================================

ARG NODE_ENV=production

FROM node:lts-alpine3.22 AS base

RUN apk update && apk upgrade --no-cache && apk add --no-cache curl && \
  for i in 1 2 3; do npm install -g npm@11.10.1 && exit 0; echo "Retry $i..."; sleep 15; done; exit 1

WORKDIR /app

# 1. Copie des fichiers de dépendances uniquement (cache layer Docker)
COPY frontend/package.json frontend/package-lock.json ./frontend/
# .npmrc (ex. legacy-peer-deps) doit être identique au contexte de génération du lock
COPY frontend/.npmrc ./frontend/
COPY shared/package.json ./shared/

# 2. Installation des dépendances (layer caché tant que package*.json ne change pas)
# NPM_TOKEN passé en secret (CI) pour éviter le rate limit du registry
WORKDIR /app/frontend
RUN --mount=type=secret,id=NPM_TOKEN \
  for i in 1 2 3; do \
    export NODE_AUTH_TOKEN=`cat /run/secrets/NPM_TOKEN`; \
    npm ci && exit 0; \
    echo "Retry $$i..."; sleep 15; \
  done; exit 1

WORKDIR /app/shared
RUN --mount=type=secret,id=NPM_TOKEN \
  for i in 1 2 3; do \
    export NODE_AUTH_TOKEN=`cat /run/secrets/NPM_TOKEN`; \
    npm install && exit 0; \
    echo "Retry $$i..."; sleep 15; \
  done; exit 1

# 3. Copie du code source complet
WORKDIR /app
COPY frontend ./frontend
COPY shared ./shared

# Build shared (requis par le frontend)
WORKDIR /app/shared
RUN npm run build

# =============================================================================
# Stage DEVELOPMENT
# =============================================================================
FROM base AS development

WORKDIR /app/frontend
EXPOSE 3000
ENV NODE_ENV=development
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0", "--port", "3000"]

# =============================================================================
# Stage BUILD (pour production)
# =============================================================================
FROM base AS builder

ARG NEXT_PUBLIC_API_URL
ARG API_URL_INTERNAL=http://backend:3001
ARG SKIP_API_DURING_BUILD=true

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV API_URL_INTERNAL=$API_URL_INTERNAL
# Pas d'API disponible pendant le build Docker (Coolify, CI) → fallback immédiat
ENV SKIP_API_DURING_BUILD=${SKIP_API_DURING_BUILD}

WORKDIR /app/frontend
RUN npm run build

# =============================================================================
# Stage PRODUCTION (standalone)
# =============================================================================
FROM base AS production

RUN apk update && apk upgrade --no-cache && apk add --no-cache curl

WORKDIR /app
ENV NODE_ENV=production

# Standalone (build dans frontend/) → standalone/frontend/ et éventuellement standalone/node_modules
# On copie tout le standalone puis on ajoute static + public dans frontend/
COPY --from=builder /app/frontend/.next/standalone ./
# Standalone n'inclut pas public ni .next/static → copie dans frontend/
COPY --from=builder /app/frontend/.next/static ./frontend/.next/static
COPY --from=builder /app/frontend/public ./frontend/public

# Vérifier que les SVG par défaut sont bien présents dans l'image
RUN test -f ./frontend/public/icon.svg && test -f ./frontend/public/images/profile/photo.svg && test -f ./frontend/public/images/placeholder-project.svg || (echo "ERREUR: assets statiques (SVG) manquants dans public/" && exit 1)

EXPOSE 3000
WORKDIR /app/frontend
CMD ["node", "server.js"]

# =============================================================================
# Stage final
# =============================================================================
FROM ${NODE_ENV} AS final
