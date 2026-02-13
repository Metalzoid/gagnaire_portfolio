# BurgerButton

Bouton hamburger (trois barres) pour ouvrir / fermer le menu de navigation mobile. Change d’apparence selon l’état ouvert/fermé (ex. transformation en X).

## Import

```tsx
import { BurgerButton } from "@/components/navigation";
```

## Props

| Prop      | Type         | Défaut  | Description |
| --------- | ------------ | ------- | ----------- |
| `isOpen`  | boolean      | requis | État ouvert du menu |
| `onClick` | () => void   | requis | Callback au clic (généralement toggle du menu) |

## Utilisation

Utilisé à l’intérieur de `NavigationWrapper`, qui gère l’état du menu :

```tsx
const [menuOpen, setMenuOpen] = useState(false);

<BurgerButton
  isOpen={menuOpen}
  onClick={() => setMenuOpen((prev) => !prev)}
/>
```

En pratique, on utilise plutôt le wrapper complet :

```tsx
<NavigationWrapper>
  <main>{children}</main>
</NavigationWrapper>
```

## Accessibilité

- `aria-label` : "Ouvrir le menu de navigation" ou "Fermer le menu" selon `isOpen`.
- `aria-expanded={isOpen}` pour indiquer l’état du menu.
