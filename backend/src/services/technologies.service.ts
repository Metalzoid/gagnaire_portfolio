import { prisma } from "../config/database.js";
import { AppError } from "../utils/AppError.js";
import { ErrorCode } from "../utils/errorCodes.js";
import type {
  CreateTechnologySchemaType,
  UpdateTechnologySchemaType,
} from "shared";

export async function getAllTechnologies() {
  return prisma.technology.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });
}

export async function searchTechnologies(query: string) {
  const trimmed = query.trim();
  if (!trimmed) {
    return getAllTechnologies();
  }
  return prisma.technology.findMany({
    where: {
      name: { contains: trimmed, mode: "insensitive" },
    },
    orderBy: [{ name: "asc" }],
  });
}

export async function getTechnologyById(id: string) {
  const tech = await prisma.technology.findUnique({
    where: { id },
  });

  if (!tech) {
    throw new AppError(404, "Technologie non trouvée", ErrorCode.NOT_FOUND);
  }

  return tech;
}

export async function createTechnology(data: CreateTechnologySchemaType) {
  const normalizedName = data.name.trim();
  const existing = await prisma.technology.findFirst({
    where: { name: { equals: normalizedName, mode: "insensitive" } },
  });
  if (existing) {
    throw new AppError(
      409,
      "Une technologie avec ce nom existe déjà",
      ErrorCode.CONFLICT,
    );
  }
  return prisma.technology.create({
    data: {
      name: normalizedName,
      icon: data.icon ?? null,
      category: data.category ?? null,
      order: data.order ?? 0,
    },
  });
}

export async function updateTechnology(
  id: string,
  data: UpdateTechnologySchemaType,
) {
  const tech = await prisma.technology.findUnique({ where: { id } });
  if (!tech) {
    throw new AppError(404, "Technologie non trouvée", ErrorCode.NOT_FOUND);
  }
  if (data.name) {
    const normalizedName = data.name.trim();
    const existing = await prisma.technology.findFirst({
      where: {
        name: { equals: normalizedName, mode: "insensitive" },
        NOT: { id },
      },
    });
    if (existing) {
      throw new AppError(
        409,
        "Une technologie avec ce nom existe déjà",
        ErrorCode.CONFLICT,
      );
    }
  }
  return prisma.technology.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name.trim() }),
      ...(data.icon !== undefined && { icon: data.icon }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.order !== undefined && { order: data.order }),
    },
  });
}

export async function deleteTechnology(id: string) {
  const tech = await prisma.technology.findUnique({ where: { id } });
  if (!tech) {
    throw new AppError(404, "Technologie non trouvée", ErrorCode.NOT_FOUND);
  }
  await prisma.technology.delete({ where: { id } });
}
