"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

/**
 * Précharge le chunk du TerminalHero dès que l'utilisateur est sur la page d'accueil.
 * Permet au navigateur de démarrer le téléchargement en parallèle avec le reste de la page,
 * améliorant le LCP (Largest Contentful Paint).
 */
export function TerminalChunkPreload() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (pathname !== "/") return;

    import("@/components/home/terminal-hero");
  }, [pathname]);

  return null;
}
