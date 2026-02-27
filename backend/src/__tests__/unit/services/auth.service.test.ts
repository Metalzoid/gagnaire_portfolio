import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Doit être appelé avant l'import du service pour que le mock soit en place
vi.mock("../../../config/database.js");

import { login, refreshAccessToken, logout, getAdminById } from "../../../services/auth.service.js";
import { prisma } from "../../../config/database.js";
import { AppError } from "../../../utils/AppError.js";

const JWT_SECRET = process.env.JWT_SECRET!;

// Typage des mocks
const mockAdmin = vi.mocked(prisma.admin);
const mockRefreshToken = vi.mocked(prisma.refreshToken);

// Données de test
const MOCK_CRED = "correct-login-cred";
const WRONG_CRED = "invalid-login-attempt";
let mockAdminRecord: {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

describe("auth.service", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    // rounds=1 pour des tests rapides
    mockAdminRecord = {
      id: "admin-cuid-123",
      email: "admin@portfolio.dev",
      password: await bcrypt.hash(MOCK_CRED, 1),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  // ─────────────────────────────────────
  // login()
  // ─────────────────────────────────────
  describe("login()", () => {
    it("retourne accessToken + refreshToken + expiresIn avec des identifiants valides", async () => {
      mockAdmin.findUnique.mockResolvedValue(mockAdminRecord as any);
      mockRefreshToken.create.mockResolvedValue({} as any);

      const result = await login({ email: mockAdminRecord.email, password: MOCK_CRED });

      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
      expect(result).toHaveProperty("expiresIn", "4h");
      expect(mockAdmin.findUnique).toHaveBeenCalledWith({
        where: { email: mockAdminRecord.email },
      });
      expect(mockRefreshToken.create).toHaveBeenCalledOnce();
    });

    it("throw AppError 401 BAD_CREDENTIALS si l'email n'existe pas", async () => {
      mockAdmin.findUnique.mockResolvedValue(null);

      await expect(
        login({ email: "inexistant@test.dev", password: MOCK_CRED }),
      ).rejects.toMatchObject({ statusCode: 401, code: "BAD_CREDENTIALS" });
    });

    it("throw AppError 401 BAD_CREDENTIALS si le mot de passe est incorrect", async () => {
      mockAdmin.findUnique.mockResolvedValue(mockAdminRecord as any);

      await expect(
        login({ email: mockAdminRecord.email, password: WRONG_CRED }),
      ).rejects.toMatchObject({ statusCode: 401, code: "BAD_CREDENTIALS" });
    });
  });

  // ─────────────────────────────────────
  // refreshAccessToken()
  // ─────────────────────────────────────
  describe("refreshAccessToken()", () => {
    it("effectue la rotation des tokens quand le refresh token est valide et en DB", async () => {
      const jti = "stored-jti-abc";
      const refreshJwt = jwt.sign({ sub: mockAdminRecord.id, jti }, JWT_SECRET, {
        expiresIn: "7d",
      });

      const storedToken = {
        id: "rt-id-1",
        token: jti,
        adminId: mockAdminRecord.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000), // dans le futur
        createdAt: new Date(),
        admin: mockAdminRecord,
      };

      mockRefreshToken.findUnique.mockResolvedValue(storedToken as any);
      mockRefreshToken.delete.mockResolvedValue({} as any);
      mockRefreshToken.create.mockResolvedValue({} as any);

      const result = await refreshAccessToken(refreshJwt);

      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
      // L'ancien token doit être supprimé (rotation)
      expect(mockRefreshToken.delete).toHaveBeenCalledWith({ where: { id: "rt-id-1" } });
      // Un nouveau token doit être créé
      expect(mockRefreshToken.create).toHaveBeenCalledOnce();
    });

    it("throw AppError 401 REFRESH_TOKEN_INVALID si le JWT est invalide", async () => {
      await expect(
        refreshAccessToken("jwt.completement.invalide"),
      ).rejects.toMatchObject({ statusCode: 401, code: "REFRESH_TOKEN_INVALID" });
    });

    it("throw AppError 401 REFRESH_TOKEN_EXPIRED si le token n'est pas en DB", async () => {
      const refreshJwt = jwt.sign(
        { sub: mockAdminRecord.id, jti: "jti-inconnu" },
        JWT_SECRET,
        { expiresIn: "7d" },
      );
      mockRefreshToken.findUnique.mockResolvedValue(null);

      await expect(refreshAccessToken(refreshJwt)).rejects.toMatchObject({
        statusCode: 401,
        code: "REFRESH_TOKEN_EXPIRED",
      });
    });

    it("throw AppError 401 REFRESH_TOKEN_EXPIRED et supprime le token expiré en DB", async () => {
      const jti = "jti-expire";
      const refreshJwt = jwt.sign({ sub: mockAdminRecord.id, jti }, JWT_SECRET, {
        expiresIn: "7d",
      });

      const expiredToken = {
        id: "rt-expire-id",
        token: jti,
        adminId: mockAdminRecord.id,
        expiresAt: new Date(Date.now() - 1000), // dans le passé
        createdAt: new Date(),
        admin: mockAdminRecord,
      };

      mockRefreshToken.findUnique.mockResolvedValue(expiredToken as any);
      mockRefreshToken.delete.mockResolvedValue({} as any);

      await expect(refreshAccessToken(refreshJwt)).rejects.toMatchObject({
        statusCode: 401,
        code: "REFRESH_TOKEN_EXPIRED",
      });

      // Le token expiré doit être nettoyé de la DB
      expect(mockRefreshToken.delete).toHaveBeenCalledWith({
        where: { id: "rt-expire-id" },
      });
    });
  });

  // ─────────────────────────────────────
  // logout()
  // ─────────────────────────────────────
  describe("logout()", () => {
    it("supprime le token de la DB avec un JWT valide", async () => {
      const jti = "logout-jti-xyz";
      const refreshJwt = jwt.sign({ sub: mockAdminRecord.id, jti }, JWT_SECRET, {
        expiresIn: "7d",
      });
      mockRefreshToken.deleteMany.mockResolvedValue({ count: 1 });

      await logout(refreshJwt);

      expect(mockRefreshToken.deleteMany).toHaveBeenCalledWith({
        where: { token: jti },
      });
    });

    it("ne lève pas d'erreur avec un JWT invalide (silencieux)", async () => {
      await expect(logout("token-completement-invalide")).resolves.toBeUndefined();
    });
  });

  // ─────────────────────────────────────
  // getAdminById()
  // ─────────────────────────────────────
  describe("getAdminById()", () => {
    it("retourne l'admin quand il existe", async () => {
      mockAdmin.findUnique.mockResolvedValue(mockAdminRecord as any);

      const result = await getAdminById(mockAdminRecord.id);
      expect(result).toEqual(mockAdminRecord);
    });

    it("retourne null quand l'admin n'existe pas", async () => {
      mockAdmin.findUnique.mockResolvedValue(null);

      const result = await getAdminById("id-inexistant");
      expect(result).toBeNull();
    });
  });
});
