import { Router } from "express";
import * as skillsController from "../../controllers/skills.controller.js";

export function createSkillsRoutes(): Router {
  const router = Router();

  router.get("/skills", skillsController.getAll);

  return router;
}
