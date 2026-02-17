import { Router } from "express";
import * as authController from "../../controllers/auth.controller.js";
import { requireAuth } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import { loginSchema } from "shared";

export function createAuthRoutes(): Router {
  const router = Router();

  router.post("/auth/login", validate(loginSchema), authController.login);
  router.post("/auth/refresh", authController.refresh);
  router.post("/auth/logout", authController.logout);
  router.get("/auth/me", requireAuth, authController.me);

  return router;
}
