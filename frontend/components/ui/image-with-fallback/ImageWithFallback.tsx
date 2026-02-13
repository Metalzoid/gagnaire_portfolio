"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

export const PLACEHOLDER_PROJECT_IMAGE = "/images/placeholder-project.svg";

interface ImageWithFallbackProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
}

/**
 * Composant Image qui affiche un placeholder en cas d'erreur (404, etc.)
 */
export function ImageWithFallback({
  src,
  fallbackSrc = PLACEHOLDER_PROJECT_IMAGE,
  alt,
  ...rest
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const effectiveSrc = hasError ? fallbackSrc : src;

  return (
    <Image
      src={effectiveSrc}
      alt={alt}
      onError={() => setHasError(true)}
      {...rest}
      unoptimized
    />
  );
}
