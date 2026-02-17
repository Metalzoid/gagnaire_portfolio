import { z } from "zod";

export const createTechnologySchema = z.object({
  name: z.string().min(1),
  icon: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  order: z.number().int().min(0).optional(),
});

export const updateTechnologySchema = createTechnologySchema.partial();

export type CreateTechnologySchemaType = z.infer<typeof createTechnologySchema>;
export type UpdateTechnologySchemaType = z.infer<typeof updateTechnologySchema>;
