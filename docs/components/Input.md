# Input

Champ de formulaire avec label, message d’erreur et support texte / email / textarea. Gère l’accessibilité (aria-invalid, aria-describedby).

## Import

```tsx
import { Input } from "@/components/ui/input";
```

## Props

| Prop       | Type   | Défaut  | Description |
| ---------- | ------ | ------- | ----------- |
| `label`    | string | requis | Libellé du champ |
| `name`     | string | requis | Attribut `name` du champ |
| `type`     | `"text"` \| `"email"` \| `"textarea"` | `"text"` | Type de champ |
| `value`    | string | —       | Valeur contrôlée |
| `onChange` | (e: React.ChangeEvent<…>) => void | — | Gestion du changement |
| `error`    | string | —       | Message d’erreur affiché sous le champ |
| `required` | boolean | `false` | Champ obligatoire (affiche un *) |
| `className` | string | —     | Non utilisé sur le wrapper ; à étendre en SCSS si besoin |

## Utilisation

### Champ texte simple

```tsx
<Input
  label="Nom"
  name="name"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

### Champ email obligatoire

```tsx
<Input
  type="email"
  label="Email"
  name="email"
  required
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

### Avec erreur de validation

```tsx
<Input
  label="Email"
  name="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
/>
```

### Textarea

```tsx
<Input
  type="textarea"
  label="Message"
  name="message"
  value={message}
  onChange={(e) => setMessage(e.target.value)}
/>
```

## Contrôle du formulaire

Le composant est prévu pour une utilisation **contrôlée** : fournissez toujours `value` et `onChange` pour un contrôle depuis le parent (ex. state React ou formulaire).

## Accessibilité

- `id` généré via `useId()` et associé au `label` via `htmlFor`.
- En cas d’erreur : `aria-invalid`, `aria-describedby` pointant vers le message d’erreur, et message avec `role="alert"`.
- Champ obligatoire indiqué par un `*` avec `aria-hidden="true"` pour ne pas être lu en double par les lecteurs d’écran.
