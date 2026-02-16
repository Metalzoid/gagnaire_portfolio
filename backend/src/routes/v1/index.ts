import { Router } from "express";
import { createHealthRoutes } from "./health.routes.js";
import { createAuthRoutes } from "./auth.routes.js";
import { createProjectsRoutes } from "./projects.routes.js";
import { createSkillsRoutes } from "./skills.routes.js";
import { createExperienceRoutes } from "./experience.routes.js";
import { createTestimonialsRoutes } from "./testimonials.routes.js";
import { createProfileRoutes } from "./profile.routes.js";
import { createAdminRoutes } from "./admin.routes.js";

export function createV1Router(): Router {
  const router = Router();

  router.use(createHealthRoutes());
  router.use(createAuthRoutes());
  router.use(createProjectsRoutes());
  router.use(createSkillsRoutes());
  router.use(createExperienceRoutes());
  router.use(createTestimonialsRoutes());
  router.use(createProfileRoutes());
  router.use(createAdminRoutes());

  return router;
}
