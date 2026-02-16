import { prisma } from "../config/database.js";
import { AppError } from "../utils/AppError.js";
import { ErrorCode } from "../utils/errorCodes.js";
import type { UpdateProfileSchemaType } from "shared";

export async function getProfile() {
  const profile = await prisma.profile.findFirst({
    orderBy: { createdAt: "asc" },
  });

  if (!profile) {
    throw new AppError(404, "Profil non trouvé", ErrorCode.NOT_FOUND);
  }

  return profile;
}

export async function updateProfile(data: UpdateProfileSchemaType) {
  const profile = await prisma.profile.findFirst({ orderBy: { createdAt: "asc" } });
  if (!profile) {
    throw new AppError(404, "Profil non trouvé", ErrorCode.NOT_FOUND);
  }
  return prisma.profile.update({ where: { id: profile.id }, data });
}
