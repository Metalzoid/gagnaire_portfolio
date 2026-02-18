import { z } from "zod";

export const contactStatusEnum = z.enum(["pending", "in_progress", "done"]);
export type ContactStatusEnum = z.infer<typeof contactStatusEnum>;

export const createContactSchema = z.object({
  name: z.string().min(2, { error: "Le nom doit contenir au moins 2 caractères" }),
  email: z.email({ error: "Format d'email invalide" }),
  message: z
    .string()
    .min(10, { error: "Le message doit contenir au moins 10 caractères" }),
});

export const updateContactStatusSchema = z.object({
  status: contactStatusEnum,
});

export type CreateContactSchemaType = z.infer<typeof createContactSchema>;
export type UpdateContactStatusSchemaType = z.infer<
  typeof updateContactStatusSchema
>;
