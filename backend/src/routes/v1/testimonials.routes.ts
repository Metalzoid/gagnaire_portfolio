import { Router } from "express";
import * as testimonialsController from "../../controllers/testimonials.controller.js";

export function createTestimonialsRoutes(): Router {
  const router = Router();

  router.get("/testimonials", testimonialsController.getAll);

  return router;
}
