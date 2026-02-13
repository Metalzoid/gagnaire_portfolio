"use client";

import { useSyncExternalStore } from "react";

/**
 * Hook pour écouter une media query CSS.
 * Retourne true si la media query matche, false sinon.
 * SSR-safe : retourne false côté serveur.
 * Utilise useSyncExternalStore pour éviter les rendus en cascade.
 */
const useMediaQuery = (query: string): boolean => {
  return useSyncExternalStore(
    (callback) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", callback);
      return () => media.removeEventListener("change", callback);
    },
    () => window.matchMedia(query).matches,
    () => false // SSR : viewport inconnu côté serveur
  );
};

export default useMediaQuery;
