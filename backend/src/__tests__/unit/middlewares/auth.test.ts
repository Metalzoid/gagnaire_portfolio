import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { requireAuth } from "../../../middlewares/auth.js";
import { AppError } from "../../../utils/AppError.js";

const JWT_SECRET = process.env.JWT_SECRET!;

function makeReq(overrides: Partial<Request> = {}): Request {
  return { headers: {}, ...overrides } as Request;
}

describe("requireAuth middleware", () => {
  let next: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    next = vi.fn();
  });

  it("retourne 401 UNAUTHORIZED quand il n'y a pas de header Authorization", () => {
    const req = makeReq();
    requireAuth(req, {} as Response, next as NextFunction);

    expect(next).toHaveBeenCalledOnce();
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(401);
    expect(err.code).toBe("UNAUTHORIZED");
  });

  it("retourne 401 UNAUTHORIZED quand le header ne commence pas par 'Bearer '", () => {
    const req = makeReq({ headers: { authorization: "Basic abc123" } } as Partial<Request>);
    requireAuth(req, {} as Response, next as NextFunction);

    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(401);
    expect(err.code).toBe("UNAUTHORIZED");
  });

  it("retourne 401 UNAUTHORIZED quand le token JWT est invalide", () => {
    const req = makeReq({ headers: { authorization: "Bearer token.invalide.ici" } } as Partial<Request>);
    requireAuth(req, {} as Response, next as NextFunction);

    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(401);
    expect(err.code).toBe("UNAUTHORIZED");
  });

  it("retourne 401 UNAUTHORIZED quand le token JWT est signé avec un mauvais secret", () => {
    const token = jwt.sign({ sub: "admin-id-1" }, "mauvais-secret", { expiresIn: "4h" });
    const req = makeReq({ headers: { authorization: `Bearer ${token}` } } as Partial<Request>);
    requireAuth(req, {} as Response, next as NextFunction);

    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(401);
  });

  it("appelle next() sans erreur et définit req.adminId avec un token valide", () => {
    const token = jwt.sign({ sub: "admin-id-123" }, JWT_SECRET, { expiresIn: "4h" });
    const req = makeReq({ headers: { authorization: `Bearer ${token}` } } as Partial<Request>);
    requireAuth(req, {} as Response, next as NextFunction);

    expect(next).toHaveBeenCalledWith(); // appelé sans arguments = succès
    expect(req.adminId).toBe("admin-id-123");
  });
});
