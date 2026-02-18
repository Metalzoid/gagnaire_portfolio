import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({ error: "Email invalide" }),
  password: z.string().min(1, { error: "Mot de passe requis" }),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, { error: "Refresh token requis" }),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
export type RefreshTokenSchemaType = z.infer<typeof refreshTokenSchema>;
