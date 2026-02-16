import { Router } from "express";
import * as experienceController from "../../controllers/experience.controller.js";

export function createExperienceRoutes(): Router {
  const router = Router();

  router.get("/experience", experienceController.getAll);

  return router;
}
