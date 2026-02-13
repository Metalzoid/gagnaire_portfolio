# Button

Bouton réutilisable avec variantes de style, tailles, icône optionnelle et état de chargement. Peut être rendu comme lien (`href`).

## Import

```tsx
import { Button } from "@/components/ui/button";
```

## Props

| Prop        | Type   | Défaut      | Description |
| ----------- | ------ | ----------- | ----------- |
| `children`  | ReactNode | requis  | Contenu du bouton |
| `variant`   | `"primary"` \| `"secondary"` \| `"outline"` \| `"ghost"` | `"primary"` | Style visuel |
| `size`      | `"sm"` \| `"md"` \| `"lg"` | `"md"` | Taille |
| `href`      | string | —          | Si fourni, rend un `<Link>` au lieu d’un `<button>` |
| `icon`      | ReactNode | —        | Icône affichée à gauche du texte (masquée en loading) |
| `loading`   | boolean | `false`    | Affiche un spinner et désactive le bouton |
| `disabled`  | boolean | `false`    | Désactive le bouton |
| `onClick`   | () => void | —      | Callback au clic (ignoré si `href` et non désactivé) |
| `ariaLabel` | string | —          | Label pour l’accessibilité |
| `className` | string | —          | Classes CSS additionnelles |
| `type`      | `"button"` \| `"submit"` \| `"reset"` | `"button"` | Type du bouton natif |

## Utilisation

### Bouton simple

```tsx
<Button onClick={() => console.log("Clic")}>Envoyer</Button>
```

### Variantes

```tsx
<Button variant="primary">Principal</Button>
<Button variant="secondary">Secondaire</Button>
<Button variant="outline">Contour</Button>
<Button variant="ghost">Discret</Button>
```

### Tailles

```tsx
<Button size="sm">Petit</Button>
<Button size="md">Moyen</Button>
<Button size="lg">Grand</Button>
```

### Bouton lien

```tsx
<Button href="/contact" ariaLabel="Aller à la page contact">
  Contact
</Button>
```

### Avec icône

```tsx
import { FiSend } from "react-icons/fi";

<Button icon={<FiSend />} onClick={handleSubmit}>
  Envoyer
</Button>
```

### État de chargement

```tsx
const [loading, setLoading] = useState(false);

<Button loading={loading} onClick={handleSubmit}>
  {loading ? "Envoi…" : "Envoyer"}
</Button>
```

### Soumission de formulaire

```tsx
<Button type="submit" loading={isSubmitting}>
  Enregistrer
</Button>
```

## Accessibilité

- Utilisez `ariaLabel` pour les boutons dont le seul contenu est une icône.
- En `loading`, le bouton a `aria-busy="true"` et est désactivé.
