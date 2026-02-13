# ThemeToggle

Bouton pour basculer entre thème clair et thème sombre. Utilise le hook `useTheme` et affiche une icône soleil (mode clair) ou lune (mode sombre) selon le thème actif.

## Import

```tsx
import { ThemeToggle } from "@/components/shared/theme-toggle";
```

## Props

Aucune. Le composant est autonome et lit/met à jour le thème via le contexte ou le hook du projet.

## Utilisation

À placer dans la barre de navigation ou le menu :

```tsx
<ThemeToggle />
```

Il est déjà intégré dans :
- **NavigationWrapper** : visible sur desktop dans la top bar.
- **NavigationMenu** : en bas du menu mobile.

## Accessibilité

- `aria-label` : "Passer en mode clair" ou "Passer en mode sombre" selon `isDark`.
- `title` : "Mode clair" ou "Mode sombre" pour l’info-bulle.
- L’icône est masquée pour les lecteurs d’écran (`aria-hidden="true"`) car le label suffit.

## Dépendance

Le hook `useTheme()` doit être disponible (contexte ou provider du projet). Vérifier que le layout enveloppe l’app avec le provider de thème attendu.
