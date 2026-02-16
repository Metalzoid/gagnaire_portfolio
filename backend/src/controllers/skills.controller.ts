import type { Request, Response } from "express";
import * as skillsService from "../services/skills.service.js";
import { success, successList } from "../utils/apiResponse.js";

export async function getAll(req: Request, res: Response) {
  const categories = await skillsService.getSkillsWithCategories();
  const total = categories.reduce((sum, c) => sum + c.skills.length, 0);
  return successList(res, categories, { total });
}

export async function createCategory(req: Request, res: Response) {
  const category = await skillsService.createCategory(req.body);
  return success(res, category, 201);
}

export async function updateCategory(req: Request, res: Response) {
  const id = String(req.params.id);
  const category = await skillsService.updateCategory(id, req.body);
  return success(res, category);
}

export async function deleteCategory(req: Request, res: Response) {
  const id = String(req.params.id);
  await skillsService.deleteCategory(id);
  return success(res, { message: "Catégorie supprimée" });
}

export async function createSkill(req: Request, res: Response) {
  const skill = await skillsService.createSkill(req.body);
  return success(res, skill, 201);
}

export async function updateSkill(req: Request, res: Response) {
  const id = String(req.params.id);
  const skill = await skillsService.updateSkill(id, req.body);
  return success(res, skill);
}

export async function deleteSkill(req: Request, res: Response) {
  const id = String(req.params.id);
  await skillsService.deleteSkill(id);
  return success(res, { message: "Compétence supprimée" });
}
