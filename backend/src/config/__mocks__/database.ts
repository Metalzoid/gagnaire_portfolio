import { vi } from "vitest";

/**
 * Mock automatique du module database pour les tests unitaires.
 * Utilisé via : vi.mock("../../config/database.js")
 */
export const prisma = {
  admin: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    deleteMany: vi.fn(),
  },
  refreshToken: {
    findUnique: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
  },
  $disconnect: vi.fn(),
};
