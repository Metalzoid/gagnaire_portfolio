// ==========================================================================
// Config About - Pitch & Values (données statiques, pas issues de l'API)
// ==========================================================================
import type { PitchBlock, AboutValue } from "shared";

export const pitchBlocks: PitchBlock[] = [
  { key: "who", icon: "FaUser", title: "Qui suis-je" },
  { key: "what", icon: "FaCode", title: "Ce que je fais" },
  { key: "why", icon: "FaHeart", title: "Pourquoi" },
  { key: "method", icon: "FaCogs", title: "Ma méthode" },
];

export const aboutValues: AboutValue[] = [
  {
    icon: "FaCode",
    title: "Clean code",
    description: "Code lisible, maintenable et bien structuré.",
  },
  {
    icon: "FaUniversalAccess",
    title: "Accessibilité",
    description: "Des interfaces utilisables par tous.",
  },
  {
    icon: "FaBolt",
    title: "Performance",
    description: "Applications rapides et optimisées.",
  },
  {
    icon: "FaLightbulb",
    title: "Curiosité",
    description: "Veille continue et apprentissage permanent.",
  },
];
