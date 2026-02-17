import path from "path";
import fs from "fs/promises";
import { prisma } from "../config/database.js";
import { AppError } from "../utils/AppError.js";
import { ErrorCode } from "../utils/errorCodes.js";
import type { UpdateProfileSchemaType } from "shared";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const DEFAULT_PHOTO = "/images/profile/photo.svg";

export async function getProfile() {
  const profile = await prisma.profile.findFirst({
    orderBy: { createdAt: "asc" },
  });

  if (!profile) {
    throw new AppError(404, "Profil non trouvé", ErrorCode.NOT_FOUND);
  }

  return profile;
}

async function deleteProfilePhotoFileIfNeeded(
  oldPhoto: string,
  newPhoto: string,
): Promise<void> {
  if (newPhoto !== DEFAULT_PHOTO) return;
  if (!oldPhoto.startsWith("/uploads/profile-photo/")) return;

  const filename = path.basename(oldPhoto);
  const filePath = path.join(UPLOAD_DIR, "profile-photo", filename);
  await fs.unlink(filePath).catch(() => {});
}

export async function updateProfile(data: UpdateProfileSchemaType) {
  const profile = await prisma.profile.findFirst({
    orderBy: { createdAt: "asc" },
  });
  if (!profile) {
    throw new AppError(404, "Profil non trouvé", ErrorCode.NOT_FOUND);
  }

  if (data.photo !== undefined) {
    await deleteProfilePhotoFileIfNeeded(profile.photo, data.photo);
  }

  return prisma.profile.update({ where: { id: profile.id }, data });
}
