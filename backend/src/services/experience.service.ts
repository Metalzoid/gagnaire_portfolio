import { prisma } from "../config/database.js";
import { AppError } from "../utils/AppError.js";
import { ErrorCode } from "../utils/errorCodes.js";
import type {
  CreateExperienceSchemaType,
  UpdateExperienceSchemaType,
} from "shared";

export async function getAllExperience() {
  return prisma.experience.findMany({
    include: { technologies: true },
    orderBy: { startDate: "desc" },
  });
}

export async function createExperience(data: CreateExperienceSchemaType) {
  const { technologyIds, ...rest } = data;
  return prisma.experience.create({
    data: {
      ...rest,
      technologies: {
        connect: (technologyIds ?? []).map((id) => ({ id })),
      },
    },
    include: { technologies: true },
  });
}

export async function updateExperience(
  id: string,
  data: UpdateExperienceSchemaType,
) {
  const experience = await prisma.experience.findUnique({ where: { id } });
  if (!experience) {
    throw new AppError(404, "Expérience non trouvée", ErrorCode.NOT_FOUND);
  }
  const { technologyIds, ...rest } = data;
  const updateData: Parameters<typeof prisma.experience.update>[0]["data"] = {
    ...rest,
  };
  if (technologyIds !== undefined) {
    updateData.technologies = {
      set: technologyIds.map((id) => ({ id })),
    };
  }
  return prisma.experience.update({
    where: { id },
    data: updateData,
    include: { technologies: true },
  });
}

export async function deleteExperience(id: string) {
  const experience = await prisma.experience.findUnique({ where: { id } });
  if (!experience) {
    throw new AppError(404, "Expérience non trouvée", ErrorCode.NOT_FOUND);
  }
  await prisma.experience.delete({ where: { id } });
}
