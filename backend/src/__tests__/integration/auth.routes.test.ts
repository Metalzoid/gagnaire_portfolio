import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../app.js";
import { prisma } from "../../config/database.js";
import { createTestAdmin, cleanDatabase, TEST_ADMIN } from "../helpers/auth.helper.js";

const API = "/api/v1";
const JWT_SECRET = process.env.JWT_SECRET!;
const WRONG_CRED = "invalid-login-attempt";

describe("Auth Routes (Intégration)", () => {
  let adminId: string;

  beforeAll(async () => {
    await cleanDatabase();
    const admin = await createTestAdmin();
    adminId = admin.id;
  });

  afterAll(async () => {
    await cleanDatabase();
  });

  beforeEach(async () => {
    // Nettoyer uniquement les refresh tokens entre les tests
    await prisma.refreshToken.deleteMany();
  });

  // ─────────────────────────────────────────────────────
  // POST /api/v1/auth/login
  // ─────────────────────────────────────────────────────
  describe("POST /auth/login", () => {
    it("200 — retourne accessToken + expiresIn et set le cookie refresh_token", async () => {
      const res = await request(app)
        .post(`${API}/auth/login`)
        .send({ email: TEST_ADMIN.email, password: TEST_ADMIN.plaintext });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("accessToken");
      expect(res.body.data).toHaveProperty("expiresIn", "4h");

      const cookies: string[] = res.headers["set-cookie"] ?? [];
      const refreshCookie = cookies.find((c) => c.startsWith("refresh_token="));
      expect(refreshCookie).toBeDefined();
      expect(refreshCookie).toContain("HttpOnly");

      // Le token est bien enregistré en DB
      const storedTokens = await prisma.refreshToken.findMany({
        where: { adminId },
      });
      expect(storedTokens).toHaveLength(1);
    });

    it("401 BAD_CREDENTIALS — mauvais email", async () => {
      const res = await request(app)
        .post(`${API}/auth/login`)
        .send({ email: "inconnu@test.dev", password: TEST_ADMIN.plaintext });

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("BAD_CREDENTIALS");
    });

    it("401 BAD_CREDENTIALS — mauvais mot de passe", async () => {
      const res = await request(app)
        .post(`${API}/auth/login`)
        .send({ email: TEST_ADMIN.email, password: WRONG_CRED });

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("BAD_CREDENTIALS");
    });

    it("400 VALIDATION_ERROR — body vide", async () => {
      const res = await request(app).post(`${API}/auth/login`).send({});

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });
  });

  // ─────────────────────────────────────────────────────
  // POST /api/v1/auth/refresh
  // ─────────────────────────────────────────────────────
  describe("POST /auth/refresh", () => {
    it("200 — retourne de nouveaux tokens avec un cookie valide (rotation)", async () => {
      // Login pour obtenir un cookie
      const loginRes = await request(app)
        .post(`${API}/auth/login`)
        .send({ email: TEST_ADMIN.email, password: TEST_ADMIN.plaintext });

      const cookies: string[] = loginRes.headers["set-cookie"] ?? [];

      const refreshRes = await request(app)
        .post(`${API}/auth/refresh`)
        .set("Cookie", cookies);

      expect(refreshRes.status).toBe(200);
      expect(refreshRes.body.data).toHaveProperty("accessToken");
      expect(refreshRes.body.data).toHaveProperty("expiresIn");

      // Rotation : toujours 1 token en DB (l'ancien supprimé, le nouveau créé)
      const storedTokens = await prisma.refreshToken.findMany({
        where: { adminId },
      });
      expect(storedTokens).toHaveLength(1);
    });

    it("401 REFRESH_TOKEN_INVALID — sans cookie", async () => {
      const res = await request(app).post(`${API}/auth/refresh`);

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("REFRESH_TOKEN_INVALID");
    });

    it("401 — cookie avec JWT invalide", async () => {
      const res = await request(app)
        .post(`${API}/auth/refresh`)
        .set("Cookie", "refresh_token=ceci.nest.pas.un.jwt");

      expect(res.status).toBe(401);
    });

    it("401 — JWT valide mais absent de la DB (déjà utilisé)", async () => {
      const fakeRefreshJwt = jwt.sign(
        { sub: adminId, jti: "jti-pas-en-db" },
        JWT_SECRET,
        { expiresIn: "7d" },
      );

      const res = await request(app)
        .post(`${API}/auth/refresh`)
        .set("Cookie", `refresh_token=${fakeRefreshJwt}`);

      expect(res.status).toBe(401);
    });
  });

  // ─────────────────────────────────────────────────────
  // POST /api/v1/auth/logout
  // ─────────────────────────────────────────────────────
  describe("POST /auth/logout", () => {
    it("200 — supprime le refresh token de la DB et vide le cookie", async () => {
      // Login pour obtenir un cookie
      const loginRes = await request(app)
        .post(`${API}/auth/login`)
        .send({ email: TEST_ADMIN.email, password: TEST_ADMIN.plaintext });

      const cookies: string[] = loginRes.headers["set-cookie"] ?? [];

      const logoutRes = await request(app)
        .post(`${API}/auth/logout`)
        .set("Cookie", cookies);

      expect(logoutRes.status).toBe(200);
      expect(logoutRes.body.success).toBe(true);

      // Token supprimé de la DB
      const storedTokens = await prisma.refreshToken.findMany({
        where: { adminId },
      });
      expect(storedTokens).toHaveLength(0);
    });

    it("200 — sans cookie (idempotent, pas d'erreur)", async () => {
      const res = await request(app).post(`${API}/auth/logout`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // ─────────────────────────────────────────────────────
  // GET /api/v1/auth/me
  // ─────────────────────────────────────────────────────
  describe("GET /auth/me", () => {
    it("200 — retourne l'admin sans le mot de passe avec un token valide", async () => {
      // Login pour obtenir un accessToken
      const loginRes = await request(app)
        .post(`${API}/auth/login`)
        .send({ email: TEST_ADMIN.email, password: TEST_ADMIN.plaintext });

      const { accessToken } = loginRes.body.data;

      const meRes = await request(app)
        .get(`${API}/auth/me`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(meRes.status).toBe(200);
      expect(meRes.body.success).toBe(true);
      expect(meRes.body.data.email).toBe(TEST_ADMIN.email);
      expect(meRes.body.data.id).toBe(adminId);
      // Le mot de passe ne doit PAS être exposé
      expect(meRes.body.data).not.toHaveProperty("password");
    });

    it("401 UNAUTHORIZED — sans token", async () => {
      const res = await request(app).get(`${API}/auth/me`);

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("UNAUTHORIZED");
    });

    it("401 UNAUTHORIZED — token expiré", async () => {
      const expiredToken = jwt.sign({ sub: adminId }, JWT_SECRET, {
        expiresIn: "-1s",
      });

      const res = await request(app)
        .get(`${API}/auth/me`)
        .set("Authorization", `Bearer ${expiredToken}`);

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("UNAUTHORIZED");
    });

    it("401 UNAUTHORIZED — token signé avec un mauvais secret", async () => {
      const badToken = jwt.sign({ sub: adminId }, "mauvais-secret", {
        expiresIn: "4h",
      });

      const res = await request(app)
        .get(`${API}/auth/me`)
        .set("Authorization", `Bearer ${badToken}`);

      expect(res.status).toBe(401);
    });

    it("404 NOT_FOUND — token valide mais admin inexistant en DB", async () => {
      const ghostToken = jwt.sign({ sub: "admin-id-fantome" }, JWT_SECRET, {
        expiresIn: "4h",
      });

      const res = await request(app)
        .get(`${API}/auth/me`)
        .set("Authorization", `Bearer ${ghostToken}`);

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe("NOT_FOUND");
    });
  });
});
