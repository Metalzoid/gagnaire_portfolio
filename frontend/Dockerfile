# =============================================================================
# Frontend Dockerfile - Build isolé avec frontend/package-lock.json
# Contexte : racine (pour accès à shared via file:../shared)
# Usage: NODE_ENV=development ou NODE_ENV=production
# =============================================================================

ARG NODE_ENV=production

FROM node:20-alpine AS base

RUN apk add --no-cache curl && npm install -g npm@11

WORKDIR /app

# Copie frontend + shared (file:../shared résout vers /app/shared)
COPY frontend ./frontend
COPY shared ./shared

# =============================================================================
# Stage DEVELOPMENT
# =============================================================================
FROM base AS development

RUN apk add --no-cache curl

WORKDIR /app/frontend
RUN npm ci

# Build shared (requis par le frontend)
WORKDIR /app/shared
RUN npm install && npm run build

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

WORKDIR /app/frontend
RUN npm ci --include=dev

WORKDIR /app/shared
RUN npm install && npm run build

WORKDIR /app/frontend
RUN npm run build

# =============================================================================
# Stage PRODUCTION (standalone)
# =============================================================================
FROM node:20-alpine AS production

RUN apk add --no-cache curl

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/frontend/.next/standalone ./
COPY --from=builder /app/frontend/.next/static ./.next/static
COPY --from=builder /app/frontend/public ./public

EXPOSE 3000
CMD ["node", "server.js"]

# =============================================================================
# Stage final
# =============================================================================
FROM ${NODE_ENV} AS final
