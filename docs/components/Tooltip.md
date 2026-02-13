# Tooltip

Info-bulle affichée au survol ou au focus de l’élément enfant. Le contenu est rendu dans un portail (document.body) et suit le curseur ou l’élément déclencheur.

## Import

```tsx
import { Tooltip } from "@/components/ui/tooltip";
```

## Props

| Prop       | Type   | Défaut  | Description |
| ---------- | ------ | ------- | ----------- |
| `content`  | string | requis | Texte du tooltip |
| `position` | `"top"` \| `"bottom"` \| `"left"` \| `"right"` | `"top"` | Position préférentielle (le rendu peut s’ajuster pour rester à l’écran) |
| `children` | ReactNode | requis | Élément qui déclenche l’affichage (survol / focus) |

## Utilisation

### Sur un bouton

```tsx
<Tooltip content="Enregistrer les modifications">
  <Button icon={<FiSave />}>Sauvegarder</Button>
</Tooltip>
```

### Sur une icône

```tsx
<Tooltip content="Copier le lien" position="bottom">
  <button type="button" aria-label="Copier">
    <FiLink />
  </button>
</Tooltip>
```

### Sur du texte ou un span

```tsx
<Tooltip content="Explication courte">
  <span className={styles.hint}>?</span>
</Tooltip>
```

## Comportement

- **Survol** : le tooltip suit le curseur (positionné au-dessus par défaut).
- **Focus** : au focus clavier sur l’enfant, le tooltip s’affiche et reste positionné par rapport à l’élément.
- Le contenu est rendu dans `document.body` pour éviter les problèmes de débordement (overflow).
- Compatible SSR : le tooltip n’est rendu côté client qu’après montage (`useSyncExternalStore`).

## Accessibilité

- Quand le tooltip est visible, l’enfant reçoit `aria-describedby` pointant vers l’id du tooltip.
- Le tooltip a `role="tooltip"`.
