import { prisma } from "../config/database.js";
import { AppError } from "../utils/AppError.js";
import { ErrorCode } from "../utils/errorCodes.js";
import type { CreateTestimonialSchemaType, UpdateTestimonialSchemaType } from "shared";

export async function getAllTestimonials() {
  return prisma.testimonial.findMany({
    orderBy: { order: "asc" },
  });
}

export async function createTestimonial(data: CreateTestimonialSchemaType) {
  return prisma.testimonial.create({ data });
}

export async function updateTestimonial(id: string, data: UpdateTestimonialSchemaType) {
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) {
    throw new AppError(404, "Témoignage non trouvé", ErrorCode.NOT_FOUND);
  }
  return prisma.testimonial.update({ where: { id }, data });
}

export async function deleteTestimonial(id: string) {
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) {
    throw new AppError(404, "Témoignage non trouvé", ErrorCode.NOT_FOUND);
  }
  await prisma.testimonial.delete({ where: { id } });
}
