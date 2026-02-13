// ==========================================================================
// Sections de la Home - Source unique de vérité
// ==========================================================================

export interface SectionData {
  id: string;
  label: string;
  title: string;
  text: string;
}

export const homeSections: SectionData[] = [
  { id: "hero", label: "Accueil", title: "", text: "" },
  {
    id: "a-propos",
    label: "À propos",
    title: "À propos",
    text: "Découvrez mon parcours et ma philosophie.",
  },
  {
    id: "competences",
    label: "Compétences",
    title: "Compétences",
    text: "Mes compétences techniques et humaines.",
  },
  {
    id: "projets",
    label: "Projets",
    title: "Projets",
    text: "Une sélection de mes réalisations.",
  },
  {
    id: "temoignages",
    label: "Témoignages",
    title: "Témoignages",
    text: "Ce qu'ils disent de moi.",
  },
  {
    id: "contact",
    label: "Contact",
    title: "Contact",
    text: "Envie de collaborer ? Parlons-en.",
  },
];
