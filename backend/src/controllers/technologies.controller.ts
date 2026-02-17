import type { Request, Response } from "express";
import * as technologiesService from "../services/technologies.service.js";
import { success, successList } from "../utils/apiResponse.js";

export async function getAll(req: Request, res: Response) {
  const technologies = await technologiesService.getAllTechnologies();
  return successList(res, technologies, { total: technologies.length });
}

export async function search(req: Request, res: Response) {
  const q = String(req.query.q ?? "");
  const technologies = await technologiesService.searchTechnologies(q);
  return successList(res, technologies, { total: technologies.length });
}

export async function create(req: Request, res: Response) {
  const technology = await technologiesService.createTechnology(req.body);
  return success(res, technology, 201);
}

export async function update(req: Request, res: Response) {
  const id = String(req.params.id);
  const technology = await technologiesService.updateTechnology(id, req.body);
  return success(res, technology);
}

export async function remove(req: Request, res: Response) {
  const id = String(req.params.id);
  await technologiesService.deleteTechnology(id);
  return success(res, { message: "Technologie supprimée" });
}
