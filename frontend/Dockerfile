# =============================================================================
# Frontend Dockerfile - Gestion multi-environnement
# Usage: NODE_ENV=development ou NODE_ENV=production
# =============================================================================

# ARG global pour sélectionner le stage final
ARG NODE_ENV=production

FROM node:20-alpine AS base

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# =============================================================================
# Stage DEVELOPMENT
# =============================================================================
FROM base AS development

# Installation de curl pour les healthchecks
RUN apk add --no-cache curl

# Installation de toutes les dépendances (dev incluses)
RUN npm install

# Copie du code source (sera écrasé par les volumes en dev)
COPY . .

EXPOSE 5173

# Vite dev server avec hot reload
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# =============================================================================
# Stage BUILD (pour production)
# =============================================================================
FROM base AS builder

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Installation des dépendances (dev incluses pour vite)
RUN npm install --include=dev

COPY . .

# Build de l'application
RUN npm run build

# =============================================================================
# Stage PRODUCTION
# =============================================================================
FROM node:20-alpine AS production

# Installation de curl pour les healthchecks
RUN apk add --no-cache curl

WORKDIR /app

# Installation de serve globalement pour servir les fichiers statiques
RUN npm install -g serve

# Copie des fichiers buildés
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Serve les fichiers statiques avec support SPA (routing côté client)
CMD ["serve", "-s", "dist", "-l", "3000"]

# =============================================================================
# Stage final - sélection basée sur NODE_ENV
# =============================================================================
FROM ${NODE_ENV} AS final
