"use client";

import { useState } from "react";
import { adminApi, getUploadUrl } from "@/services/admin-api";
import {
  ImageWithFallback,
  PLACEHOLDER_AVATAR,
} from "@/components/ui/image-with-fallback";
import styles from "./ProfileMediaManager.module.scss";

const DEFAULT_PHOTO = "/images/profile/photo.svg";

interface ProfileMediaManagerProps {
  photo: string;
  cv: string;
  onPhotoChange: (path: string) => void;
  onCvChange: (path: string) => void;
}

export function ProfileMediaManager({
  photo,
  cv,
  onPhotoChange,
  onCvChange,
}: ProfileMediaManagerProps) {
  const [photoUploading, setPhotoUploading] = useState(false);
  const [cvUploading, setCvUploading] = useState(false);
  const [error, setError] = useState("");

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith("image/")) return;

    setError("");
    setPhotoUploading(true);
    try {
      const result = await adminApi.upload(file, "profile-photo");
      if (result.path) onPhotoChange(result.path);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'upload");
    } finally {
      setPhotoUploading(false);
      e.target.value = "";
    }
  };

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/pdf") return;

    setError("");
    setCvUploading(true);
    try {
      const result = await adminApi.upload(file, "cv");
      if (result.path) onCvChange(result.path);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'upload");
    } finally {
      setCvUploading(false);
      e.target.value = "";
    }
  };

  const handleResetPhoto = () => {
    onPhotoChange(DEFAULT_PHOTO);
  };

  const photoDisplayUrl = photo ? getUploadUrl(photo) : "";
  const cvDisplayUrl = cv ? getUploadUrl(cv) : "";

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.sectionTitle}>Médias</h3>

      <div className={styles.grid}>
        {/* Photo */}
        <div className={styles.block}>
          <label className={styles.label}>Photo</label>
          <div className={styles.preview}>
            <ImageWithFallback
              key={photo}
              src={photoDisplayUrl || DEFAULT_PHOTO}
              fallbackSrc={PLACEHOLDER_AVATAR}
              alt="Photo du profil"
              fill
              sizes="120px"
              className={styles.previewImage}
            />
          </div>
          <div className={styles.actions}>
            <label
              className={`${styles.uploadZone} ${photoUploading ? styles.uploadZoneLoading : ""}`}
            >
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                onChange={handlePhotoUpload}
                disabled={photoUploading}
                aria-label="Changer la photo"
              />
              <span>{photoUploading ? "Envoi…" : "Choisir une image"}</span>
            </label>
            {photo && photo.startsWith("/uploads/") && (
              <button
                type="button"
                className={styles.resetBtn}
                onClick={handleResetPhoto}
                aria-label="Réinitialiser avec l'image par défaut"
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>

        {/* CV */}
        <div className={styles.block}>
          <label className={styles.label}>CV (PDF)</label>
          <div className={styles.cvPreview}>
            {cv ? (
              <a
                href={cvDisplayUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.cvLink}
              >
                Voir le CV actuel
              </a>
            ) : (
              <span className={styles.cvPlaceholder}>Aucun CV</span>
            )}
          </div>
          <div className={styles.actions}>
            <label
              className={`${styles.uploadZone} ${cvUploading ? styles.uploadZoneLoading : ""}`}
            >
              <input
                type="file"
                accept="application/pdf"
                onChange={handleCvUpload}
                disabled={cvUploading}
                aria-label="Changer le CV"
              />
              <span>{cvUploading ? "Envoi…" : "Choisir un PDF"}</span>
            </label>
          </div>
        </div>
      </div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
