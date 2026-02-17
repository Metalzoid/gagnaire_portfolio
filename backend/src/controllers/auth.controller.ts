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
import { setRefreshCookie, clearRefreshCookie, REFRESH_COOKIE } from "../utils/cookies.js";

export async function login(req: Request, res: Response) {
  const credentials = req.body as Parameters<typeof loginService>[0];
  const tokens = await loginService(credentials);
  setRefreshCookie(res, tokens.refreshToken);
  return success(res, { accessToken: tokens.accessToken, expiresIn: tokens.expiresIn }, 200);
}

export async function refresh(req: Request, res: Response) {
  const refreshToken = req.cookies?.[REFRESH_COOKIE];
  if (!refreshToken) {
    clearRefreshCookie(res);
    throw new AppError(401, "Refresh token manquant", ErrorCode.REFRESH_TOKEN_INVALID);
  }
  const tokens = await refreshAccessToken(refreshToken);
  setRefreshCookie(res, tokens.refreshToken);
  return success(res, { accessToken: tokens.accessToken, expiresIn: tokens.expiresIn }, 200);
}

export async function logout(req: Request, res: Response) {
  const refreshToken = req.cookies?.[REFRESH_COOKIE];
  if (refreshToken) {
    await logoutService(refreshToken);
  }
  clearRefreshCookie(res);
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- exclure password de la réponse
  const { password, ...adminWithoutPassword } = admin;
  return success(res, adminWithoutPassword, 200);
}
