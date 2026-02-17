import type { Request, Response, NextFunction } from "express";
import fs from "fs/promises";
import { uploadProjectImage } from "./upload.controller.js";
import * as projectImagesService from "../services/project-images.service.js";
import { success } from "../utils/apiResponse.js";
import { AppError } from "../utils/AppError.js";
import { ErrorCode } from "../utils/errorCodes.js";

const ALLOWED_PHOTO = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];

export const uploadImage = [
  uploadProjectImage.single("file"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectId = String(req.params.id);
      if (!req.file) {
        return next(
          new AppError(400, "Aucun fichier fourni", ErrorCode.UPLOAD_NO_FILE),
        );
      }

      if (!ALLOWED_PHOTO.includes(req.file.mimetype)) {
        await fs.unlink(req.file.path).catch(() => {});
        return next(
          new AppError(
            400,
            "Format accepté : JPEG, PNG, WebP, SVG",
            ErrorCode.UPLOAD_INVALID_TYPE,
          ),
        );
      }

      const publicPath = `/uploads/project-image/${req.file.filename}`;
      const image = await projectImagesService.addImage(projectId, publicPath);
      return success(res, image, 201);
    } catch (err) {
      next(err);
    }
  },
];

export async function deleteImage(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const projectId = String(req.params.id);
    const imageId = String(req.params.imageId);
    await projectImagesService.removeImage(projectId, imageId);
    return success(res, { message: "Image supprimée" });
  } catch (err) {
    next(err);
  }
}

export async function reorderImages(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const projectId = String(req.params.id);
    const { orderedIds } = req.body;
    const images = await projectImagesService.reorderImages(
      projectId,
      orderedIds as string[],
    );
    return success(res, images);
  } catch (err) {
    next(err);
  }
}
