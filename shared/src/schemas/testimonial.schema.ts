import { z } from "zod";

export const createTestimonialSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  company: z.string().min(1),
  quote: z.string().min(1),
  photo: z.string().min(1),
  order: z.number().int().min(0).optional(),
});

export const updateTestimonialSchema = createTestimonialSchema.partial();

export type CreateTestimonialSchemaType = z.infer<typeof createTestimonialSchema>;
export type UpdateTestimonialSchemaType = z.infer<typeof updateTestimonialSchema>;
