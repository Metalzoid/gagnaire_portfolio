import { prisma } from "../config/database.js";
import { AppError } from "../utils/AppError.js";
import { ErrorCode } from "../utils/errorCodes.js";
import type {
  CreateSkillSchemaType,
  CreateSkillCategorySchemaType,
  UpdateSkillSchemaType,
  UpdateSkillCategorySchemaType,
} from "shared";

export async function getSkillsWithCategories() {
  return prisma.skillCategory.findMany({
    include: {
      skills: { orderBy: { order: "asc" } },
    },
    orderBy: { order: "asc" },
  });
}

export async function createCategory(data: CreateSkillCategorySchemaType) {
  const existing = await prisma.skillCategory.findUnique({ where: { name: data.name } });
  if (existing) {
    throw new AppError(409, "Une catégorie avec ce nom existe déjà", ErrorCode.CONFLICT);
  }
  return prisma.skillCategory.create({ data });
}

export async function updateCategory(id: string, data: UpdateSkillCategorySchemaType) {
  const category = await prisma.skillCategory.findUnique({ where: { id } });
  if (!category) {
    throw new AppError(404, "Catégorie non trouvée", ErrorCode.NOT_FOUND);
  }
  if (data.name && data.name !== category.name) {
    const existing = await prisma.skillCategory.findUnique({ where: { name: data.name } });
    if (existing) {
      throw new AppError(409, "Une catégorie avec ce nom existe déjà", ErrorCode.CONFLICT);
    }
  }
  return prisma.skillCategory.update({ where: { id }, data });
}

export async function deleteCategory(id: string) {
  const category = await prisma.skillCategory.findUnique({ where: { id } });
  if (!category) {
    throw new AppError(404, "Catégorie non trouvée", ErrorCode.NOT_FOUND);
  }
  await prisma.skillCategory.delete({ where: { id } });
}

export async function createSkill(data: CreateSkillSchemaType) {
  const category = await prisma.skillCategory.findUnique({ where: { id: data.categoryId } });
  if (!category) {
    throw new AppError(404, "Catégorie non trouvée", ErrorCode.NOT_FOUND);
  }
  return prisma.skill.create({ data });
}

export async function updateSkill(id: string, data: UpdateSkillSchemaType) {
  const skill = await prisma.skill.findUnique({ where: { id } });
  if (!skill) {
    throw new AppError(404, "Compétence non trouvée", ErrorCode.NOT_FOUND);
  }
  return prisma.skill.update({ where: { id }, data });
}

export async function deleteSkill(id: string) {
  const skill = await prisma.skill.findUnique({ where: { id } });
  if (!skill) {
    throw new AppError(404, "Compétence non trouvée", ErrorCode.NOT_FOUND);
  }
  await prisma.skill.delete({ where: { id } });
}
