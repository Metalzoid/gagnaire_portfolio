import { Router } from "express";
import * as technologiesController from "../../controllers/technologies.controller.js";

export function createTechnologiesRoutes(): Router {
  const router = Router();

  router.get("/technologies", technologiesController.getAll);
  router.get("/technologies/search", technologiesController.search);

  return router;
}
