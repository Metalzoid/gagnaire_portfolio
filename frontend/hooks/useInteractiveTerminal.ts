"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  executeCommand,
  type TerminalContext,
  type TerminalAction,
} from "@/data/terminal-commands";
import { useCommandHistory } from "./useCommandHistory";
import { useTabCompletion } from "./useTabCompletion";
import type { TerminalCommandResult } from "@/data/terminal-commands";

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------

export type TerminalDisplayLine =
  | { type: "command"; text: string }
  | { type: "output"; lines: string[] };

export interface TerminalActions {
  goToSectionById: (sectionId: string) => void;
  openContactModal: () => void;
}

export type EasterTrigger = "glitch" | null;

export interface UseInteractiveTerminalReturn {
  input: string;
  setInput: (value: string) => void;
  /** Lignes à afficher (commandes + sorties) */
  displayLines: TerminalDisplayLine[];
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  /** Après une commande "cd" avec choix, afficher "Tapez 1 ou 2" ; le hook gère 1/2 en interne */
  pendingChoice: TerminalAction & { type: "pendingChoice" } | null;
  /** À afficher en overlay (glitch) ; le composant appelle clearEasterTrigger après l'animation */
  easterTrigger: EasterTrigger;
  clearEasterTrigger: () => void;
  /** true après une commande clear : le composant n’affiche plus que le prompt */
  hasCleared: boolean;
  /** Pour focus programmatique */
  focusInput: () => void;
}

// --------------------------------------------------------------------------
// Hook
// --------------------------------------------------------------------------

export function useInteractiveTerminal(
  context: TerminalContext,
  actions: TerminalActions
): UseInteractiveTerminalReturn {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [input, setInput] = useState("");
  const [displayLines, setDisplayLines] = useState<TerminalDisplayLine[]>([]);
  const [pendingChoice, setPendingChoice] = useState<
    (TerminalAction & { type: "pendingChoice" }) | null
  >(null);
  const pendingChoiceRef = useRef<
    (TerminalAction & { type: "pendingChoice" }) | null
  >(null);
  const [easterTrigger, setEasterTrigger] = useState<EasterTrigger>(null);
  const [hasCleared, setHasCleared] = useState(false);

  useEffect(() => {
    pendingChoiceRef.current = pendingChoice;
  }, [pendingChoice]);

  const { addToHistory, getPrevious, getNext, resetIndex } = useCommandHistory();
  const { complete: tabComplete } = useTabCompletion();

  const runAction = useCallback(
    (action: TerminalAction | undefined) => {
      if (!action) return;
      switch (action.type) {
        case "scroll":
          actions.goToSectionById(action.sectionId);
          break;
        case "navigate":
          router.push(action.path);
          break;
        case "contact":
          actions.openContactModal();
          break;
        case "openUrl":
          if (typeof window !== "undefined") window.open(action.url, "_blank");
          break;
        case "easterGlitch":
          setEasterTrigger("glitch");
          break;
        case "pendingChoice":
          pendingChoiceRef.current = action;
          setPendingChoice(action);
          break;
      }
    },
    [actions, router]
  );

  const submitCommand = useCallback(
    (cmdInput: string) => {
      const trimmed = cmdInput.trim();
      const choice = pendingChoiceRef.current ?? pendingChoice;

      if (choice?.type === "pendingChoice") {
        const first = trimmed.charAt(0);
        const idx = first === "1" ? 0 : first === "2" ? 1 : -1;
        if (idx >= 0 && choice.options[idx]) {
          const option = choice.options[idx];
          if (option) {
            runAction(option);
            setDisplayLines((prev) => [
              ...prev,
              { type: "command", text: trimmed },
              { type: "output", lines: ["→ OK"] },
            ]);
          }
          pendingChoiceRef.current = null;
          setPendingChoice(null);
          setInput("");
          return;
        }
        pendingChoiceRef.current = null;
        setPendingChoice(null);
      }

      if (!trimmed) {
        setDisplayLines((prev) => [
          ...prev,
          { type: "command", text: "" },
          { type: "output", lines: [] },
        ]);
        setInput("");
        return;
      }

      const result: TerminalCommandResult = executeCommand(trimmed, context);
      addToHistory(trimmed);

      if (trimmed.toLowerCase() === "clear") {
        setHasCleared(true);
        setDisplayLines([]);
      } else {
        setDisplayLines((prev) => [
          ...prev,
          { type: "command", text: trimmed },
          ...(result.lines.length > 0
            ? [{ type: "output" as const, lines: result.lines }]
            : []),
        ]);
      }

      if (result.action) runAction(result.action);

      if (result.lines.length === 0 && result.action?.type === "easterGlitch") {
        // clear ne vide pas l'écran ici, mais rm -rf affiche "Nice try." donc on a des lines
      }

      setInput("");
    },
    [context, pendingChoice, runAction, addToHistory]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "Enter":
          e.preventDefault();
          submitCommand(input);
          resetIndex();
          break;
        case "ArrowUp":
          e.preventDefault();
          {
            const prev = getPrevious();
            if (prev !== undefined) setInput(prev);
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          {
            const next = getNext();
            setInput(next ?? "");
          }
          break;
        case "Tab":
          e.preventDefault();
          {
            const result = tabComplete(input, context);
            if (result) {
              setInput(result.newLine);
              if (result.suggestions?.length) {
                setDisplayLines((prev) => [
                  ...prev,
                  { type: "output", lines: result.suggestions! },
                ]);
              }
            }
          }
          break;
      }
    },
    [
      input,
      context,
      submitCommand,
      resetIndex,
      getPrevious,
      getNext,
      tabComplete,
    ]
  );

  const clearEasterTrigger = useCallback(() => setEasterTrigger(null), []);
  const focusInput = useCallback(() => inputRef.current?.focus(), []);

  return {
    input,
    setInput,
    displayLines,
    onKeyDown: handleKeyDown,
    inputRef,
    pendingChoice:
      pendingChoice?.type === "pendingChoice" ? pendingChoice : null,
    easterTrigger,
    clearEasterTrigger,
    hasCleared,
    focusInput,
  };
}
