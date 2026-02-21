"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { TerminalHeroSkeleton } from "./TerminalHeroSkeleton";
import type { TerminalHeroProps } from "./TerminalHero";

const TerminalHero = dynamic(
  () =>
    import("./TerminalHero").then((m) => ({
      default: m.TerminalHero,
    })),
  {
    ssr: false,
    loading: () => <TerminalHeroSkeleton />,
  },
);

/**
 * Wrapper qui retarde le montage de TerminalHero jusqu'après l'hydratation.
 * Évite les erreurs d'hydratation sur iOS quand le chunk est en cache et
 * le Hero se rend avant que le Skeleton soit hydraté.
 */
export function TerminalHeroWithSafeHydration(props: TerminalHeroProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setHasMounted(true);
    }, 100); // 100ms pour éviter les cascading renders
  }, []);

  // Pendant le premier rendu (serveur + hydratation), toujours afficher le Skeleton
  // pour garantir la cohérence avec le HTML envoyé par le serveur.
  if (!hasMounted) {
    return <TerminalHeroSkeleton />;
  }

  return <TerminalHero {...props} />;
}
