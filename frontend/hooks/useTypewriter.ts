"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------
interface UseTypewriterOptions {
  /** Vitesse de frappe en ms par caractère */
  speed?: number;
  /** Délai entre chaque ligne en ms */
  delayBetweenLines?: number;
  /** Délai avant de commencer en ms */
  initialDelay?: number;
  /** Caractères par mise à jour (batch) - réduit les re-renders, améliore les perfs */
  charsPerUpdate?: number;
  /** Démarrer l'animation uniquement quand true (ex: visible via IntersectionObserver) */
  enabled?: boolean;
}

// --------------------------------------------------------------------------
// Helpers – lecture de prefers-reduced-motion via useSyncExternalStore
// (pattern React recommandé, compatible SSR, sans mismatch d'hydratation)
// --------------------------------------------------------------------------
function subscribeToReducedMotion(callback: () => void) {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerReducedMotionSnapshot() {
  return false;
}

// --------------------------------------------------------------------------
// Hook - Effet de frappe (typewriter) avec requestAnimationFrame
// --------------------------------------------------------------------------
export interface UseTypewriterResult {
  /** Texte affiché (lignes jointes par \n) */
  text: string;
  /** true quand toutes les lignes ont été tapées */
  isComplete: boolean;
}

export function useTypewriter(
  lines: string[],
  options: UseTypewriterOptions = {},
): UseTypewriterResult {
  const {
    speed = 50,
    delayBetweenLines = 800,
    initialDelay = 500,
    charsPerUpdate = 1,
    enabled = true,
  } = options;

  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const lineIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const lastTimestampRef = useRef<number>(0);
  const accumulatedTimeRef = useRef(0);
  const hasStartedRef = useRef(false);
  const waitingBetweenLinesRef = useRef(false);

  // Lecture safe de prefers-reduced-motion (compatible SSR)
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot,
  );

  useEffect(() => {
    if (prefersReducedMotion || !enabled || lines.length === 0) return;

    lineIndexRef.current = 0;
    charIndexRef.current = 0;
    lastTimestampRef.current = 0;
    accumulatedTimeRef.current = 0;
    hasStartedRef.current = false;
    waitingBetweenLinesRef.current = false;

    // Report différé pour éviter cascading renders (règle react-hooks/set-state-in-effect)
    const resetId = requestAnimationFrame(() => {
      setDisplayedLines([]);
      setIsComplete(false);
    });

    let rafId: number;

    const tick = (timestamp: number) => {
      if (!hasStartedRef.current) {
        accumulatedTimeRef.current += timestamp - lastTimestampRef.current;
        lastTimestampRef.current = timestamp;
        if (accumulatedTimeRef.current >= initialDelay) {
          hasStartedRef.current = true;
          accumulatedTimeRef.current = 0;
        }
        rafId = requestAnimationFrame(tick);
        return;
      }

      const dt = timestamp - lastTimestampRef.current;
      lastTimestampRef.current = timestamp;
      accumulatedTimeRef.current += dt;

      if (lineIndexRef.current >= lines.length) {
        return; // Animation terminée, arrêter la boucle
      }

      const currentLine = lines[lineIndexRef.current];

      if (waitingBetweenLinesRef.current) {
        if (accumulatedTimeRef.current >= delayBetweenLines) {
          waitingBetweenLinesRef.current = false;
          accumulatedTimeRef.current = 0;
          lineIndexRef.current += 1;
          charIndexRef.current = 0;
          if (lineIndexRef.current >= lines.length) {
            setIsComplete(true);
            return;
          }
        }
        rafId = requestAnimationFrame(tick);
        return;
      }

      if (charIndexRef.current < currentLine.length) {
        const batchSize = Math.min(charsPerUpdate, currentLine.length - charIndexRef.current);
        const batchDelay = speed * batchSize;

        if (accumulatedTimeRef.current >= batchDelay) {
          accumulatedTimeRef.current -= batchDelay;
          charIndexRef.current += batchSize;

          setDisplayedLines((prev) => {
            const newLines = [...prev];
            if (!newLines[lineIndexRef.current]) {
              newLines[lineIndexRef.current] = "";
            }
            newLines[lineIndexRef.current] = currentLine.slice(
              0,
              charIndexRef.current,
            );
            return newLines;
          });
        }
      } else {
        waitingBetweenLinesRef.current = true;
        accumulatedTimeRef.current = 0;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(resetId);
      cancelAnimationFrame(rafId);
    };
  }, [
    prefersReducedMotion,
    enabled,
    lines,
    speed,
    delayBetweenLines,
    initialDelay,
    charsPerUpdate,
  ]);

  // Si reduced motion → afficher tout directement (pas de setState nécessaire)
  if (prefersReducedMotion) {
    return { text: lines.join("\n"), isComplete: true };
  }

  return {
    text: displayedLines.join("\n"),
    isComplete,
  };
}

// --------------------------------------------------------------------------
// Utilitaire pour formater le texte typewriter du Hero
// --------------------------------------------------------------------------
export function formatTerminalLines(profile: {
  firstName: string;
  lastName: string;
  role: string;
  status: string;
}): string[] {
  const fullName = `${profile.firstName} ${profile.lastName}`;
  return [
    "> whoami",
    fullName,
    "> role",
    profile.role,
    "> status",
    profile.status,
  ];
}
