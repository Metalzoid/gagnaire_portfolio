import { z } from "zod";

export const pitchSchema = z.object({
  who: z.string().min(1),
  what: z.string().min(1),
  why: z.string().min(1),
  method: z.string().min(1),
});

export const socialLinkSchema = z.object({
  label: z.string().min(1),
  url: z.string().min(1),
});

export const socialSchema = z.array(socialLinkSchema);

export const profileSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.string().min(1),
  status: z.string().min(1),
  bio: z.string().min(1),
  pitch: pitchSchema,
  photo: z.string().min(1),
  social: socialSchema,
  cv: z.string().min(1),
});

export const updateProfileSchema = profileSchema.partial();

export type ProfileSchemaType = z.infer<typeof profileSchema>;
export type UpdateProfileSchemaType = z.infer<typeof updateProfileSchema>;
