"use client";

import { useCallback, useEffect, useRef } from "react";
import { useSnapScrollContext } from "@/contexts/SnapScrollContext";

// Debounce : on échantillonne le pic de delta toutes les 100ms
// pour avoir une comparaison stable entre échantillons
const SAMPLE_INTERVAL_MS = 100;
// Après navigation, on ignore N échantillons (absorbe le ramp-up naturel du geste)
const GRACE_SAMPLES = 2;
// Delta minimum pour considérer un geste comme intentionnel
const MIN_GESTURE_DELTA = 15;
// Si le delta fait un bond de ce facteur pendant la montée → nouveau geste
const SPIKE_FACTOR = 4;
// Si aucun event pendant ce temps → reset complet (geste terminé)
const GAP_THRESHOLD_MS = 300;
// Après une navigation, on ignore les wheel pendant le scroll (évite double slide)
const NAV_COOLDOWN_MS = 450;

interface UseSnapScrollOptions {
  enabled?: boolean;
  totalSections: number;
}

interface UseSnapScrollReturn {
  currentSection: number;
  totalSections: number;
  goToSection: (index: number) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const useSnapScroll = ({
  enabled = true,
  totalSections,
}: UseSnapScrollOptions): UseSnapScrollReturn => {
  const context = useSnapScrollContext();
  // Unique source de vérité : le context (évite les rendus en cascade)
  const { currentSection, setCurrentSection } = context;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const currentSectionRef = useRef(0);

  // Refs pour la détection de geste basée sur la courbe
  const lastSampleTime = useRef(0);
  const windowMaxDelta = useRef(0);
  const prevSampleDelta = useRef(0);
  const wasDecreasing = useRef(false);
  const locked = useRef(false);
  const lastDirection = useRef(0);
  const samplesSinceLock = useRef(0);
  const lastNavigateTime = useRef(0);

  // Garder la ref en sync pour le wheel handler (pas de setState, juste une ref)
  useEffect(() => {
    currentSectionRef.current = currentSection;
  }, [currentSection]);

  // Retirer l'ancre de l'URL après un scroll (évite de garder #section dans la barre d'adresse)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [currentSection]);

  const goToSection = useCallback(
    (index: number) => {
      if (!containerRef.current || index < 0 || index >= totalSections) return;

      const sections = containerRef.current.querySelectorAll<HTMLElement>(
        "[data-snap-section]",
      );
      if (!sections[index]) return;

      setCurrentSection(index);
      sections[index].scrollIntoView({ behavior: "smooth" });
    },
    [totalSections, setCurrentSection],
  );

  // Enregistrer le handler dans le context au mount
  useEffect(() => {
    context.registerScrollHandler(goToSection);
  }, [context, goToSection]);

  // Interception molette / trackpad
  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;

    const navigate = (direction: number) => {
      lastNavigateTime.current = Date.now();
      goToSection(currentSectionRef.current + direction);
      samplesSinceLock.current = 0;
      wasDecreasing.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const deltaY = e.deltaY;
      if (deltaY === 0) return;

      const now = Date.now();

      // Ignorer les wheel pendant le cooldown (évite double slide après scrollIntoView)
      if (now - lastNavigateTime.current < NAV_COOLDOWN_MS) {
        lastSampleTime.current = now;
        return;
      }

      const absDelta = Math.abs(deltaY);
      const direction = deltaY > 0 ? 1 : -1;

      // Accumuler le pic de delta dans la fenêtre courante
      windowMaxDelta.current = Math.max(windowMaxDelta.current, absDelta);

      const elapsed = now - lastSampleTime.current;

      // Reset complet si long gap (aucun event → geste terminé)
      if (elapsed > GAP_THRESHOLD_MS) {
        locked.current = false;
      }

      // Pas encore temps d'échantillonner → accumuler seulement
      if (elapsed < SAMPLE_INTERVAL_MS) return;

      // === Prendre l'échantillon ===
      const sampleDelta = windowMaxDelta.current;
      const prevDelta = prevSampleDelta.current;
      lastSampleTime.current = now;
      windowMaxDelta.current = 0;

      // --- Pas verrouillé → premier geste, naviguer ---
      if (!locked.current) {
        locked.current = true;
        lastDirection.current = direction;
        prevSampleDelta.current = sampleDelta;
        navigate(direction);
        return;
      }

      samplesSinceLock.current++;

      // --- Direction inversée → toujours un nouveau geste ---
      if (
        direction !== lastDirection.current &&
        sampleDelta >= MIN_GESTURE_DELTA
      ) {
        lastDirection.current = direction;
        prevSampleDelta.current = sampleDelta;
        navigate(direction);
        return;
      }

      // --- Grace period : juste tracker la tendance sans analyser ---
      if (samplesSinceLock.current <= GRACE_SAMPLES) {
        if (sampleDelta < prevDelta) {
          wasDecreasing.current = true;
        }
        prevSampleDelta.current = sampleDelta;
        return;
      }

      // === Analyser la courbe ===
      const isIncreasing = sampleDelta > prevDelta;

      // Cas 1 : ça descendait (inertie), et ça remonte → nouveau geste
      if (
        wasDecreasing.current &&
        isIncreasing &&
        sampleDelta >= MIN_GESTURE_DELTA
      ) {
        lastDirection.current = direction;
        prevSampleDelta.current = sampleDelta;
        navigate(direction);
        return;
      }

      // Cas 2 : ça montait, et d'un coup ça monte BEAUCOUP → nouveau geste (spike)
      if (
        isIncreasing &&
        prevDelta > 0 &&
        sampleDelta > prevDelta * SPIKE_FACTOR &&
        sampleDelta >= MIN_GESTURE_DELTA
      ) {
        lastDirection.current = direction;
        prevSampleDelta.current = sampleDelta;
        navigate(direction);
        return;
      }

      // Mettre à jour la tendance
      if (sampleDelta < prevDelta) {
        wasDecreasing.current = true;
      }
      prevSampleDelta.current = sampleDelta;
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [enabled, goToSection]);

  // Intersection Observer
  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const sections = containerRef.current.querySelectorAll<HTMLElement>(
      "[data-snap-section]",
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(
              (entry.target as HTMLElement).dataset.snapIndex,
            );
            if (!isNaN(index)) {
              setCurrentSection(index);
            }
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.6,
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [enabled, totalSections, setCurrentSection]);

  // Navigation clavier
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (event.key === "ArrowDown" || event.key === "PageDown") {
        event.preventDefault();
        goToSection(currentSection + 1);
      } else if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        goToSection(currentSection - 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        goToSection(0);
      } else if (event.key === "End") {
        event.preventDefault();
        goToSection(totalSections - 1);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [enabled, currentSection, totalSections, goToSection]);

  // Support tactile (swipe) - touchstart / touchend pour mobile
  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;
      const threshold = 50;

      if (Math.abs(diff) > threshold) {
        const direction = diff > 0 ? 1 : -1;
        goToSection(currentSectionRef.current + direction);
      }
    };

    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [enabled, goToSection]);

  return {
    currentSection,
    totalSections,
    goToSection,
    containerRef,
  };
};

export default useSnapScroll;
