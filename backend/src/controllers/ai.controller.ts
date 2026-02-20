import type { Request, Response } from "express";
import * as aiService from "../services/ai.service.js";
import { success } from "../utils/apiResponse.js";

export async function getStatus(req: Request, res: Response) {
  return success(res, { enabled: aiService.isConfigured() });
}

export async function enhanceProfile(req: Request, res: Response) {
  const profile = await aiService.enhanceProfile();
  return success(res, profile);
}

export async function enhanceExperience(req: Request, res: Response) {
  const experience = await aiService.enhanceExperience(String(req.params.id));
  return success(res, experience);
}

export async function enhanceProject(req: Request, res: Response) {
  const project = await aiService.enhanceProject(String(req.params.id));
  return success(res, project);
}

export async function listPrompts(req: Request, res: Response) {
  const prompts = await aiService.listPrompts();
  return success(res, prompts);
}

export async function getPrompt(req: Request, res: Response) {
  const prompt = await aiService.getPrompt(String(req.params.target));
  return success(res, prompt);
}

export async function updatePrompt(req: Request, res: Response) {
  const prompt = await aiService.updatePrompt(String(req.params.target), req.body);
  return success(res, prompt);
}
