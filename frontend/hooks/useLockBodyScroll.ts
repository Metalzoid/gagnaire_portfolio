"use client";

import { useEffect } from "react";

/**
 * Verrouille le scroll du body quand `locked` est true.
 * Sauvegarde et restaure la position de scroll + overflow.
 */
const useLockBodyScroll = (locked: boolean): void => {
  useEffect(() => {
    if (!locked) return;

    // Sauvegarder l'état actuel
    const scrollY = window.scrollY;
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;

    // Verrouiller le scroll
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    // Restaurer au déverrouillage ou au unmount
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      window.scrollTo(0, scrollY);
    };
  }, [locked]);
};

export default useLockBodyScroll;
