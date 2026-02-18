import { Router } from "express";
import * as projectsController from "../../controllers/projects.controller.js";
import * as skillsController from "../../controllers/skills.controller.js";
import * as experienceController from "../../controllers/experience.controller.js";
import * as testimonialsController from "../../controllers/testimonials.controller.js";
import * as profileController from "../../controllers/profile.controller.js";
import * as technologiesController from "../../controllers/technologies.controller.js";
import * as projectImagesController from "../../controllers/project-images.controller.js";
import * as contactsAdminController from "../../controllers/contacts-admin.controller.js";
import { upload, handleUpload } from "../../controllers/upload.controller.js";
import { requireAuth } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import {
  createProjectSchema,
  updateProjectSchema,
  updateProjectOrderSchema,
  reorderProjectImagesSchema,
  createTechnologySchema,
  updateTechnologySchema,
  createSkillSchema,
  createSkillCategorySchema,
  updateSkillSchema,
  updateSkillCategorySchema,
  createExperienceSchema,
  updateExperienceSchema,
  createTestimonialSchema,
  updateTestimonialSchema,
  updateProfileSchema,
  updateContactStatusSchema,
} from "shared";

export function createAdminRoutes(): Router {
  const router = Router();

  router.use(requireAuth);

  // Upload de fichiers (multipart/form-data)
  router.post("/admin/upload", upload.single("file"), handleUpload);

  router.post(
    "/admin/projects",
    validate(createProjectSchema),
    projectsController.create,
  );
  router.put(
    "/admin/projects/:id",
    validate(updateProjectSchema),
    projectsController.update,
  );
  router.delete("/admin/projects/:id", projectsController.remove);
  router.patch(
    "/admin/projects/:id/order",
    validate(updateProjectOrderSchema),
    projectsController.updateOrder,
  );

  // Images projet (order avant :imageId pour éviter que "order" soit capturé)
  router.post(
    "/admin/projects/:id/images",
    ...projectImagesController.uploadImage,
  );
  router.patch(
    "/admin/projects/:id/images/order",
    validate(reorderProjectImagesSchema),
    projectImagesController.reorderImages,
  );
  router.delete(
    "/admin/projects/:id/images/:imageId",
    projectImagesController.deleteImage,
  );

  router.post(
    "/admin/skills/categories",
    validate(createSkillCategorySchema),
    skillsController.createCategory,
  );
  router.put(
    "/admin/skills/categories/:id",
    validate(updateSkillCategorySchema),
    skillsController.updateCategory,
  );
  router.delete(
    "/admin/skills/categories/:id",
    skillsController.deleteCategory,
  );
  router.post(
    "/admin/skills",
    validate(createSkillSchema),
    skillsController.createSkill,
  );
  router.put(
    "/admin/skills/:id",
    validate(updateSkillSchema),
    skillsController.updateSkill,
  );
  router.delete("/admin/skills/:id", skillsController.deleteSkill);

  router.post(
    "/admin/experience",
    validate(createExperienceSchema),
    experienceController.create,
  );
  router.put(
    "/admin/experience/:id",
    validate(updateExperienceSchema),
    experienceController.update,
  );
  router.delete("/admin/experience/:id", experienceController.remove);

  router.post(
    "/admin/testimonials",
    validate(createTestimonialSchema),
    testimonialsController.create,
  );
  router.put(
    "/admin/testimonials/:id",
    validate(updateTestimonialSchema),
    testimonialsController.update,
  );
  router.delete("/admin/testimonials/:id", testimonialsController.remove);

  router.put(
    "/admin/profile",
    validate(updateProfileSchema),
    profileController.updateProfile,
  );

  router.get("/admin/contacts", contactsAdminController.list);
  router.patch(
    "/admin/contacts/:id",
    validate(updateContactStatusSchema),
    contactsAdminController.updateStatus,
  );

  router.post(
    "/admin/technologies",
    validate(createTechnologySchema),
    technologiesController.create,
  );
  router.put(
    "/admin/technologies/:id",
    validate(updateTechnologySchema),
    technologiesController.update,
  );
  router.delete("/admin/technologies/:id", technologiesController.remove);

  return router;
}
