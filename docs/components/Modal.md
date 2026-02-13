# Modal

Fenêtre modale accessible : overlay, fermeture par Escape et clic extérieur, focus trap et annimation (framer-motion).

## Import

```tsx
import { Modal } from "@/components/ui/modal";
```

## Props

| Prop      | Type         | Défaut  | Description |
| --------- | ------------ | ------- | ----------- |
| `isOpen`  | boolean      | requis | Affiche ou cache la modale |
| `onClose` | () => void   | requis | Callback appelé à la fermeture (Escape, overlay, bouton) |
| `title`   | string       | —       | Titre affiché dans l’en-tête |
| `children`| ReactNode    | requis | Contenu du corps de la modale |

## Utilisation

### Modale contrôlée

```tsx
const [isOpen, setIsOpen] = useState(false);

<Button onClick={() => setIsOpen(true)}>Ouvrir</Button>

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Titre de la modale"
>
  <p>Contenu de la modale.</p>
  <Button onClick={() => setIsOpen(false)}>Fermer</Button>
</Modal>
```

### Sans titre

```tsx
<Modal isOpen={isOpen} onClose={onClose}>
  <p>Contenu sans titre.</p>
</Modal>
```

## Comportement

- **Verrouillage du scroll** : le scroll du body est bloqué quand la modale est ouverte (hook `useLockBodyScroll`).
- **Clavier** : `Escape` ferme la modale ; Tab reste piégé dans la modale (focus trap).
- **Focus** : le premier élément focusable reçoit le focus à l’ouverture.
- **Overlay** : cliquer sur l’overlay appelle `onClose`.
- Le contenu est rendu dans `document.body` via un portail pour éviter les problèmes de z-index et de positionnement.

## Accessibilité

- `role="dialog"`, `aria-modal="true"`.
- Si `title` est fourni : `aria-labelledby` pointe vers le titre.
- Bouton de fermeture avec `aria-label="Fermer la fenêtre"`.
