import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/database.js";
import { authConfig } from "../config/auth.js";
import { AppError } from "../utils/AppError.js";
import { ErrorCode } from "../utils/errorCodes.js";
import type { LoginSchemaType } from "shared";
import type { Admin } from "@prisma/client";

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
};

export async function login(credentials: LoginSchemaType): Promise<AuthTokens> {
  const admin = await prisma.admin.findUnique({
    where: { email: credentials.email },
  });

  if (!admin) {
    throw new AppError(401, "Identifiants invalides", ErrorCode.BAD_CREDENTIALS);
  }

  const isValid = await bcrypt.compare(credentials.password, admin.password);
  if (!isValid) {
    throw new AppError(401, "Identifiants invalides", ErrorCode.BAD_CREDENTIALS);
  }

  return await createTokens(admin);
}

export async function refreshAccessToken(refreshTokenJwt: string): Promise<AuthTokens> {
  const secret = process.env.JWT_SECRET ?? "dev-secret-change-in-production";

  let payload: { sub: string; jti: string; exp?: number };
  try {
    payload = jwt.verify(refreshTokenJwt, secret) as { sub: string; jti: string; exp?: number };
  } catch {
    throw new AppError(401, "Refresh token invalide ou expiré", ErrorCode.REFRESH_TOKEN_INVALID);
  }

  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: payload.jti },
    include: { admin: true },
  });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    if (storedToken) {
      await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    }
    throw new AppError(401, "Refresh token invalide ou expiré", ErrorCode.REFRESH_TOKEN_EXPIRED);
  }

  // Rotation : invalider l’ancien token avant d’émettre les nouveaux
  await prisma.refreshToken.delete({ where: { id: storedToken.id } });
  return await createTokens(storedToken.admin);
}

export async function logout(refreshTokenJwt: string): Promise<void> {
  try {
    const payload = jwt.decode(refreshTokenJwt) as { jti?: string } | null;
    if (payload?.jti) {
      await prisma.refreshToken.deleteMany({
        where: { token: payload.jti },
      });
    }
  } catch {
    // Token invalide ou expiré — rien à révoquer
  }
}

export async function getAdminById(id: string): Promise<Admin | null> {
  return prisma.admin.findUnique({
    where: { id },
  });
}

async function createTokens(admin: Admin): Promise<AuthTokens> {
  const secret = process.env.JWT_SECRET ?? "dev-secret-change-in-production";
  const jti = crypto.randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const accessToken = jwt.sign(
    { sub: admin.id },
    secret,
    { expiresIn: authConfig.accessTokenExpiresIn }
  );

  const refreshToken = jwt.sign(
    { sub: admin.id, jti },
    secret,
    { expiresIn: authConfig.refreshTokenExpiresIn }
  );

  await prisma.refreshToken.create({
    data: {
      token: jti,
      adminId: admin.id,
      expiresAt,
    },
  });

  return {
    accessToken,
    refreshToken,
    expiresIn: authConfig.accessTokenExpiresIn,
  };
}
