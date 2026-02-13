# Skeleton

Placeholder animé pour le chargement de contenu (texte, cercle, rectangle).

## Import

```tsx
import { Skeleton } from "@/components/ui/skeleton";
```

## Props

| Prop        | Type   | Défaut   | Description |
| ----------- | ------ | -------- | ----------- |
| `variant`   | `"text"` \| `"circle"` \| `"rect"` | `"rect"` | Forme du skeleton |
| `width`     | string | —        | Largeur CSS (ex. `"100%"`, `"200px"`) |
| `height`    | string | —        | Hauteur CSS |
| `className` | string | —        | Classes CSS additionnelles |

## Utilisation

### Rectangle (défaut)

```tsx
<Skeleton />
<Skeleton width="200px" height="120px" />
```

### Ligne de texte

```tsx
<Skeleton variant="text" width="80%" height="1em" />
<Skeleton variant="text" width="60%" height="1em" />
```

### Cercle (avatar)

```tsx
<Skeleton variant="circle" width="48px" height="48px" />
```

### Grille de cartes en chargement

```tsx
<div className={styles.grid}>
  {Array.from({ length: 6 }).map((_, i) => (
    <div key={i} className={styles.card}>
      <Skeleton height="200px" />
      <Skeleton variant="text" width="70%" />
      <Skeleton variant="text" width="50%" />
    </div>
  ))}
</div>
```

## Accessibilité

- `role="presentation"` et `aria-hidden="true"` car le skeleton est décoratif. Le contenu chargé doit être annoncé (ex. `aria-live` ou remplacement du skeleton par le contenu réel).
