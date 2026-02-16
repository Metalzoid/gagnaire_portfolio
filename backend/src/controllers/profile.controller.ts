import type { Request, Response } from "express";
import * as profileService from "../services/profile.service.js";
import { success } from "../utils/apiResponse.js";

export async function getProfile(req: Request, res: Response) {
  const profile = await profileService.getProfile();
  return success(res, profile);
}

export async function updateProfile(req: Request, res: Response) {
  const profile = await profileService.updateProfile(req.body);
  return success(res, profile);
}
