# NavigationWrapper

Wrapper qui fournit la barre de navigation du site : bouton burger, bascule du thème (desktop), menu latéral et zone de contenu. Gère l’état du menu, le verrouillage du scroll et la fermeture à la touche Escape.

## Import

```tsx
import { NavigationWrapper } from "@/components/navigation";
```

## Props

| Prop       | Type      | Défaut  | Description |
| ---------- | --------- | ------- | ----------- |
| `children` | ReactNode | requis | Contenu de la page (affiché sous la top bar) |

## Utilisation

Enveloppez le contenu de votre layout ou de la page :

```tsx
// app/layout.tsx ou page
import { NavigationWrapper } from "@/components/navigation";

export default function Layout({ children }) {
  return (
    <NavigationWrapper>
      {children}
    </NavigationWrapper>
  );
}
```

## Comportement

- **Top bar** : ThemeToggle (visible desktop) + BurgerButton.
- **Menu** : `NavigationMenu` s’affiche quand le burger est ouvert.
- **Scroll** : body scroll verrouillé quand le menu est ouvert (`useLockBodyScroll`).
- **Escape** : ferme le menu (`useKeyPress("Escape", closeMenu, menuOpen)`).
- **Contenu** : la div de contenu peut recevoir une classe "shifted" quand le menu est ouvert (selon les styles) pour un effet de décalage.

## Prérequis

- Le wrapper doit être utilisé dans une arborescence qui fournit **SnapScrollProvider** si la page d’accueil utilise les sections snap (sinon le menu n’aura pas la liste des sections). Vérifier que le layout ou la page qui utilise `NavigationWrapper` est sous le provider approprié.
