// --------------------------------------------------------------------------
// Technology
// --------------------------------------------------------------------------

/** Catégories possibles pour une technologie (source unique de vérité). */
export const TECHNOLOGY_CATEGORIES = [
  "Frontend",
  "Backend",
  "Fullstack",
  "DevOps",
  "Base de données",
  "Outils",
  "Mobile",
  "Autre",
] as const;

export type TechnologyCategory = (typeof TECHNOLOGY_CATEGORIES)[number];

export interface Technology {
  id: string;
  name: string;
  icon?: string | null;
  category?: string | null;
  order?: number;
}
