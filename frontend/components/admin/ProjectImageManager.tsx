"use client";

import { useState, useCallback } from "react";
import { adminApi, getUploadUrl } from "@/services/admin-api";
import {
  ImageWithFallback,
  PLACEHOLDER_PROJECT_IMAGE,
} from "@/components/ui/image-with-fallback";
import { FileUpload } from "./FileUpload";
import type { ProjectImage } from "shared";
import styles from "./ProjectImageManager.module.scss";

interface ProjectImageManagerProps {
  projectId: string;
  images: ProjectImage[];
  onImagesChange: (images: ProjectImage[]) => void;
}

export function ProjectImageManager({
  projectId,
  images,
  onImagesChange,
}: ProjectImageManagerProps) {
  const [uploadError, setUploadError] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDelete = async (image: ProjectImage) => {
    if (!confirm("Supprimer cette image ?")) return;
    try {
      await adminApi.projects.deleteImage(projectId, image.id);
      onImagesChange(images.filter((img) => img.id !== image.id));
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Erreur lors de la suppression",
      );
    }
  };

  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent, dropIndex: number) => {
      e.preventDefault();
      setDragOverIndex(null);
      if (draggedIndex === null || draggedIndex === dropIndex) {
        setDraggedIndex(null);
        return;
      }

      const reordered = [...images];
      const [removed] = reordered.splice(draggedIndex, 1);
      reordered.splice(dropIndex, 0, removed);

      try {
        const orderedIds = reordered.map((img) => img.id);
        const updated = await adminApi.projects.reorderImages(
          projectId,
          orderedIds,
        );
        onImagesChange(updated);
      } catch (err) {
        setUploadError(
          err instanceof Error
            ? err.message
            : "Erreur lors du réordonnancement",
        );
      }
      setDraggedIndex(null);
    },
    [draggedIndex, images, projectId, onImagesChange],
  );

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, []);

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>Images du projet</label>
      <p className={styles.hint}>
        La première image est l&apos;image principale. Glissez-déposez pour
        réordonner.
      </p>

      <div className={styles.grid}>
        {images.map((img, index) => (
          <div
            key={img.id}
            className={`${styles.card} ${draggedIndex === index ? styles.cardDragging : ""} ${dragOverIndex === index ? styles.cardDragOver : ""}`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
          >
            <div className={styles.preview}>
              <ImageWithFallback
                src={getUploadUrl(img.path)}
                fallbackSrc={PLACEHOLDER_PROJECT_IMAGE}
                alt=""
                fill
                sizes="120px"
                className={styles.previewImage}
              />
              {index === 0 && (
                <span className={styles.badge} aria-hidden>
                  Principale
                </span>
              )}
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={() => handleDelete(img)}
                aria-label={`Supprimer l'image ${index + 1}`}
              >
                ×
              </button>
            </div>
          </div>
        ))}

        <FileUpload
          accept="image/jpeg,image/png,image/webp,image/svg+xml"
          multiple
          onUpload={async (file) => {
            const img = await adminApi.projects.uploadImage(projectId, file);
            onImagesChange([...images, img].sort((a, b) => a.order - b.order));
            return img.path;
          }}
          onError={(msg) => setUploadError(msg)}
          label="+ Ajouter des images"
          size="lg"
          ariaLabel="Ajouter des images"
        />
      </div>

      {uploadError && (
        <p className={styles.error} role="alert">
          {uploadError}
        </p>
      )}
    </div>
  );
}
