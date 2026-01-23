# Gagnaire Portfolio

Application web full-stack moderne construite avec React (Vite) et Express.js, organisée en monorepo avec support Docker pour le développement et la production.

## 🎯 Vue d'ensemble

Ce projet est un portfolio professionnel comprenant :
- **Frontend** : Application React avec Vite pour un développement rapide et un build optimisé
- **Backend** : API REST Express.js avec support Node.js moderne
- **Infrastructure** : Configuration Docker complète pour développement et production

## 📁 Structure du projet

```
gagnaire_portfolio/
├── frontend/              # Application React + Vite
│   ├── src/               # Code source React
│   ├── public/            # Assets statiques
│   ├── Dockerfile         # Image multi-stage (dev/prod)
│   └── package.json
├── backend/               # API Express.js
│   ├── src/
│   │   └── index.js       # Point d'entrée du serveur
│   ├── Dockerfile         # Image multi-stage (dev/prod)
│   └── package.json
├── docker-compose.yml     # Configuration production
├── docker-compose.dev.yml # Configuration développement
├── package.json           # Workspace npm racine
└── README.md
```

## 🚀 Démarrage rapide

### Prérequis

- **Node.js** >= 18
- **npm** >= 9
- **Docker** & **Docker Compose** (optionnel, pour le développement containerisé)

## 💻 Développement local

### Installation des dépendances

Depuis la racine du projet, installez toutes les dépendances des workspaces :

```bash
npm install
```

Cette commande installe automatiquement les dépendances du frontend et du backend grâce aux workspaces npm.

### Lancer les serveurs de développement

**Option 1 : Depuis la racine (recommandé)**

```bash
# Terminal 1 - Frontend
npm run dev:frontend

# Terminal 2 - Backend
npm run dev:backend
```

**Option 2 : Depuis chaque dossier**

```bash
# Frontend (port 5173)
cd frontend && npm run dev

# Backend (port 3001)
cd backend && npm run dev
```

### Accès aux applications

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | Application React avec hot reload |
| Backend | http://localhost:3001 | API Express.js |
| API Health | http://localhost:3001/api/health | Endpoint de santé de l'API |

## 🐳 Développement avec Docker

### Lancer l'environnement de développement

```bash
npm run docker:dev
```

Cette commande :
- Construit les images Docker en mode développement
- Monte les volumes pour le hot reload
- Expose les ports nécessaires
- Configure le réseau interne entre les services

### Avantages du mode Docker

✅ Hot reload automatique (modifications détectées en temps réel)
✅ Environnement isolé et reproductible
✅ Pas besoin d'installer Node.js localement
✅ Configuration identique pour toute l'équipe

### Accès en mode développement

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:3001 |

### Commandes Docker utiles

```bash
# Lancer en arrière-plan
npm run docker:dev:detach

# Arrêter les conteneurs
npm run docker:dev:down

# Nettoyer complètement (images + volumes)
npm run docker:clean
```

## 🏭 Production

### Build et déploiement avec Docker

```bash
npm run docker:prod
```

### Configuration production

- **Frontend** : Build optimisé avec Vite, servi par `serve` (serveur HTTP simple)
- **Backend** : Node.js en mode production, dépendances optimisées
- **Proxy** : Traefik (via Coolify) gère le reverse proxy et le routing des requêtes `/api/*` vers le backend

### Accès en production

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:3001 |

> **Note** : En production avec Coolify, Traefik gère automatiquement le routing et l'exposition des services. Les ports internes (3000 pour le frontend, 3001 pour le backend) sont utilisés en interne par Docker.

### Commandes production

```bash
# Lancer en arrière-plan
npm run docker:prod:detach

# Arrêter les conteneurs
npm run docker:prod:down
```

## 📜 Scripts npm disponibles

Tous les scripts sont exécutables depuis la racine du projet :

| Commande | Description |
|----------|-------------|
| `npm install` | Installe toutes les dépendances (workspaces) |
| `npm run dev` | Lance tous les serveurs de développement |
| `npm run dev:frontend` | Lance uniquement le frontend |
| `npm run dev:backend` | Lance uniquement le backend |
| `npm run build` | Build tous les workspaces |
| `npm run build:frontend` | Build uniquement le frontend |
| `npm run docker:dev` | Lance Docker en mode développement |
| `npm run docker:dev:detach` | Lance Docker en mode dev (détaché) |
| `npm run docker:dev:down` | Arrête les conteneurs de développement |
| `npm run docker:prod` | Lance Docker en mode production |
| `npm run docker:prod:detach` | Lance Docker en mode prod (détaché) |
| `npm run docker:prod:down` | Arrête les conteneurs de production |
| `npm run docker:clean` | Nettoie toutes les images et volumes |

## 🔧 Configuration

### Variables d'environnement

Le projet utilise un fichier `.env` unique à la racine pour gérer toutes les variables d'environnement.

#### Créer le fichier `.env`

Créez un fichier `.env` à la racine du projet :

```bash
touch .env
```

#### Variables disponibles

| Variable | Description | Défaut | Service |
|----------|-------------|--------|---------|
| `BACKEND_PORT` | Port du serveur Express | `3001` | Backend |
| `NODE_ENV` | Environnement Node.js | `production` | Backend |
| `VITE_API_URL` | URL de l'API (build time) | `http://localhost:3001/api` | Frontend |

#### Exemple de fichier `.env`

```env
# Backend
BACKEND_PORT=3001
NODE_ENV=production

# Frontend (préfixe VITE_ requis pour Vite)
VITE_API_URL=http://localhost:3001/api
```

#### ⚠️ Important : Différence Frontend vs Backend

- **Backend** : Les variables sont chargées au **runtime** via `dotenv` et `env_file` dans Docker Compose
- **Frontend** : Les variables doivent avoir le préfixe `VITE_` et sont injectées au **build time** dans le bundle JavaScript. Elles ne sont pas disponibles au runtime (application statique servie par `serve`)

#### Utilisation dans le code

**Backend** (`backend/src/index.js`) :
```javascript
const PORT = process.env.PORT || 3001;
```

**Frontend** (`frontend/src/`) :
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

## 🏗️ Architecture technique

### Workspaces npm

Le projet utilise les workspaces npm natifs pour gérer les dépendances :
- Toutes les dépendances sont hoistées à la racine dans `node_modules/`
- Installation centralisée avec `npm install`
- Scripts exécutables depuis la racine ou chaque workspace

### Docker multi-stage

Les Dockerfiles utilisent une architecture multi-stage pour optimiser les images :

**Frontend** :
- Stage `development` : Vite dev server avec hot reload
- Stage `builder` : Build de l'application React
- Stage `production` : Serveur HTTP simple (`serve`) servant les fichiers statiques (optimisé pour Coolify/Traefik)

**Backend** :
- Stage `development` : Node.js avec nodemon pour hot reload
- Stage `production` : Node.js optimisé avec dépendances de production uniquement

### Proxy API

En production avec Coolify, Traefik gère automatiquement le reverse proxy et route les requêtes `/api/*` vers le backend Express.js. Le frontend utilise `serve` pour servir les fichiers statiques, sans configuration de proxy supplémentaire.

## 📝 Notes importantes

1. **Hot Reload** : En mode développement avec Docker, les modifications de code sont automatiquement détectées grâce aux volumes montés
2. **Variables d'environnement** : Un seul fichier `.env` à la racine suffit pour tous les services
3. **Build Frontend** : Les variables `VITE_*` sont injectées au build time, pas au runtime
4. **Production** : Le frontend en production est une application statique servie par `serve`, optimisée pour fonctionner avec Coolify et Traefik

## 🤝 Contribution

1. Créer une branche feature : `git checkout -b feature/ma-feature`
2. Commiter les changements : `git commit -m "Ajout de ma feature"`
3. Pousser la branche : `git push origin feature/ma-feature`
4. Ouvrir une Pull Request

## 📄 Licence

ISC
