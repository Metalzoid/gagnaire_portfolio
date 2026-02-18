import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.url().optional(),
  JWT_SECRET: z.string().min(1).default("dev-secret-change-in-production"),
  ADMIN_EMAIL: z.email().optional(),
  ADMIN_PASSWORD: z.string().min(8).optional(),
  BREVO_API_KEY: z.string().optional(),
  BREVO_SENDER_EMAIL: z.email().optional(),
  BREVO_SENDER_NAME: z.string().optional(),
  CONTACT_NOTIFY_EMAIL: z.email().optional(),
  /** URL publique du frontend (ex. https://portfolio.example.com) pour les liens dans les emails. */
  SITE_URL: z.url().optional(),
});

export type Env = z.infer<typeof envSchema>;

export function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("❌ Invalid environment variables:", parsed.error.issues);
    throw new Error("Invalid environment variables");
  }
  return parsed.data;
}
