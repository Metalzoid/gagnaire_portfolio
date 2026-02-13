"use client";

import { useEffect, useRef, useState } from "react";

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------
interface UseScrollAnimationOptions {
  /** Seuil de visibilité (0-1) pour déclencher l'animation */
  threshold?: number;
  /** Margin autour du viewport pour déclencher (ex: "0px 0px -100px 0px") */
  rootMargin?: string;
  /** Déclencher une seule fois (pas de reset quand on scroll en arrière) */
  triggerOnce?: boolean;
}

// --------------------------------------------------------------------------
// Hook - Intersection Observer pour animations au scroll
// --------------------------------------------------------------------------
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollAnimationOptions = {},
): [React.RefObject<T | null>, boolean] {
  const {
    threshold = 0.1,
    rootMargin = "0px 0px -50px 0px",
    triggerOnce = true,
  } = options;

  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      queueMicrotask(() => setIsVisible(true));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isVisible];
}
