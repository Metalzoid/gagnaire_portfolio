# Container

Wrapper de mise en page qui applique les marges / largeur du contenu. Peut être rendu avec une balise sémantique personnalisée.

## Import

```tsx
import { Container } from "@/components/ui/container";
```

## Props

| Prop        | Type           | Défaut  | Description |
| ----------- | -------------- | ------- | ----------- |
| `children`  | ReactNode      | requis | Contenu à envelopper |
| `as`        | React.ElementType | `"div"` | Balise ou composant rendu (ex. `main`, `section`) |
| `className` | string        | —       | Classes CSS additionnelles |

## Utilisation

### Conteneur par défaut (div)

```tsx
<Container>
  <p>Contenu centré avec padding latéral.</p>
</Container>
```

### Conteneur en tant que `<main>`

```tsx
<Container as="main">
  <h1>Page d’accueil</h1>
  <p>Contenu principal.</p>
</Container>
```

### Conteneur en tant que `<section>`

```tsx
<Container as="section" className={styles.hero}>
  <h2>Hero</h2>
</Container>
```

## Note

Les dimensions et espacements réels dépendent du fichier `Container.module.scss` du thème (breakpoints, max-width, padding).
