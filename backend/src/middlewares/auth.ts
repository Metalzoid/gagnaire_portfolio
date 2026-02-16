import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";
import { ErrorCode } from "../utils/errorCodes.js";

declare global {
  namespace Express {
    interface Request {
      adminId?: string;
    }
  }
}

/**
 * Middleware d'authentification JWT.
 * Vérifie le token Bearer et attache adminId à la requête.
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError(401, "Token d'authentification requis", ErrorCode.UNAUTHORIZED));
  }

  const token = authHeader.slice(7);
  const secret = process.env.JWT_SECRET ?? "dev-secret-change-in-production";

  try {
    const decoded = jwt.verify(token, secret) as { sub: string };
    req.adminId = decoded.sub;
    next();
  } catch {
    return next(new AppError(401, "Token invalide ou expiré", ErrorCode.UNAUTHORIZED));
  }
}
