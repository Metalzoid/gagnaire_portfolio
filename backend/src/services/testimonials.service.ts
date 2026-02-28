import path from "path";
import fs from "fs/promises";
import { prisma } from "../config/database.js";
import { AppError } from "../utils/AppError.js";
import { ErrorCode } from "../utils/errorCodes.js";
import type {
  CreateTestimonialSchemaType,
  UpdateTestimonialSchemaType,
} from "shared";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

function isUploadedPhoto(p: string): boolean {
  return p?.startsWith("/uploads/testimonial-photo/") ?? false;
}

async function deletePhotoFileIfUploaded(photo: string): Promise<void> {
  if (!isUploadedPhoto(photo)) return;
  const relPath = photo.replace(/^\//, "");
  const filePath = path.join(UPLOAD_DIR, relPath);
  await fs.unlink(filePath).catch(() => {});
}

export async function getAllTestimonials() {
  return prisma.testimonial.findMany({
    orderBy: { order: "asc" },
  });
}

export async function createTestimonial(data: CreateTestimonialSchemaType) {
  return prisma.testimonial.create({ data: { ...data, photo: data.photo ?? "" } });
}

export async function updateTestimonial(
  id: string,
  data: UpdateTestimonialSchemaType,
) {
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) {
    throw new AppError(404, "Témoignage non trouvé", ErrorCode.NOT_FOUND);
  }
  if (data.photo !== undefined && data.photo !== testimonial.photo) {
    await deletePhotoFileIfUploaded(testimonial.photo);
  }
  return prisma.testimonial.update({ where: { id }, data });
}

export async function deleteTestimonial(id: string) {
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) {
    throw new AppError(404, "Témoignage non trouvé", ErrorCode.NOT_FOUND);
  }
  await deletePhotoFileIfUploaded(testimonial.photo);
  await prisma.testimonial.delete({ where: { id } });
}
