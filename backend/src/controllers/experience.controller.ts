import type { Request, Response } from "express";
import * as experienceService from "../services/experience.service.js";
import { success, successList } from "../utils/apiResponse.js";

export async function getAll(req: Request, res: Response) {
  const experience = await experienceService.getAllExperience();
  return successList(res, experience, { total: experience.length });
}

export async function create(req: Request, res: Response) {
  const experience = await experienceService.createExperience(req.body);
  return success(res, experience, 201);
}

export async function update(req: Request, res: Response) {
  const id = String(req.params.id);
  const experience = await experienceService.updateExperience(id, req.body);
  return success(res, experience);
}

export async function remove(req: Request, res: Response) {
  const id = String(req.params.id);
  await experienceService.deleteExperience(id);
  return success(res, { message: "Expérience supprimée" });
}
