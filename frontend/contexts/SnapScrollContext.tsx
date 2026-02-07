"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import type { SectionData } from "@/data/sections";

export interface SnapScrollContextType {
  currentSection: number;
  sections: SectionData[];
  goToSectionById: (id: string) => void;
  registerScrollHandler: (handler: (index: number) => void) => void;
  setCurrentSection: (index: number) => void;
}

const SnapScrollContext = createContext<SnapScrollContextType | null>(null);

interface SnapScrollProviderProps {
  children: React.ReactNode;
  sections: SectionData[];
}

export function SnapScrollProvider({
  children,
  sections,
}: SnapScrollProviderProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const scrollHandlerRef = useRef<((index: number) => void) | null>(null);

  const registerScrollHandler = useCallback(
    (handler: (index: number) => void) => {
      scrollHandlerRef.current = handler;
    },
    []
  );

  const goToSectionById = useCallback(
    (id: string) => {
      const index = sections.findIndex((section) => section.id === id);
      if (index === -1) return;

      // Si le handler n'est pas encore enregistré, ignorer (noop)
      if (!scrollHandlerRef.current) return;

      scrollHandlerRef.current(index);
    },
    [sections]
  );

  const value = useMemo<SnapScrollContextType>(
    () => ({
      currentSection,
      sections,
      goToSectionById,
      registerScrollHandler,
      setCurrentSection,
    }),
    [currentSection, sections, goToSectionById, registerScrollHandler]
  );

  return (
    <SnapScrollContext.Provider value={value}>
      {children}
    </SnapScrollContext.Provider>
  );
}

export function useSnapScrollContext(): SnapScrollContextType {
  const ctx = useContext(SnapScrollContext);
  if (!ctx) {
    throw new Error(
      "useSnapScrollContext doit être utilisé dans un SnapScrollProvider"
    );
  }
  return ctx;
}
