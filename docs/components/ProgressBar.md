# ProgressBar

Barre de navigation par points (dots) pour sauter vers une section par index. Chaque point correspond à une section ; le point actif est mis en évidence.

## Import

```tsx
import { ProgressBar } from "@/components/navigation";
```

## Props

| Prop             | Type     | Défaut  | Description |
| ---------------- | -------- | ------- | ----------- |
| `currentSection` | number   | requis | Index de la section actuellement visible (0-based) |
| `totalSections`  | number   | requis | Nombre total de sections |
| `sectionLabels`  | string[] | requis | Labels des sections (pour aria-label des boutons) |
| `goToSection`    | (index: number) => void | requis | Callback pour naviguer vers la section à l’index donné |

## Utilisation

À utiliser avec un contexte ou state qui fournit la section courante et une fonction de déplacement (ex. snap-scroll) :

```tsx
const { currentSection, sections, goToSection } = useSnapScrollContext();

<ProgressBar
  currentSection={currentSection}
  totalSections={sections.length}
  sectionLabels={sections.map((s) => s.label)}
  goToSection={goToSection}
/>
```

`goToSection(i)` doit faire défiler la page vers la section d’index `i` (ex. via le hook ou contexte de snap-scroll).

## Accessibilité

- `<nav aria-label="Navigation des sections">`.
- Chaque bouton a un `aria-label` du type "Aller à la section [label]".
- Le point actif a `aria-current="true"`.
