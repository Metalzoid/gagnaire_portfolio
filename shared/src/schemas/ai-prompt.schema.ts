import { z } from "zod";

export const updateAiPromptSchema = z.object({
  prompt: z.string().min(10, "Le prompt doit contenir au moins 10 caractères"),
  temperature: z.number().min(0).max(2),
  model: z.string().optional(),
});

export type UpdateAiPromptSchemaType = z.infer<typeof updateAiPromptSchema>;
