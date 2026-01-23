# =============================================================================
# Backend Dockerfile - Gestion multi-environnement
# Usage: NODE_ENV=development ou NODE_ENV=production
# =============================================================================

# ARG global pour sélectionner le stage final
ARG NODE_ENV=production

FROM node:20-alpine AS base

# Installation de curl pour les healthchecks
RUN apk add --no-cache curl

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# =============================================================================
# Stage DEVELOPMENT
# =============================================================================
FROM base AS development

# Installation de toutes les dépendances (nodemon inclus)
RUN npm install

# Copie du code source (sera écrasé par les volumes en dev)
COPY . .

EXPOSE 3001

# Nodemon pour hot reload
CMD ["npm", "run", "dev"]

# =============================================================================
# Stage PRODUCTION
# =============================================================================
FROM base AS production

# Installation des dépendances de production uniquement
RUN npm install --omit=dev

COPY . .

EXPOSE 3001

# Démarrage en mode production
CMD ["npm", "start"]

# =============================================================================
# Stage final - sélection basée sur NODE_ENV
# =============================================================================
FROM ${NODE_ENV} AS final
