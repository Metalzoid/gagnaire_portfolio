"use client";

import { useState } from "react";
import {
  ImageWithFallback,
  PLACEHOLDER_PROJECT_IMAGE,
} from "@/components/ui/image-with-fallback";
import { getBackendImageUrl } from "@/services/api";
import type { ProjectImage } from "shared";
import styles from "./ProjectGallery.module.scss";

interface ProjectGalleryProps {
  images: ProjectImage[];
  title: string;
}

/** Précharge l'image en taille "main" (800px) pour affichage instantané au clic. */
function PreloadImage({ src }: { src: string }) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left: -9999,
        top: 0,
        width: 10,
        height: 10,
        overflow: "hidden",
      }}
    >
      <ImageWithFallback
        src={src}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 800px"
      />
    </div>
  );
}

export function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const sortedImages = [...(images ?? [])].sort((a, b) => a.order - b.order);
  const allPaths = sortedImages
    .map((img) => getBackendImageUrl(img.path))
    .filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const mainImage = allPaths[activeIndex] || PLACEHOLDER_PROJECT_IMAGE;

  if (allPaths.length === 0) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.mainWrapper}>
          <ImageWithFallback
            src={PLACEHOLDER_PROJECT_IMAGE}
            alt={title}
            fill
            className={styles.mainImage}
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* Précharge toutes les images (sauf l'active) une fois l'image principale chargée */}
      {isReady &&
        allPaths.map(
          (src, i) =>
            i !== activeIndex && (
              <PreloadImage key={sortedImages[i]?.id ?? src} src={src} />
            ),
        )}
      <div className={styles.mainWrapper}>
        <ImageWithFallback
          src={mainImage}
          alt={title}
          fill
          className={styles.mainImage}
          sizes="(max-width: 768px) 100vw, 800px"
          priority
          onLoad={() => setIsReady(true)}
        />
      </div>
      {allPaths.length > 1 && (
        <div className={styles.thumbnails}>
          {allPaths.map((src, i) => (
            <button
              key={sortedImages[i]?.id ?? src}
              type="button"
              className={`${styles.thumb} ${i === activeIndex ? styles["thumb--active"] : ""}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`Voir image ${i + 1}`}
              aria-pressed={i === activeIndex}
            >
              <ImageWithFallback
                src={src}
                alt=""
                fill
                sizes="120px"
                className={styles.thumbImage}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
