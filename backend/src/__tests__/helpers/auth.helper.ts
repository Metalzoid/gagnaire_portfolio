import bcrypt from "bcrypt";
import { prisma } from "../../config/database.js";

export const TEST_ADMIN = {
  email: "test-admin@portfolio.dev",
  plaintext: "test-admin-login-123",
};

/**
 * Crée un admin de test en base de données avec un mot de passe hashé.
 */
export async function createTestAdmin() {
  const hashedPassword = await bcrypt.hash(TEST_ADMIN.plaintext, 10);
  return prisma.admin.create({
    data: {
      email: TEST_ADMIN.email,
      password: hashedPassword,
    },
  });
}

/**
 * Supprime toutes les données de test (dans l'ordre des FK).
 */
export async function cleanDatabase() {
  await prisma.refreshToken.deleteMany();
  await prisma.admin.deleteMany();
}
