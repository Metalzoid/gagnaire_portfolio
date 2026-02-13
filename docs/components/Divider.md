# Divider

Composant de séparation visuelle entre blocs : ligne, points ou dégradé.

## Import

```tsx
import { Divider } from "@/components/ui/divider";
```

## Props

| Prop        | Type   | Défaut   | Description |
| ----------- | ------ | -------- | ----------- |
| `variant`   | `"line"` \| `"dots"` \| `"gradient"` | `"line"` | Style du séparateur |
| `className` | string | —        | Classes CSS additionnelles |

## Utilisation

### Ligne (défaut)

```tsx
<section>Contenu 1</section>
<Divider />
<section>Contenu 2</section>
```

### Points

```tsx
<Divider variant="dots" />
```

### Dégradé

```tsx
<Divider variant="gradient" />
```

### Avec classe personnalisée

```tsx
<Divider variant="line" className={styles.spaced} />
```

## Accessibilité

- Le composant a `role="presentation"` et `aria-hidden="true"` car il est purement décoratif.
