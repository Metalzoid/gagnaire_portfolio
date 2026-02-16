import type { Request, Response } from "express";
import {
  login as loginService,
  refreshAccessToken,
  logout as logoutService,
  getAdminById,
} from "../services/auth.service.js";
import { success } from "../utils/apiResponse.js";
import { AppError } from "../utils/AppError.js";
import { ErrorCode } from "../utils/errorCodes.js";

export async function login(req: Request, res: Response) {
  const credentials = req.body as Parameters<typeof loginService>[0];
  const tokens = await loginService(credentials);
  return success(res, tokens, 200);
}

export async function refresh(req: Request, res: Response) {
  const { refreshToken } = req.body as { refreshToken: string };
  const tokens = await refreshAccessToken(refreshToken);
  return success(res, tokens, 200);
}

export async function logout(req: Request, res: Response) {
  const { refreshToken } = req.body as { refreshToken: string };
  await logoutService(refreshToken);
  return success(res, { message: "Déconnexion réussie" }, 200);
}

export async function me(req: Request, res: Response) {
  const adminId = (req as Request & { adminId?: string }).adminId;
  if (!adminId) {
    throw new AppError(401, "Token invalide", ErrorCode.UNAUTHORIZED);
  }

  const admin = await getAdminById(adminId);
  if (!admin) {
    throw new AppError(404, "Admin non trouvé", ErrorCode.NOT_FOUND);
  }

  const { password: _password, ...adminWithoutPassword } = admin;
  return success(res, adminWithoutPassword, 200);
}
