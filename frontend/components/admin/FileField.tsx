"use client";

import { useId, useState } from "react";
import { adminApi, getUploadUrl } from "@/services/admin-api";
import {
  ImageWithFallback,
  PLACEHOLDER_AVATAR,
} from "@/components/ui/image-with-fallback";
import styles from "./FormField.module.scss";

interface FileFieldProps {
  label: string;
  name: string;
  accept?: string;
  category: "profile-photo" | "cv" | "testimonial-photo";
  value?: string;
  onUpload: (path: string) => void;
  error?: string;
  required?: boolean;
  /** Afficher la prévisualisation (pour images) */
  preview?: boolean;
}

export function FileField({
  label,
  name,
  accept,
  category,
  value,
  onUpload,
  error,
  required = false,
  preview = false,
}: FileFieldProps) {
  const id = useId();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const hasError = Boolean(error || uploadError);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");
    setUploading(true);

    try {
      const result = await adminApi.upload(file, category);
      if (result.path) onUpload(result.path);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur lors de l'upload";
      setUploadError(message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const displayUrl = value ? getUploadUrl(value) : "";

  return (
    <div className={styles.wrapper}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && <span className={styles.required}> *</span>}
      </label>
      <div className="admin-file-field">
        <input
          id={id}
          type="file"
          name={name}
          accept={accept}
          onChange={handleChange}
          disabled={uploading}
          className={`${styles.input} ${hasError ? styles.error : ""}`}
          aria-invalid={hasError}
        />
        <span className="admin-file-field__hint">
          {uploading
            ? "Envoi en cours…"
            : value
              ? `Actuel : ${value}`
              : "Choisir un fichier"}
        </span>
      </div>
      {preview &&
        displayUrl &&
        displayUrl.match(/\.(jpg|jpeg|png|webp|svg)$/i) && (
          <div className="admin-file-field__preview">
            <ImageWithFallback
              src={displayUrl}
              fallbackSrc={PLACEHOLDER_AVATAR}
              alt="Aperçu"
              width={120}
              height={120}
            />
          </div>
        )}
      {(error || uploadError) && (
        <p className={styles.errorText} role="alert">
          {error || uploadError}
        </p>
      )}
    </div>
  );
}
