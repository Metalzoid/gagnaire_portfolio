import path from "path";
import fs from "fs/promises";
import OpenAI from "openai";
import { z } from "zod";
import { prisma } from "../config/database.js";
import { AppError } from "../utils/AppError.js";
import { ErrorCode } from "../utils/errorCodes.js";
import type { UpdateAiPromptSchemaType } from "shared";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

// ---------------------------------------------------------------------------
// OpenAI client
// ---------------------------------------------------------------------------
let client: OpenAI | null = null;

export function isConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

function getClient(): OpenAI {
  if (client) return client;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new AppError(
      503,
      "Clé OpenAI non configurée",
      ErrorCode.AI_NOT_CONFIGURED,
    );
  }
  client = new OpenAI({ apiKey });
  return client;
}

// ---------------------------------------------------------------------------
// Prompt config helpers
// ---------------------------------------------------------------------------
async function getPromptConfig(target: string) {
  const config = await prisma.aiPrompt.findUnique({ where: { target } });
  if (!config) {
    throw new AppError(
      404,
      `Prompt IA non configuré pour "${target}"`,
      ErrorCode.NOT_FOUND,
    );
  }
  return config;
}

// ---------------------------------------------------------------------------
// Generic OpenAI call (JSON mode)
// ---------------------------------------------------------------------------
async function callOpenAI<T>(
  config: { prompt: string; temperature: number; model: string },
  userContent: string | OpenAI.ChatCompletionContentPart[],
  responseSchema: z.ZodType<T>,
): Promise<T> {
  const openai = getClient();

  let response;
  try {
    response = await openai.chat.completions.create({
      model: config.model,
      temperature: config.temperature,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: config.prompt },
        {
          role: "user",
          content: userContent as string,
        },
      ],
    });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "status" in err) {
      const apiErr = err as { status: number; code?: string; message?: string };
      if (apiErr.status === 429) {
        throw new AppError(
          429,
          "Quota OpenAI dépassé. Vérifiez votre plan et vos crédits.",
          ErrorCode.AI_ENHANCEMENT_FAILED,
        );
      }
      if (apiErr.status === 401) {
        throw new AppError(
          503,
          "Clé OpenAI invalide ou expirée.",
          ErrorCode.AI_NOT_CONFIGURED,
        );
      }
      throw new AppError(
        502,
        `Erreur OpenAI (${apiErr.status}): ${apiErr.message ?? "erreur inconnue"}`,
        ErrorCode.AI_ENHANCEMENT_FAILED,
      );
    }
    throw err;
  }

  const raw = response.choices[0]?.message?.content;
  if (!raw) {
    throw new AppError(
      500,
      "Réponse IA vide",
      ErrorCode.AI_ENHANCEMENT_FAILED,
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new AppError(
      500,
      "Réponse IA invalide (JSON)",
      ErrorCode.AI_ENHANCEMENT_FAILED,
    );
  }

  const validated = responseSchema.safeParse(parsed);
  if (!validated.success) {
    throw new AppError(
      500,
      `Réponse IA invalide: ${validated.error.message}`,
      ErrorCode.AI_ENHANCEMENT_FAILED,
    );
  }
  return validated.data;
}

// ---------------------------------------------------------------------------
// Enhance Profile
// ---------------------------------------------------------------------------
const profileResponseSchema = z.object({
  role: z.string(),
  status: z.string(),
  bio: z.string(),
  pitch: z.object({
    who: z.string(),
    what: z.string(),
    why: z.string(),
    method: z.string(),
  }),
});

export async function enhanceProfile() {
  const config = await getPromptConfig("profile");
  const profile = await prisma.profile.findFirst({
    orderBy: { createdAt: "asc" },
  });
  if (!profile) {
    throw new AppError(404, "Profil non trouvé", ErrorCode.NOT_FOUND);
  }

  const input = JSON.stringify({
    role: profile.role,
    status: profile.status,
    bio: profile.bio,
    pitch: profile.pitch,
  });

  const improved = await callOpenAI(config, input, profileResponseSchema);

  const updated = await prisma.profile.update({
    where: { id: profile.id },
    data: {
      role: improved.role,
      status: improved.status,
      bio: improved.bio,
      pitch: improved.pitch,
    },
  });

  return updated;
}

// ---------------------------------------------------------------------------
// Enhance Experience
// ---------------------------------------------------------------------------
const experienceResponseSchema = z.object({
  description: z.string(),
});

export async function enhanceExperience(id: string) {
  const config = await getPromptConfig("experience");
  const experience = await prisma.experience.findUnique({ where: { id } });
  if (!experience) {
    throw new AppError(404, "Expérience non trouvée", ErrorCode.NOT_FOUND);
  }

  const input = JSON.stringify({
    title: experience.title,
    company: experience.company,
    description: experience.description,
  });

  const improved = await callOpenAI(config, input, experienceResponseSchema);

  const updated = await prisma.experience.update({
    where: { id },
    data: { description: improved.description },
    include: { technologies: true },
  });

  return updated;
}

// ---------------------------------------------------------------------------
// Enhance Project
// ---------------------------------------------------------------------------
const projectResponseSchema = z.object({
  description: z.string(),
  longDescription: z.string(),
});

async function loadImageAsBase64(
  imagePath: string,
): Promise<{ base64: string; mimeType: string } | null> {
  try {
    let filePath: string;
    if (imagePath.startsWith("/uploads/")) {
      const relPath = imagePath.replace(/^\/uploads\//, "");
      filePath = path.join(UPLOAD_DIR, relPath);
    } else {
      return null;
    }

    const buffer = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const mimeMap: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
      ".gif": "image/gif",
    };
    const mimeType = mimeMap[ext] ?? "image/jpeg";
    return { base64: buffer.toString("base64"), mimeType };
  } catch {
    return null;
  }
}

export async function enhanceProject(id: string) {
  const config = await getPromptConfig("projects");
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      technologies: true,
      images: { orderBy: { order: "asc" }, take: 2 },
    },
  });
  if (!project) {
    throw new AppError(404, "Projet non trouvé", ErrorCode.NOT_FOUND);
  }

  const textInput = JSON.stringify({
    title: project.title,
    description: project.description,
    longDescription: project.longDescription,
    technologies: project.technologies.map((t) => t.name),
  });

  // Build content parts with optional images for vision
  const contentParts: OpenAI.ChatCompletionContentPart[] = [
    { type: "text", text: textInput },
  ];

  for (const img of project.images) {
    const loaded = await loadImageAsBase64(img.path);
    if (loaded) {
      contentParts.push({
        type: "image_url",
        image_url: {
          url: `data:${loaded.mimeType};base64,${loaded.base64}`,
          detail: "low",
        },
      });
    }
  }

  const improved = await callOpenAI(config, contentParts, projectResponseSchema);

  const updated = await prisma.project.update({
    where: { id },
    data: {
      description: improved.description,
      longDescription: improved.longDescription,
    },
    include: {
      technologies: true,
      images: { orderBy: { order: "asc" } },
    },
  });

  return updated;
}

// ---------------------------------------------------------------------------
// CRUD Prompts
// ---------------------------------------------------------------------------
export async function listPrompts() {
  return prisma.aiPrompt.findMany({ orderBy: { target: "asc" } });
}

export async function getPrompt(target: string) {
  return getPromptConfig(target);
}

export async function updatePrompt(target: string, data: UpdateAiPromptSchemaType) {
  const existing = await prisma.aiPrompt.findUnique({ where: { target } });
  if (!existing) {
    throw new AppError(
      404,
      `Prompt IA non trouvé pour "${target}"`,
      ErrorCode.NOT_FOUND,
    );
  }

  return prisma.aiPrompt.update({
    where: { target },
    data: {
      prompt: data.prompt,
      temperature: data.temperature,
      ...(data.model !== undefined && { model: data.model }),
    },
  });
}
