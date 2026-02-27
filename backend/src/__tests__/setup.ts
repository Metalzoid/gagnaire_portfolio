import { afterAll } from "vitest";

// Les variables d'environnement de test sont définies dans vitest.config.ts (env option).
// Ce fichier gère uniquement le cycle de vie de la connexion Prisma.

afterAll(async () => {
  try {
    // Déconnexion propre de Prisma après tous les tests
    // (no-op pour les tests unitaires qui mockent le module database)
    const mod = await import("../config/database.js");
    await mod.prisma.$disconnect();
  } catch {
    // Ignoré : le module peut être mocké dans les tests unitaires
  }
});
