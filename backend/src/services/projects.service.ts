import { prisma } from "../config/database.js";
import { AppError } from "../utils/AppError.js";
import { ErrorCode } from "../utils/errorCodes.js";
import type { CreateProjectSchemaType, UpdateProjectSchemaType } from "shared";

const projectInclude = {
  technologies: true,
  images: { orderBy: { order: "asc" as const } },
};

export async function getAllProjects() {
  return prisma.project.findMany({
    include: projectInclude,
    orderBy: [{ order: "asc" }, { date: "desc" }],
  });
}

export async function getFeaturedProjects() {
  return prisma.project.findMany({
    where: { featured: true },
    include: projectInclude,
    orderBy: [{ order: "asc" }, { date: "desc" }],
  });
}

export async function getProjectBySlug(slug: string) {
  const project = await prisma.project.findUnique({
    where: { slug },
    include: projectInclude,
  });

  if (!project) {
    throw new AppError(404, "Projet non trouvé", ErrorCode.NOT_FOUND);
  }

  return project;
}

export async function createProject(data: CreateProjectSchemaType) {
  const existing = await prisma.project.findUnique({
    where: { slug: data.slug },
  });
  if (existing) {
    throw new AppError(
      409,
      "Un projet avec ce slug existe déjà",
      ErrorCode.CONFLICT,
    );
  }
  const { technologyIds, ...rest } = data;
  return prisma.project.create({
    data: {
      ...rest,
      order: 0,
      technologies: {
        connect: (technologyIds ?? []).map((id: string) => ({ id })),
      },
    },
    include: projectInclude,
  });
}

export async function updateProject(id: string, data: UpdateProjectSchemaType) {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    throw new AppError(404, "Projet non trouvé", ErrorCode.NOT_FOUND);
  }
  if (data.slug && data.slug !== project.slug) {
    const existing = await prisma.project.findUnique({
      where: { slug: data.slug },
    });
    if (existing) {
      throw new AppError(
        409,
        "Un projet avec ce slug existe déjà",
        ErrorCode.CONFLICT,
      );
    }
  }
  const { technologyIds, ...rest } = data;
  const updateData: Parameters<typeof prisma.project.update>[0]["data"] = {
    ...rest,
  };
  if (technologyIds !== undefined) {
    updateData.technologies = {
      set: technologyIds.map((id: string) => ({ id })),
    };
  }
  return prisma.project.update({
    where: { id },
    data: updateData,
    include: projectInclude,
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
    include: projectInclude,
  });
}
