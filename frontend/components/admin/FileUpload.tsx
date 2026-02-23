"use client";

import { useState } from "react";
import { adminApi } from "@/services/admin-api";
import { getUploadUrl } from "@/utils/url";
import { isImageFile } from "@/utils/image";
import {
  ImageWithFallback,
  PLACEHOLDER_AVATAR,
} from "@/components/ui/image-with-fallback";
import styles from "./FileUpload.module.scss";

type UploadCategory =
  | "profile-photo"
  | "cv"
  | "testimonial-photo"
  | "technology-icon";

interface FileUploadBaseProps {
  accept?: string;
  multiple?: boolean;
  label?: string;
  loadingLabel?: string;
  ariaLabel?: string;
  onError?: (message: string) => void;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  /** Chemin ou URL du fichier actuel (pour afficher la preview) */
  value?: string;
  /** Afficher la preview quand value est une image */
  showPreview?: boolean;
  /** Forme du cadre de preview : cercle (avatars) ou carré (icônes) */
  previewShape?: "circle" | "square";
}

type FileUploadProps = FileUploadBaseProps &
  (
    | {
        category: UploadCategory;
        onUpload?: never;
        onComplete: (path: string) => void;
      }
    | {
        category?: never;
        onUpload: (file: File) => Promise<string>;
        onComplete?: (path: string) => void;
      }
  );

export function FileUpload({
  accept,
  multiple = false,
  label = "Choisir un fichier",
  loadingLabel = "Envoi en cours…",
  ariaLabel,
  onError,
  disabled = false,
  className,
  size = "md",
  value,
  showPreview = false,
  previewShape = "square",
  ...rest
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setError("");
    setUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        let path: string;

        if ("category" in rest && rest.category) {
          const result = await adminApi.upload(file, rest.category);
          path = result.path;
          rest.onComplete(path);
        } else if ("onUpload" in rest && rest.onUpload) {
          path = await rest.onUpload(file);
          rest.onComplete?.(path);
        }
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur lors de l'upload";
      setError(message);
      onError?.(message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const zoneClasses = [
    styles.uploadZone,
    uploading && styles.uploading,
    size !== "md" && styles[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const displayUrl = value ? getUploadUrl(value) : "";
  const canShowPreview =
    showPreview && value && displayUrl && isImageFile(displayUrl);

  return (
    <div>
      {canShowPreview && (
        <div className={styles.previewWrapper}>
          <div
            className={`${styles.preview} ${previewShape === "circle" ? styles.previewCircle : ""}`}
          >
            <ImageWithFallback
              src={displayUrl}
              fallbackSrc={PLACEHOLDER_AVATAR}
              alt="Aperçu"
              width={120}
              height={120}
            />
          </div>
        </div>
      )}
      <label className={zoneClasses}>
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          disabled={disabled || uploading}
          aria-label={ariaLabel ?? label}
        />
        <span>{uploading ? loadingLabel : label}</span>
      </label>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
