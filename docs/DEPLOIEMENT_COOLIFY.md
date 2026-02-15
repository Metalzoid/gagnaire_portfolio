# Déploiement Coolify

## Réseau : rendre l'addon PostgreSQL accessible au docker-compose

Par défaut, Coolify déploie chaque stack sur un **réseau Docker isolé**. Votre monorepo (frontend + backend) et l'addon PostgreSQL sont donc sur des réseaux différents → le backend ne peut pas joindre la base (`P1001: Can't reach database server`).

### Solution : Connect to Predefined Network

1. **Même destination** : Vérifiez que l'application (Service Stack) et l'addon PostgreSQL utilisent la **même destination** dans Coolify (même serveur + même réseau Docker).

2. **Activer le partage de réseau** :
   - Allez dans **Votre projet** → **Service Stack** (l'application docker-compose)
   - Dans les **paramètres** de la stack, activez **"Connect to Predefined Network"**
   - Sélectionnez la **destination** où PostgreSQL est déployé (ou la même que votre app)

3. **Redéployez** l'application après avoir activé l'option.

Les conteneurs backend et PostgreSQL seront alors sur le même réseau et le hostname de `DATABASE_URL` sera joignable.

> **Important** : N'ajoutez pas de configuration `networks` dans votre `docker-compose.yml` — Coolify gère le réseau via cette option. Une config manuelle peut provoquer des erreurs (Gateway Timeout, etc.).

---

## Variables d'environnement requises

### Backend (obligatoires)

| Variable       | Description                                              | Exemple                                       |
| -------------- | -------------------------------------------------------- | --------------------------------------------- |
| `DATABASE_URL` | URL complète de connexion PostgreSQL                     | `postgresql://user:password@host:5432/dbname` |
| `JWT_SECRET`   | Clé secrète pour les tokens JWT (authentification admin) | Chaîne aléatoire longue (ex: 64 caractères)   |

### Backend (optionnelles)

| Variable | Description             | Défaut                              |
| -------- | ----------------------- | ----------------------------------- |
| `PORT`   | Port interne du serveur | `3001` (défini dans docker-compose) |

### Frontend (optionnelles)

| Variable              | Description                         | Défaut                       |
| --------------------- | ----------------------------------- | ---------------------------- |
| `NEXT_PUBLIC_API_URL` | URL de l'API (injecté au **build**) | `/api` pour le proxy Traefik |

### ⚠️ Variables non nécessaires

- **`POSTGRES_USER`**, **`POSTGRES_PASSWORD`**, **`POSTGRES_DB`** : utilisées uniquement si vous faites tourner votre propre conteneur Postgres (ex: docker-compose.dev). Avec Coolify et un addon PostgreSQL, **`DATABASE_URL` suffit** car elle contient déjà tout.

---

## Configuration Coolify

1. **Base de données**
   - Créez un addon PostgreSQL dans Coolify (ou utilisez une base externe)
   - Récupérez la `DATABASE_URL` fournie (format : `postgresql://user:password@host:5432/dbname`)

2. **Variables à définir dans Coolify**
   - `DATABASE_URL` : obligatoire
   - `JWT_SECRET` : obligatoire pour l’API admin

3. **PORT**
   - Le `docker-compose.yml` fixe déjà `PORT=3001` pour le backend
   - En général, pas besoin de le configurer dans Coolify

---

## Si le backend reste "unhealthy"

1. **Logs du conteneur backend** dans Coolify pour voir l’erreur :
   - Si "DATABASE_URL n'est pas défini" → ajoutez la variable dans Coolify
   - Si erreur Prisma / connexion → vérifiez que `DATABASE_URL` pointe vers une base accessible (réseau, firewall, hostname)

2. **Format de `DATABASE_URL`**
   - Doit ressembler à : `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`
   - Pour une base gérée par Coolify sur le même réseau, le host peut être le nom du service (ex: `postgres`)

3. **Premier déploiement**
   - Les migrations Prisma peuvent prendre 15–30 secondes
   - Le `start_period` du healthcheck est à 30 s pour laisser le temps au backend de démarrer

---

## Console REPL (Prisma) en production

Pour ouvrir une console REPL avec accès aux modèles Prisma dans le conteneur backend :

```bash
docker compose exec backend npm run console
```
