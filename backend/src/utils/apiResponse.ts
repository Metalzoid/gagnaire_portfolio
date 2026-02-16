import type { Response } from "express";

export function success<T>(res: Response, data: T, statusCode = 200) {
  return res.status(statusCode).json({ success: true, data });
}

export function successList<T>(
  res: Response,
  data: T[],
  meta: { total: number },
  statusCode = 200
) {
  return res.status(statusCode).json({ success: true, data, meta });
}

export function error(
  res: Response,
  message: string,
  statusCode = 500,
  code?: string
) {
  return res.status(statusCode).json({
    success: false,
    error: { code: code ?? "INTERNAL_ERROR", message },
  });
}
