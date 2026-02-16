import { prisma } from "../config/database.js";
import { AppError } from "../utils/AppError.js";
import { ErrorCode } from "../utils/errorCodes.js";
import type { CreateExperienceSchemaType, UpdateExperienceSchemaType } from "shared";

export async function getAllExperience() {
  return prisma.experience.findMany({
    orderBy: { startDate: "desc" },
  });
}

export async function createExperience(data: CreateExperienceSchemaType) {
  return prisma.experience.create({
    data: {
      ...data,
      technologies: data.technologies ?? [],
    },
  });
}

export async function updateExperience(id: string, data: UpdateExperienceSchemaType) {
  const experience = await prisma.experience.findUnique({ where: { id } });
  if (!experience) {
    throw new AppError(404, "Expérience non trouvée", ErrorCode.NOT_FOUND);
  }
  return prisma.experience.update({ where: { id }, data });
}

export async function deleteExperience(id: string) {
  const experience = await prisma.experience.findUnique({ where: { id } });
  if (!experience) {
    throw new AppError(404, "Expérience non trouvée", ErrorCode.NOT_FOUND);
  }
  await prisma.experience.delete({ where: { id } });
}
