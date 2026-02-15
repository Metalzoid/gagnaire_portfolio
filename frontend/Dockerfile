# =============================================================================
# Frontend Dockerfile - Next.js - Gestion multi-environnement
# Contexte requis : racine du monorepo (pour accès au package shared)
# Usage: NODE_ENV=development ou NODE_ENV=production
# =============================================================================

ARG NODE_ENV=production

FROM node:20-alpine AS base

# Mise à jour npm vers la v11
RUN npm install -g npm@11

WORKDIR /app

# Copie des fichiers du monorepo (contexte = racine)
COPY package*.json ./
COPY shared ./shared
COPY frontend ./frontend

# =============================================================================
# Stage DEVELOPMENT
# =============================================================================
FROM base AS development

RUN apk add --no-cache curl

# Installation des workspaces (shared + frontend) - lock file pour build reproductible
RUN npm ci || npm install

# Build du package shared (requis pour le frontend)
RUN npm run build --workspace=shared

WORKDIR /app/frontend

EXPOSE 3000

ENV NODE_ENV=development
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0", "--port", "3000"]

# =============================================================================
# Stage BUILD (pour production)
# =============================================================================
FROM base AS builder

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Installation avec dépendances de dev (contexte monorepo) - lock file pour build reproductible
RUN npm ci --include=dev || npm install --include=dev

# Build du package shared en premier (types et dist requis par le frontend)
RUN npm run build --workspace=shared

# Build du frontend Next.js
WORKDIR /app/frontend
RUN npm run build

# =============================================================================
# Stage PRODUCTION (standalone - pas d'install npm, tout vient du builder)
# =============================================================================
FROM node:20-alpine AS production

RUN apk add --no-cache curl

WORKDIR /app

ENV NODE_ENV=production

# Monorepo : standalone met server.js dans frontend/ (pas à la racine)
COPY --from=builder /app/frontend/.next/standalone ./
COPY --from=builder /app/frontend/.next/static ./frontend/.next/static
COPY --from=builder /app/frontend/public ./frontend/public

EXPOSE 3000

# server.js est à frontend/server.js en monorepo
WORKDIR /app/frontend
CMD ["node", "server.js"]

# =============================================================================
# Stage final - sélection basée sur NODE_ENV
# =============================================================================
FROM ${NODE_ENV} AS final
