# Console Portfolio

Console interactive style Rails pour manipuler les modèles Prisma directement depuis le terminal.

## Prisma Studio (interface graphique)

Pour une UI visuelle pour explorer et modifier la BDD :

```bash
npm run studio
```

Ouvre **http://localhost:5555** dans le navigateur.

**Note :** Si vous utilisez Prisma Postgres (URL avec `api_key`) ou si Studio affiche "prisma+postgres protocol not supported", le script utilise automatiquement l'URL PostgreSQL locale (`postgresql://portfolio:portfolio_dev@localhost:5432/portfolio_db`). Pour une URL personnalisée : `STUDIO_DATABASE_URL=postgresql://... npm run studio`.

---

## Démarrage de la console

### En local (development)

```bash
# Depuis la racine du monorepo
npm run console --workspace=backend
```

ou

```bash
cd backend
npm run console
```

Assurez-vous que `DATABASE_URL` est défini (fichier `.env` à la racine du projet ou variable d'environnement).

### Sur Coolify (production)

Depuis le terminal du container backend :

```bash
node dist/console.js
```

Si `tsx` est disponible dans le container :

```bash
npx tsx src/console.ts
```

---

## Variables disponibles

| Variable | Description |
|----------|-------------|
| `prisma` | Client Prisma brut |
| `chalk` | Bibliothèque de couleurs pour le terminal (ex. `chalk.green("OK")`) |
| `db` | Accès direct aux modèles : `db.project`, `db.skill`, `db.skillCategory`, `db.experience`, `db.testimonial`, `db.profile`, `db.admin` |
| `findAll(model)` | Raccourci pour lister tous les enregistrements d'un modèle |
| `count(model)` | Raccourci pour compter les enregistrements |
| `truncate(model)` | **Attention** : supprime TOUS les enregistrements du modèle |

---

## Exemples d'utilisation

### Lecture

```javascript
// Lister tous les projets
await db.project.findMany()

// Projets triés par ordre
await db.project.findMany({ orderBy: { order: "asc" } })

// Un projet par slug
await db.project.findUnique({ where: { slug: "portfolio-gagnaire" } })

// Compter les skills
await db.skill.count()

// Categories avec leurs skills (relation)
await db.skillCategory.findMany({ include: { skills: true } })

// Helpers raccourcis
await findAll("project")
await count("testimonial")
```

### Création

```javascript
// Créer un projet
await db.project.create({
  data: {
    slug: "mon-projet",
    title: "Mon Projet",
    description: "Courte description",
    longDescription: "Description détaillée",
    technologies: ["React", "TypeScript"],
    category: "Web",
    images: { main: "/images/projet.png", thumbnails: [] },
    featured: false,
    date: "2025-01",
  },
})

// Créer un skill dans une catégorie
const category = await db.skillCategory.findFirst()
await db.skill.create({
  data: {
    name: "React",
    level: 80,
    categoryId: category.id,
  },
})
```

### Modification

```javascript
// Mettre à jour un projet
await db.project.update({
  where: { slug: "mon-projet" },
  data: { featured: true },
})

// Mettre à jour plusieurs enregistrements
await db.project.updateMany({
  where: { category: "Web" },
  data: { order: 0 },
})
```

### Suppression

```javascript
// Supprimer un enregistrement
await db.project.delete({ where: { slug: "test" } })

// Supprimer tous les enregistrements d'un modèle (DANGER)
await truncate("testimonial")
```

---

## Commandes REPL intégrées

| Commande | Description |
|----------|-------------|
| `.help` | Afficher l'aide du REPL |
| `.exit` | Quitter la console |
| `.clear` | Effacer l'écran |
| `.save fichier` | Sauvegarder l'historique dans un fichier |
| `.load fichier` | Charger un fichier |

---

## Notes

- Le REPL supporte `await` en top-level (Node.js 16+).
- `Ctrl+C` deux fois pour forcer la sortie.
- Les relations Prisma fonctionnent : `include`, `select`, `where` imbriqués.
- En cas d'erreur de connexion à la BDD, vérifier `DATABASE_URL` et que PostgreSQL est démarré.
