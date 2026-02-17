"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

/** Placeholder pour les images projet (cartes, galerie) */
export const PLACEHOLDER_PROJECT_IMAGE = "/images/placeholder-project.svg";

/** Placeholder pour les photos profil et témoignages */
export const PLACEHOLDER_AVATAR = "/images/profile/photo.svg";

interface ImageWithFallbackProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
}

/**
 * Composant Image qui affiche un placeholder en cas d'erreur (404, etc.)
 * On stocke la src en erreur plutôt qu'un booléen pour réinitialiser automatiquement quand src change.
 */
export function ImageWithFallback({
  src,
  fallbackSrc = PLACEHOLDER_PROJECT_IMAGE,
  alt,
  ...rest
}: ImageWithFallbackProps) {
  const [failedSrc, setFailedSrc] = useState<NonNullable<ImageProps["src"]> | null>(null);

  const effectiveSrc = failedSrc === src ? fallbackSrc : src;

  return (
    <Image
      src={effectiveSrc}
      alt={alt}
      onError={() => setFailedSrc(src)}
      {...rest}
      unoptimized
    />
  );
}
