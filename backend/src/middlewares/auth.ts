import type { Request, Response, NextFunction } from "express";

/**
 * Middleware d'authentification JWT.
 * À implémenter en Phase 2.
 */
export function requireAuth(_req: Request, _res: Response, next: NextFunction) {
  next();
}
