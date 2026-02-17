import { z } from "zod";

export const reorderProjectImagesSchema = z.object({
  orderedIds: z.array(z.string().min(1)).min(1),
});

export type ReorderProjectImagesSchemaType = z.infer<
  typeof reorderProjectImagesSchema
>;
