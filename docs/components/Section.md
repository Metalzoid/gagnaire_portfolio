# Section

Bloc de section sémantique avec titre optionnel et support du snap scroll.

## Import

```tsx
import { Section } from "@/components/ui/section";
```

## Props

| Prop         | Type     | Défaut   | Description |
| ------------ | -------- | -------- | ----------- |
| `children`   | ReactNode| requis  | Contenu de la section |
| `title`      | string   | —        | Titre (rendu en `<h2>`) |
| `id`         | string   | —        | `id` du `<section>` (ancres, snap) |
| `snapTarget` | boolean  | `false`  | Active le snap scroll sur cette section |
| `className`  | string   | —        | Classes CSS additionnelles |

## Utilisation

### Section simple

```tsx
<Section title="À propos">
  <p>Contenu de la section.</p>
</Section>
```

### Section avec id (ancres)

```tsx
<Section id="contact" title="Contact">
  <p>Formulaire ou coordonnées.</p>
</Section>
```

### Section avec snap scroll

Utilisé sur la page d’accueil pour que chaque section occupe l’écran et snap au scroll :

```tsx
<Section id="hero" snapTarget>
  <h1>Hero</h1>
</Section>
<Section id="projects" title="Projets" snapTarget>
  …
</Section>
```

### Section sans titre

```tsx
<Section id="footer">
  <Footer />
</Section>
```

## Accessibilité

- Si un `title` est fourni, un `id` dérivé (`${id}-title`) est utilisé pour `aria-labelledby` sur le `<section>`.
