# Badge

Composant d’affichage d’un label sous forme de badge (technologie, statut, etc.).

## Import

```tsx
import { Badge } from "@/components/ui/badge";
```

## Props

| Prop      | Type   | Défaut   | Description                                      |
| --------- | ------ | -------- | ------------------------------------------------ |
| `label`   | string | requis  | Texte affiché dans le badge                      |
| `variant` | `"tech"` \| `"status"` \| `"custom"` | `"tech"` | Style du badge |
| `color`   | string | —        | Couleur personnalisée (variable CSS `--badge-color`) |
| `className` | string | —      | Classes CSS additionnelles                       |

## Utilisation

### Badge par défaut (tech)

```tsx
<Badge label="React" />
<Badge label="TypeScript" variant="tech" />
```

### Badge statut

```tsx
<Badge label="En cours" variant="status" />
<Badge label="Terminé" variant="status" />
```

### Badge avec couleur personnalisée

```tsx
<Badge label="Custom" variant="custom" color="#8be9fd" />
```

### Dans une liste (ex. cartes, filtres)

```tsx
<div className={styles.tags}>
  {["React", "Node.js", "PostgreSQL"].map((tag) => (
    <Badge key={tag} label={tag} variant="tech" />
  ))}
</div>
```

## Accessibilité

- Le composant rend un `<span>` : à utiliser pour du contenu informatif, pas pour des actions.
- Pour des actions (filtres, sélection), privilégier le composant **Tag** avec `onClick`.
