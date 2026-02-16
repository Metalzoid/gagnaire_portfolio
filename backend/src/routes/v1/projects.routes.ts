import { Router } from "express";
import * as projectsController from "../../controllers/projects.controller.js";

export function createProjectsRoutes(): Router {
  const router = Router();

  router.get("/projects", projectsController.getAll);
  router.get("/projects/featured", projectsController.getFeatured);
  router.get("/projects/:slug", projectsController.getBySlug);

  return router;
}
