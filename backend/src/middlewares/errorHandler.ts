import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: { code: err.code ?? "ERROR", message: err.message },
    });
  }

  if (err instanceof Error) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: process.env.NODE_ENV === "production" ? "Une erreur est survenue" : err.message,
      },
    });
  }

  return res.status(500).json({
    success: false,
    error: { code: "INTERNAL_ERROR", message: "Une erreur inattendue est survenue" },
  });
}
