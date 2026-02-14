import type { Request, Response, NextFunction } from "express";
import type { z } from "zod";
import { AppError } from "../utils/AppError.js";

export function validate<T extends z.ZodType>(schema: T) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      const msg = parsed.error.errors.map((e) => e.message).join(", ");
      return next(new AppError(400, msg, "VALIDATION_ERROR"));
    }
    req.body = parsed.data;
    next();
  };
}
