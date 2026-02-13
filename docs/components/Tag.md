# Tag

Label affichable seul ou cliquable (filtres, sélection). Variantes de style et états actif / désactivé.

## Import

```tsx
import { Tag } from "@/components/ui/tag";
```

## Props

| Prop        | Type     | Défaut     | Description |
| ----------- | -------- | ---------- | ----------- |
| `label`     | string   | requis    | Texte du tag |
| `active`    | boolean  | `false`   | État actif (sélectionné) |
| `disabled`  | boolean  | `false`   | Désactive le tag (si cliquable) |
| `variant`   | `"default"` \| `"accent"` \| `"success"` \| `"warning"` \| `"error"` \| `"info"` | `"default"` | Style visuel |
| `className` | string   | —         | Classes CSS additionnelles |
| `onClick`   | () => void | —       | Si fourni et non disabled, le tag est rendu en `<button>` |

## Utilisation

### Tag non cliquable (affichage)

```tsx
<Tag label="React" />
<Tag label="TypeScript" variant="accent" />
```

### Tag cliquable (filtre)

```tsx
const [activeFilter, setActiveFilter] = useState<string | null>(null);

{filters.map((filter) => (
  <Tag
    key={filter}
    label={filter}
    active={activeFilter === filter}
    onClick={() => setActiveFilter(activeFilter === filter ? null : filter)}
  />
))}
```

### Variantes

```tsx
<Tag label="Default" variant="default" />
<Tag label="Accent" variant="accent" />
<Tag label="Succès" variant="success" />
<Tag label="Attention" variant="warning" />
<Tag label="Erreur" variant="error" />
<Tag label="Info" variant="info" />
```

### Tag désactivé

```tsx
<Tag label="Indisponible" disabled />
<Tag label="Filtre" onClick={handleClick} disabled />
```

## Accessibilité

- En mode bouton : `aria-pressed={active}` et `aria-label="Filtrer par [label]"`.
- En mode span : `aria-disabled` si `disabled`.
