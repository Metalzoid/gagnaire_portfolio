import type { Request, Response } from "express";
import * as projectsService from "../services/projects.service.js";
import { success, successList } from "../utils/apiResponse.js";

export async function getAll(req: Request, res: Response) {
  const projects = await projectsService.getAllProjects();
  return successList(res, projects, { total: projects.length });
}

export async function getFeatured(req: Request, res: Response) {
  const projects = await projectsService.getFeaturedProjects();
  return successList(res, projects, { total: projects.length });
}

export async function getBySlug(req: Request, res: Response) {
  const slug = String(req.params.slug);
  const project = await projectsService.getProjectBySlug(slug);
  return success(res, project);
}

export async function create(req: Request, res: Response) {
  const project = await projectsService.createProject(req.body);
  return success(res, project, 201);
}

export async function update(req: Request, res: Response) {
  const id = String(req.params.id);
  const project = await projectsService.updateProject(id, req.body);
  return success(res, project);
}

export async function remove(req: Request, res: Response) {
  const id = String(req.params.id);
  await projectsService.deleteProject(id);
  return success(res, { message: "Projet supprimé" });
}

export async function updateOrder(req: Request, res: Response) {
  const id = String(req.params.id);
  const { order } = req.body;
  const project = await projectsService.updateProjectOrder(id, order);
  return success(res, project);
}
