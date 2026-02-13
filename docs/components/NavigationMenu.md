# NavigationMenu

Menu de navigation latéral (drawer) affiché en overlay. Affiche les sections du contexte snap-scroll (home) ou des liens d’ancrage, plus des liens externes (ex. Blog). Inclut le ThemeToggle en pied de menu.

## Import

```tsx
import { NavigationMenu } from "@/components/navigation";
```

## Dépendances

- **SnapScrollContext** : `sections`, `currentSection`, `goToSectionById` pour les liens de sections sur la page d’accueil.
- **next/navigation** : `usePathname()` pour savoir si on est sur `/` (home) ou une autre page.

## Props

| Prop      | Type         | Défaut  | Description |
| --------- | ------------ | ------- | ----------- |
| `isOpen`  | boolean      | requis | Affiche ou cache le menu |
| `onClose` | () => void   | requis | Callback pour fermer le menu (après clic sur un lien ou overlay) |

## Utilisation

En général, le menu est utilisé via `NavigationWrapper`, qui gère l’état et le BurgerButton :

```tsx
<NavigationWrapper>
  {children}
</NavigationWrapper>
```

Utilisation directe si vous gérez vous-même l’état :

```tsx
const [menuOpen, setMenuOpen] = useState(false);

<BurgerButton isOpen={menuOpen} onClick={() => setMenuOpen((p) => !p)} />
<NavigationMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
```

## Comportement

- **Page d’accueil** : les sections sont des boutons qui appellent `goToSectionById(section.id)` puis `onClose()`.
- **Autres pages** : les sections sont des liens `/#sectionId` qui ferment le menu au clic.
- **Liens externes** : définis en dur dans le composant (ex. `/blog`). À adapter dans le fichier source si besoin.
- **Focus trap** : une fois le menu ouvert, la tabulation reste dans le menu.
- **Animations** : ouverture/fermeture et apparition des liens via framer-motion.

## Personnalisation des liens externes

Les liens comme "Blog" sont dans le tableau `externalLinks` dans `NavigationMenu.tsx`. Modifiez ce tableau pour ajouter ou retirer des liens.
