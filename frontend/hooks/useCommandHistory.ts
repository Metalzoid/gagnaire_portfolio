"use client";

import { useState, useCallback } from "react";

const MAX_HISTORY = 50;

export interface UseCommandHistoryReturn {
  history: string[];
  addToHistory: (command: string) => void;
  getPrevious: () => string | undefined;
  getNext: () => string | undefined;
  resetIndex: () => void;
  historyIndex: number;
}

/**
 * Gère l'historique des commandes (flèche haut = précédent, flèche bas = suivant).
 * N'enregistre que les commandes non vides et sans doublon consécutif.
 */
export function useCommandHistory(): UseCommandHistoryReturn {
  const [history, setHistory] = useState<string[]>([]);
  const [index, setIndex] = useState(-1);

  const addToHistory = useCallback((command: string) => {
    const trimmed = command.trim();
    if (!trimmed) return;

    setHistory((prev) => {
      const last = prev[prev.length - 1];
      if (last === trimmed) return prev;
      const next = [...prev, trimmed].slice(-MAX_HISTORY);
      return next;
    });
    setIndex(-1);
  }, []);

  const getPrevious = useCallback(() => {
    if (history.length === 0) return undefined;
    const nextIndex =
      index === -1 ? history.length - 1 : Math.max(0, index - 1);
    setIndex(nextIndex);
    return history[nextIndex];
  }, [history, index]);

  const getNext = useCallback(() => {
    if (history.length === 0 || index < 0) return undefined;
    const nextIndex = index >= history.length - 1 ? -1 : index + 1;
    setIndex(nextIndex);
    return nextIndex === -1 ? "" : history[nextIndex];
  }, [history, index]);

  const resetIndex = useCallback(() => setIndex(-1), []);

  return {
    history,
    addToHistory,
    getPrevious,
    getNext,
    resetIndex,
    historyIndex: index,
  };
}
