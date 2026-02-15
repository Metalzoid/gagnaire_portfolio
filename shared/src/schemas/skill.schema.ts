import { z } from "zod";

export const createSkillSchema = z.object({
  name: z.string().min(1),
  level: z.number().min(0).max(100),
  icon: z.string().optional(),
  categoryId: z.string().min(1),
  order: z.number().int().min(0).optional(),
});

export const createSkillCategorySchema = z.object({
  name: z.string().min(1),
  order: z.number().int().min(0).optional(),
});

export const updateSkillSchema = createSkillSchema.partial().omit({ categoryId: true });
export const updateSkillCategorySchema = createSkillCategorySchema.partial();

export type CreateSkillSchemaType = z.infer<typeof createSkillSchema>;
export type CreateSkillCategorySchemaType = z.infer<typeof createSkillCategorySchema>;
export type UpdateSkillSchemaType = z.infer<typeof updateSkillSchema>;
export type UpdateSkillCategorySchemaType = z.infer<typeof updateSkillCategorySchema>;
