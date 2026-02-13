# Card

Carte de contenu avec image optionnelle, titre, description, badges et lien optionnel. Peut être utilisée comme bloc d’article ou comme lien cliquable.

## Import

```tsx
import { Card } from "@/components/ui/card";
```

## Props

| Prop          | Type       | Défaut   | Description |
| ------------- | ---------- | -------- | ----------- |
| `title`       | string     | requis  | Titre de la carte |
| `image`       | string     | —        | URL de l’image (Next.js `Image`) |
| `description` | string     | —        | Texte sous le titre |
| `tags`        | string[]   | —        | Liste de labels affichés en `Badge` (variant tech) |
| `href`        | string     | —        | Si fourni, la carte est un `<Link>` |
| `hoverable`   | boolean    | `false`  | Effet au survol |
| `children`    | ReactNode  | —        | Contenu additionnel dans le corps |
| `className`   | string     | —        | Classes CSS additionnelles |

## Utilisation

### Carte simple (article)

```tsx
<Card
  title="Mon projet"
  description="Une courte description du projet."
/>
```

### Carte avec image et tags

```tsx
<Card
  image="/images/projet.jpg"
  title="Application web"
  description="Description du projet."
  tags={["React", "TypeScript", "Node.js"]}
/>
```

### Carte cliquable (lien)

```tsx
<Card
  href="/projets/mon-projet"
  image="/images/projet.jpg"
  title="Mon projet"
  description="Voir les détails."
  tags={["React"]}
  hoverable
/>
```

### Carte avec contenu personnalisé

```tsx
<Card title="Titre" description="Description.">
  <p>Contenu supplémentaire ou bouton d’action.</p>
</Card>
```

## Accessibilité

- Avec `href`, un `aria-label="Voir [title]"` est appliqué sur le lien.
- L’image utilise le `title` comme `alt`.
