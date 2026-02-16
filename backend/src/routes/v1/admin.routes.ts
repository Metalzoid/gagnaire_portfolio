import { Router } from "express";
import * as projectsController from "../../controllers/projects.controller.js";
import * as skillsController from "../../controllers/skills.controller.js";
import * as experienceController from "../../controllers/experience.controller.js";
import * as testimonialsController from "../../controllers/testimonials.controller.js";
import * as profileController from "../../controllers/profile.controller.js";
import { requireAuth } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import {
  createProjectSchema,
  updateProjectSchema,
  updateProjectOrderSchema,
  createSkillSchema,
  createSkillCategorySchema,
  updateSkillSchema,
  updateSkillCategorySchema,
  createExperienceSchema,
  updateExperienceSchema,
  createTestimonialSchema,
  updateTestimonialSchema,
  updateProfileSchema,
} from "shared";

export function createAdminRoutes(): Router {
  const router = Router();

  router.use(requireAuth);

  router.post("/admin/projects", validate(createProjectSchema), projectsController.create);
  router.put("/admin/projects/:id", validate(updateProjectSchema), projectsController.update);
  router.delete("/admin/projects/:id", projectsController.remove);
  router.patch(
    "/admin/projects/:id/order",
    validate(updateProjectOrderSchema),
    projectsController.updateOrder
  );

  router.post(
    "/admin/skills/categories",
    validate(createSkillCategorySchema),
    skillsController.createCategory
  );
  router.put(
    "/admin/skills/categories/:id",
    validate(updateSkillCategorySchema),
    skillsController.updateCategory
  );
  router.delete("/admin/skills/categories/:id", skillsController.deleteCategory);
  router.post("/admin/skills", validate(createSkillSchema), skillsController.createSkill);
  router.put("/admin/skills/:id", validate(updateSkillSchema), skillsController.updateSkill);
  router.delete("/admin/skills/:id", skillsController.deleteSkill);

  router.post(
    "/admin/experience",
    validate(createExperienceSchema),
    experienceController.create
  );
  router.put(
    "/admin/experience/:id",
    validate(updateExperienceSchema),
    experienceController.update
  );
  router.delete("/admin/experience/:id", experienceController.remove);

  router.post(
    "/admin/testimonials",
    validate(createTestimonialSchema),
    testimonialsController.create
  );
  router.put(
    "/admin/testimonials/:id",
    validate(updateTestimonialSchema),
    testimonialsController.update
  );
  router.delete("/admin/testimonials/:id", testimonialsController.remove);

  router.put("/admin/profile", validate(updateProfileSchema), profileController.updateProfile);

  return router;
}
