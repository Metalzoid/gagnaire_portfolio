import { z } from "zod";

export const createExperienceSchema = z.object({
  type: z.enum(["work", "education"]),
  title: z.string().min(1),
  company: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().min(1),
  endDate: z.string().nullable().optional(),
  current: z.boolean().default(false),
  description: z.string().min(1),
  technologies: z.array(z.string()).optional(),
  order: z.number().int().min(0).optional(),
});

export const updateExperienceSchema = createExperienceSchema.partial();

export type CreateExperienceSchemaType = z.infer<typeof createExperienceSchema>;
export type UpdateExperienceSchemaType = z.infer<typeof updateExperienceSchema>;
