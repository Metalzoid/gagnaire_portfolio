import path from "path";
import fs from "fs/promises";
import { prisma } from "../config/database.js";
import { AppError } from "../utils/AppError.js";
import { ErrorCode } from "../utils/errorCodes.js";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export async function addImage(projectId: string, filePath: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    throw new AppError(404, "Projet non trouvé", ErrorCode.NOT_FOUND);
  }

  const maxOrder = await prisma.projectImage.aggregate({
    where: { projectId },
    _max: { order: true },
  });
  const order = (maxOrder._max.order ?? -1) + 1;

  return prisma.projectImage.create({
    data: { projectId, path: filePath, order },
  });
}

export async function removeImage(projectId: string, imageId: string) {
  const image = await prisma.projectImage.findFirst({
    where: { id: imageId, projectId },
  });
  if (!image) {
    throw new AppError(404, "Image non trouvée", ErrorCode.NOT_FOUND);
  }

  // Supprimer le fichier du disque
  const fullPath = path.join(UPLOAD_DIR, image.path.replace(/^\//, ""));
  await fs.unlink(fullPath).catch(() => {});

  await prisma.projectImage.delete({ where: { id: imageId } });

  // Réordonner les images restantes (0, 1, 2...)
  const remaining = await prisma.projectImage.findMany({
    where: { projectId },
    orderBy: { order: "asc" },
  });
  for (let i = 0; i < remaining.length; i++) {
    await prisma.projectImage.update({
      where: { id: remaining[i].id },
      data: { order: i },
    });
  }
}

export async function reorderImages(projectId: string, orderedIds: string[]) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    throw new AppError(404, "Projet non trouvé", ErrorCode.NOT_FOUND);
  }

  const images = await prisma.projectImage.findMany({
    where: { projectId },
  });
  const idSet = new Set(images.map((img: { id: string }) => img.id));
  const validIds = orderedIds.filter((id) => idSet.has(id));
  if (validIds.length !== orderedIds.length) {
    throw new AppError(
      400,
      "Certains identifiants d'images sont invalides",
      ErrorCode.VALIDATION_ERROR,
    );
  }

  await Promise.all(
    validIds.map((id, index) =>
      prisma.projectImage.update({
        where: { id },
        data: { order: index },
      }),
    ),
  );

  return prisma.projectImage.findMany({
    where: { projectId },
    orderBy: { order: "asc" },
  });
}
