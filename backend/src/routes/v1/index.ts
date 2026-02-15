import { Router } from "express";
import { createHealthRoutes } from "./health.routes.js";

export function createV1Router(): Router {
  const router = Router();

  const healthRoutes = createHealthRoutes();
  router.use(healthRoutes);

  return router;
}
