# SocialLinks

Liste d’icônes de liens vers des profils sociaux ou une adresse email. Affiche par défaut GitHub, LinkedIn et un lien mailto.

## Import

```tsx
import { SocialLinks } from "@/components/shared/social-links";
```

## Props

| Prop        | Type   | Défaut  | Description |
| ----------- | ------ | ------- | ----------- |
| `links`     | SocialLink[] | voir ci-dessous | Liste des liens à afficher |
| `size`      | `"sm"` \| `"md"` \| `"lg"` | `"md"` | Taille des icônes |
| `direction` | `"row"` \| `"column"` | `"row"` | Disposition horizontale ou verticale |

Type `SocialLink` :

- `url` : string (href)
- `icon` : ReactNode (ex. icône react-icons)
- `label` : string (aria-label et title)

## Liens par défaut

Si `links` n’est pas fourni, le composant utilise une liste par défaut (GitHub, LinkedIn, mailto). Pour la personnaliser, passer explicitement `links`.

## Utilisation

### Avec les liens par défaut

```tsx
<SocialLinks />
<SocialLinks size="sm" />
<SocialLinks direction="column" size="lg" />
```

### Avec des liens personnalisés

```tsx
import { FaGithub, FaTwitter } from "react-icons/fa";

const links = [
  { url: "https://github.com/username", icon: <FaGithub />, label: "GitHub" },
  { url: "https://twitter.com/username", icon: <FaTwitter />, label: "Twitter" },
];

<SocialLinks links={links} size="md" direction="row" />
```

### Dans un footer

```tsx
<footer>
  <SocialLinks size="sm" />
  <p>© 2025 Mon portfolio.</p>
</footer>
```

## Accessibilité

- Liste avec `aria-label="Liens sociaux"`.
- Chaque lien a `aria-label` et `title` égaux au `label`, et s’ouvre avec `target="_blank"` et `rel="noopener noreferrer"`.
