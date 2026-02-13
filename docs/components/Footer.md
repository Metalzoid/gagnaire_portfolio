# Footer

Pied de page du site : liens sociaux (SocialLinks) et copyright. Sans props.

## Import

```tsx
import { Footer } from "@/components/footer";
```

## Utilisation

À placer en bas de la page ou du layout :

```tsx
<Section id="footer">
  <Footer />
</Section>
```

Ou dans un layout :

```tsx
<>
  <main>{children}</main>
  <Footer />
</>
```

## Contenu

- **SocialLinks** en taille `sm`.
- Ligne de copyright : "© [année] Gagnaire Florian. Tous droits réservés." (année dynamique avec `new Date().getFullYear()`).

Pour modifier le nom ou les liens, éditer le composant `Footer.tsx` ou le remplacer par une version qui accepte des props (titre, liens, etc.).
