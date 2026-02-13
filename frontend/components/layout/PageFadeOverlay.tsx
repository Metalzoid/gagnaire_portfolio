"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "@/hooks/useTheme";
import styles from "./PageFadeOverlay.module.scss";

/**
 * Overlays de fondu en haut et bas des pages "normales" (hors home).
 * Masqué instantanément lors du changement de thème (isTransitioning du ThemeContext).
 */
export function PageFadeOverlay() {
  const pathname = usePathname();
  const { isTransitioning } = useTheme();
  const isHome = pathname === "/";

  if (isHome) {
    return null;
  }

  return (
    <div
      className={`${styles.overlay} ${isTransitioning ? styles["overlay--hidden"] : ""}`}
      aria-hidden="true"
    />
  );
}
