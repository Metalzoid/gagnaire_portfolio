"use client";

import { useState } from "react";
import { getUploadUrl } from "@/utils/url";
import {
  ImageWithFallback,
  PLACEHOLDER_AVATAR,
} from "@/components/ui/image-with-fallback";
import { FileUpload } from "./FileUpload";
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
  const [error, setError] = useState("");

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
            <FileUpload
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              category="profile-photo"
              onComplete={onPhotoChange}
              onError={setError}
              label="Choisir une image"
              ariaLabel="Changer la photo"
            />
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
            <FileUpload
              accept="application/pdf"
              category="cv"
              onComplete={onCvChange}
              onError={setError}
              label="Choisir un PDF"
              ariaLabel="Changer le CV"
            />
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
