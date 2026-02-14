import { z } from "zod";

export const projectImagesSchema = z.object({
  main: z.string().min(1),
  thumbnails: z.array(z.string()),
});

export const createProjectSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug doit contenir uniquement lettres minuscules, chiffres et tirets"),
  title: z.string().min(1),
  description: z.string().min(1),
  longDescription: z.string().min(1),
  technologies: z.array(z.string()),
  category: z.string().min(1),
  images: projectImagesSchema,
  github: z.string().url().optional().nullable(),
  demo: z.string().url().optional().nullable(),
  featured: z.boolean().default(false),
  date: z.string().min(1),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectSchemaType = z.infer<typeof createProjectSchema>;
export type UpdateProjectSchemaType = z.infer<typeof updateProjectSchema>;
