import { Router } from "express";
import * as profileController from "../../controllers/profile.controller.js";

export function createProfileRoutes(): Router {
  const router = Router();

  router.get("/profile", profileController.getProfile);

  return router;
}
