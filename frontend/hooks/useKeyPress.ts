"use client";

import { useEffect } from "react";

/**
 * Déclenche un callback quand une touche spécifique est pressée.
 * Le listener n'est actif que si `enabled` est true (par défaut true).
 */
const useKeyPress = (
  key: string,
  callback: () => void,
  enabled: boolean = true
): void => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === key) {
        event.preventDefault();
        callback();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [key, callback, enabled]);
};

export default useKeyPress;
