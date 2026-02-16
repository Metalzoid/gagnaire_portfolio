import type { Request, Response } from "express";
import * as testimonialsService from "../services/testimonials.service.js";
import { success, successList } from "../utils/apiResponse.js";

export async function getAll(req: Request, res: Response) {
  const testimonials = await testimonialsService.getAllTestimonials();
  return successList(res, testimonials, { total: testimonials.length });
}

export async function create(req: Request, res: Response) {
  const testimonial = await testimonialsService.createTestimonial(req.body);
  return success(res, testimonial, 201);
}

export async function update(req: Request, res: Response) {
  const id = String(req.params.id);
  const testimonial = await testimonialsService.updateTestimonial(id, req.body);
  return success(res, testimonial);
}

export async function remove(req: Request, res: Response) {
  const id = String(req.params.id);
  await testimonialsService.deleteTestimonial(id);
  return success(res, { message: "Témoignage supprimé" });
}
