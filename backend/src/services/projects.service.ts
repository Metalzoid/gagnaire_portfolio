import { prisma } from "../config/database.js";
import { AppError } from "../utils/AppError.js";
import { ErrorCode } from "../utils/errorCodes.js";
import type { CreateProjectSchemaType, UpdateProjectSchemaType } from "shared";

export async function getAllProjects() {
  return prisma.project.findMany({
    orderBy: [{ order: "asc" }, { date: "desc" }],
  });
}

export async function getFeaturedProjects() {
  return prisma.project.findMany({
    where: { featured: true },
    orderBy: [{ order: "asc" }, { date: "desc" }],
  });
}

export async function getProjectBySlug(slug: string) {
  const project = await prisma.project.findUnique({
    where: { slug },
  });

  if (!project) {
    throw new AppError(404, "Projet non trouvé", ErrorCode.NOT_FOUND);
  }

  return project;
}

export async function createProject(data: CreateProjectSchemaType) {
  const existing = await prisma.project.findUnique({ where: { slug: data.slug } });
  if (existing) {
    throw new AppError(409, "Un projet avec ce slug existe déjà", ErrorCode.CONFLICT);
  }
  return prisma.project.create({
    data: {
      ...data,
      order: 0,
    },
  });
}

export async function updateProject(id: string, data: UpdateProjectSchemaType) {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    throw new AppError(404, "Projet non trouvé", ErrorCode.NOT_FOUND);
  }
  if (data.slug && data.slug !== project.slug) {
    const existing = await prisma.project.findUnique({ where: { slug: data.slug } });
    if (existing) {
      throw new AppError(409, "Un projet avec ce slug existe déjà", ErrorCode.CONFLICT);
    }
  }
  return prisma.project.update({
    where: { id },
    data,
  });
}

export async function deleteProject(id: string) {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    throw new AppError(404, "Projet non trouvé", ErrorCode.NOT_FOUND);
  }
  await prisma.project.delete({ where: { id } });
}

export async function updateProjectOrder(id: string, order: number) {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    throw new AppError(404, "Projet non trouvé", ErrorCode.NOT_FOUND);
  }
  return prisma.project.update({
    where: { id },
    data: { order },
  });
}
