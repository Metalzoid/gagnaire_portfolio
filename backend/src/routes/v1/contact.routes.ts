import { Router } from "express";
import * as contactController from "../../controllers/contact.controller.js";
import { validate } from "../../middlewares/validate.js";
import { createContactSchema } from "shared";

export function createContactRoutes(): Router {
  const router = Router();
  router.post(
    "/contact",
    validate(createContactSchema),
    contactController.submit,
  );
  return router;
}
