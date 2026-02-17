import type { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { AppError } from "../utils/AppError.js";
import { ErrorCode } from "../utils/errorCodes.js";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const MAX_SIZE = 10 * 1024 * 1024; // 10 Mo

const ALLOWED_PHOTO = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];
const ALLOWED_CV = ["application/pdf"];

const VALID_CATEGORIES = [
  "profile-photo",
  "cv",
  "testimonial-photo",
  "project-image",
  "technology-icon",
] as const;
type UploadCategory = (typeof VALID_CATEGORIES)[number];

function getAllowedMimes(category: UploadCategory): string[] {
  return category === "cv" ? ALLOWED_CV : ALLOWED_PHOTO;
}

function safeFilename(original: string): string {
  const ext = path.extname(original) || ".bin";
  const base = path
    .basename(original, ext)
    .replace(/[^a-zA-Z0-9\-_]/g, "_")
    .slice(0, 50);
  return `${base}-${Date.now()}${ext}`;
}

const storage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    const category = (_req.body?.category as string) || "misc";
    const dir = path.join(UPLOAD_DIR, category);
    await fs.mkdir(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    cb(null, safeFilename(file.originalname));
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
});

/** Multer dédié pour les images projet : destination fixe, ne dépend pas de req.body */
function createProjectImageStorage() {
  const dir = path.join(UPLOAD_DIR, "project-image");
  return multer.diskStorage({
    destination: async (_req, _file, cb) => {
      await fs.mkdir(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (_req, file, cb) => {
      cb(null, safeFilename(file.originalname));
    },
  });
}

export const uploadProjectImage = multer({
  storage: createProjectImageStorage(),
  limits: { fileSize: MAX_SIZE },
});

export async function handleUpload(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const category = req.body?.category as string;
    console.log("[Upload] Requête reçue:", {
      category,
      hasFile: !!req.file,
      mimetype: req.file?.mimetype,
    });

    if (!category || !VALID_CATEGORIES.includes(category as UploadCategory)) {
      return next(
        new AppError(
          400,
          `Catégorie invalide. Catégories autorisées : ${VALID_CATEGORIES.join(", ")}`,
          ErrorCode.UPLOAD_INVALID_CATEGORY,
        ),
      );
    }

    if (!req.file) {
      return next(
        new AppError(400, "Aucun fichier fourni", ErrorCode.UPLOAD_NO_FILE),
      );
    }

    const allowed = getAllowedMimes(category as UploadCategory);
    if (!allowed.includes(req.file.mimetype)) {
      // Supprimer le fichier rejeté
      await fs.unlink(req.file.path).catch(() => {});

      const hint =
        category === "cv"
          ? "Format accepté : PDF uniquement"
          : "Format accepté : JPEG, PNG, WebP, SVG";
      return next(new AppError(400, hint, ErrorCode.UPLOAD_INVALID_TYPE));
    }

    const publicPath = `/uploads/${category}/${req.file.filename}`;
    console.log("[Upload] Succès:", publicPath);
    res.json({ success: true, data: { path: publicPath } });
  } catch (err) {
    next(err);
  }
}
