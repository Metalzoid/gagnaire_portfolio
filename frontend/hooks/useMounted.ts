"use client";

import { useEffect, useState } from "react";

/**
 * Hook indiquant si le composant est monté côté client.
 * Retourne false pendant le SSR et le premier cycle de rendu client,
 * puis true après le montage. Utilisé pour éviter les mismatches d'hydratation
 * en différant le rendu de contenus dépendants du client (APIs navigateur, etc.).
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return mounted;
}
