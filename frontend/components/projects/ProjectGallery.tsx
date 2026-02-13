"use client";

import { useState } from "react";
import { ImageWithFallback, PLACEHOLDER_PROJECT_IMAGE } from "@/components/ui/image-with-fallback";
import type { ProjectImages } from "@/types";
import styles from "./ProjectGallery.module.scss";

interface ProjectGalleryProps {
  images: ProjectImages;
  title: string;
}

export function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const thumbs = images?.thumbnails || [];
  const allImages = [images?.main, ...thumbs].filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);
  const mainImage = allImages[activeIndex] || PLACEHOLDER_PROJECT_IMAGE;

  if (allImages.length === 0) {
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
      <div className={styles.mainWrapper}>
        <ImageWithFallback
          src={mainImage}
          alt={title}
          fill
          className={styles.mainImage}
          sizes="(max-width: 768px) 100vw, 800px"
          priority
        />
      </div>
      {allImages.length > 1 && (
        <div className={styles.thumbnails}>
          {allImages.map((src, i) => (
            <button
              key={src}
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
