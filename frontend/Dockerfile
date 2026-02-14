# =============================================================================
# Frontend Dockerfile - Next.js - Gestion multi-environnement
# Usage: NODE_ENV=development ou NODE_ENV=production
# =============================================================================

ARG NODE_ENV=production

FROM node:20-alpine AS base

# Mise à jour npm vers la v11
RUN npm install -g npm@11

WORKDIR /app

COPY package*.json ./

# =============================================================================
# Stage DEVELOPMENT
# =============================================================================
FROM base AS development

RUN apk add --no-cache curl

RUN npm install

COPY . .

EXPOSE 3000

ENV NODE_ENV=development
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0", "--port", "3000"]

# =============================================================================
# Stage BUILD (pour production)
# =============================================================================
FROM base AS builder

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm install --include=dev

COPY . .

RUN npm run build

# =============================================================================
# Stage PRODUCTION (standalone - pas d'install npm, tout vient du builder)
# =============================================================================
FROM node:20-alpine AS production

RUN apk add --no-cache curl

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]

# =============================================================================
# Stage final - sélection basée sur NODE_ENV
# =============================================================================
FROM ${NODE_ENV} AS final
