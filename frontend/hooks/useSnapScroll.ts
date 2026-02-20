"use client";

import { useCallback, useEffect, useRef } from "react";
import { useSnapScrollContext } from "@/contexts/SnapScrollContext";

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
  const { currentSection, setCurrentSection } = context;
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Retirer l'ancre de l'URL après un scroll
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

  // IntersectionObserver — tracking passif de la section visible
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

  return {
    currentSection,
    totalSections,
    goToSection,
    containerRef,
  };
};

export default useSnapScroll;
