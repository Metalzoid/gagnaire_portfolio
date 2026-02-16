import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/database.js";
import { authConfig } from "../config/auth.js";
import { AppError } from "../utils/AppError.js";
import { ErrorCode } from "../utils/errorCodes.js";
import type { LoginSchemaType } from "shared";
import type { Admin } from "@prisma/client";

const SALT_ROUNDS = 10;

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

export async function refreshAccessToken(refreshToken: string): Promise<AuthTokens> {
  const secret = process.env.JWT_SECRET ?? "dev-secret-change-in-production";

  let decoded: { sub: string; jti: string };
  try {
    decoded = jwt.verify(refreshToken, secret) as { sub: string; jti: string };
  } catch {
    throw new AppError(401, "Refresh token invalide ou expiré", ErrorCode.REFRESH_TOKEN_INVALID);
  }

  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { admin: true },
  });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    if (storedToken) {
      await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    }
    throw new AppError(401, "Refresh token invalide ou expiré", ErrorCode.REFRESH_TOKEN_EXPIRED);
  }

  return await createTokens(storedToken.admin);
}

export async function logout(refreshToken: string): Promise<void> {
  await prisma.refreshToken.deleteMany({
    where: { token: refreshToken },
  });
}

export async function getAdminById(id: string): Promise<Admin | null> {
  return prisma.admin.findUnique({
    where: { id },
  });
}

async function createTokens(admin: Admin): Promise<AuthTokens> {
  const secret = process.env.JWT_SECRET ?? "dev-secret-change-in-production";
  const refreshToken = crypto.randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const accessToken = jwt.sign(
    { sub: admin.id },
    secret,
    { expiresIn: authConfig.accessTokenExpiresIn }
  );

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
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
