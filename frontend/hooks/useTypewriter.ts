"use client";

import { useState, useEffect, useSyncExternalStore } from "react";

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
// Hook - Effet de frappe (typewriter)
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
  } = options;

  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  // Lecture safe de prefers-reduced-motion (compatible SSR)
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot,
  );

  // Démarrer l'animation après le délai initial
  useEffect(() => {
    if (prefersReducedMotion) return;

    const startTimer = setTimeout(() => {
      setHasStarted(true);
    }, initialDelay);

    return () => clearTimeout(startTimer);
  }, [prefersReducedMotion, initialDelay]);

  // Animation par batch de caractères (réduit les re-renders)
  useEffect(() => {
    if (prefersReducedMotion || !hasStarted) return;
    if (currentLineIndex >= lines.length) return;

    const currentLine = lines[currentLineIndex];
    const charsLeft = currentLine.length - currentCharIndex;

    if (charsLeft > 0) {
      const batchSize = Math.min(charsPerUpdate, charsLeft);
      const batchDelay = speed * batchSize;

      const timer = setTimeout(() => {
        setDisplayedLines((prev) => {
          const newLines = [...prev];
          if (!newLines[currentLineIndex]) {
            newLines[currentLineIndex] = "";
          }
          newLines[currentLineIndex] = currentLine.slice(
            0,
            currentCharIndex + batchSize,
          );
          return newLines;
        });
        setCurrentCharIndex((c) => c + batchSize);
      }, batchDelay);
      return () => clearTimeout(timer);
    }

    // Fin de la ligne actuelle, passer à la suivante
    const timer = setTimeout(() => {
      setCurrentLineIndex((l) => l + 1);
      setCurrentCharIndex(0);
    }, delayBetweenLines);

    return () => clearTimeout(timer);
  }, [
    prefersReducedMotion,
    hasStarted,
    currentLineIndex,
    currentCharIndex,
    lines,
    speed,
    delayBetweenLines,
    charsPerUpdate,
  ]);

  // Si reduced motion → afficher tout directement (pas de setState nécessaire)
  if (prefersReducedMotion) {
    return { text: lines.join("\n"), isComplete: true };
  }

  const isComplete = currentLineIndex >= lines.length;
  return { text: displayedLines.join("\n"), isComplete };
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
