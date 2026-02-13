// ==========================================================================
// Ordre des liens de la navbar - Éditable manuellement
// Indépendant de l'ordre des sections (homeSections)
// ==========================================================================

export type NavItemSection = {
  type: "section";
  id: string; // Référence une section de homeSections (hero, a-propos, etc.)
};

export type NavItemLink = {
  type: "link";
  href: string;
  label: string;
};

export type NavItem = NavItemSection | NavItemLink;

/**
 * Ordre des liens affichés dans la navbar.
 * Modifier cet tableau pour réorganiser les liens.
 * - type: "section" → utilise le label de la section (modal contact, ancres home)
 * - type: "link" → lien classique vers une page
 */
export const navigationLinks: NavItem[] = [
  { type: "section", id: "hero" },
  { type: "section", id: "a-propos" },
  { type: "section", id: "competences" },
  { type: "section", id: "projets" },
  { type: "section", id: "temoignages" },
  { type: "link", href: "/experience", label: "Parcours" },
  { type: "link", href: "/blog", label: "Blog" },
  { type: "section", id: "contact" },
];
