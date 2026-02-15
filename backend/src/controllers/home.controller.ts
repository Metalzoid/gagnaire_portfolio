import type { Request, Response } from "express";

export function getHome(_req: Request, res: Response): void {
  res.json({ message: "API Backend opérationnelle 🚀" });
}
