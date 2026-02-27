import { describe, it, expect, vi } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { validate } from "../../../middlewares/validate.js";
import { AppError } from "../../../utils/AppError.js";

// Schéma simple pour les tests (indépendant de shared)
const testSchema = z.object({
  username: z.string().min(1),
  age: z.number().int().positive(),
});

function makeReq(body: unknown): Request {
  return { body } as Request;
}

describe("validate middleware", () => {
  it("appelle next() sans erreur et met à jour req.body quand le body est valide", () => {
    const req = makeReq({ username: "alice", age: 30 });
    const next = vi.fn();
    validate(testSchema)(req, {} as Response, next as NextFunction);

    expect(next).toHaveBeenCalledWith();
    expect(req.body).toEqual({ username: "alice", age: 30 });
  });

  it("appelle next(AppError 400 VALIDATION_ERROR) quand un champ est manquant", () => {
    const req = makeReq({ username: "alice" }); // age manquant
    const next = vi.fn();
    validate(testSchema)(req, {} as Response, next as NextFunction);

    expect(next).toHaveBeenCalledOnce();
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe("VALIDATION_ERROR");
  });

  it("appelle next(AppError 400) quand un champ a le mauvais type", () => {
    const req = makeReq({ username: "alice", age: "trente" }); // age doit être un nombre
    const next = vi.fn();
    validate(testSchema)(req, {} as Response, next as NextFunction);

    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe("VALIDATION_ERROR");
  });

  it("appelle next(AppError 400) quand le body est vide", () => {
    const req = makeReq({});
    const next = vi.fn();
    validate(testSchema)(req, {} as Response, next as NextFunction);

    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
  });
});
