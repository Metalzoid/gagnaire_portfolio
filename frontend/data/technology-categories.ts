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
