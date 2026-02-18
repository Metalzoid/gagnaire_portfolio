"use client";

import { useCallback } from "react";
import {
  COMMANDS,
  getCommandNames,
  type TerminalContext,
} from "@/data/terminal-commands";

/**
 * Retourne les complétions possibles pour le dernier token de la ligne.
 * - Un seul mot : complétion des noms de commandes.
 * - Plusieurs mots : complétion des arguments via CommandDef.complete si disponible.
 */
function getCompletions(line: string, context: TerminalContext): string[] {
  const trimmed = line.trimStart();
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    const partial = (parts[0] ?? "").toLowerCase();
    if (!partial) return getCommandNames();
    return getCommandNames().filter((name) =>
      name.toLowerCase().startsWith(partial)
    );
  }

  const commandName = (parts[0] ?? "").toLowerCase();
  const partial = (parts[parts.length - 1] ?? "").toLowerCase();
  const cmd = COMMANDS.find((c) => c.name === commandName);
  if (!cmd?.complete) return [];

  const options = cmd.complete(partial, context);
  return options.filter((opt) =>
    opt.toLowerCase().startsWith(partial)
  );
}

/**
 * Calcule le plus long préfixe commun d'une liste de chaînes.
 */
function longestCommonPrefix(strings: string[]): string {
  if (strings.length === 0) return "";
  if (strings.length === 1) return strings[0]!;
  let prefix = strings[0] ?? "";
  for (let i = 1; i < strings.length; i++) {
    const s = strings[i] ?? "";
    while (!s.toLowerCase().startsWith(prefix.toLowerCase()) && prefix.length > 0) {
      prefix = prefix.slice(0, -1);
    }
  }
  return prefix;
}

export interface UseTabCompletionReturn {
  /**
   * Sur Tab : retourne la ligne complétée (un seul match ou préfixe commun),
   * ou null si rien à compléter.
   * Si plusieurs matchs et que le préfixe commun ne change pas la ligne, retourne
   * la liste des matchs pour affichage (comme "zsh" qui liste les fichiers).
   */
  complete: (line: string, context: TerminalContext) => {
    newLine: string;
    suggestions?: string[];
  } | null;
}

export function useTabCompletion(): UseTabCompletionReturn {
  const complete = useCallback(
    (
      line: string,
      context: TerminalContext
    ): { newLine: string; suggestions?: string[] } | null => {
      const completions = getCompletions(line, context);
      if (completions.length === 0) return null;

      const trimmed = line.trimStart();
      const parts = trimmed.split(/\s+/);
      const isCommand = parts.length <= 1;
      const partial = (isCommand ? parts[0] ?? "" : parts[parts.length - 1] ?? "").toLowerCase();
      const common = longestCommonPrefix(completions);

      if (completions.length === 1) {
        const single = completions[0]!;
        if (isCommand) {
          return { newLine: line.replace(/^\s*[\w-]*/i, single) };
        }
        const beforeLast = parts.slice(0, -1).join(" ");
        return { newLine: (beforeLast ? beforeLast + " " : "") + single };
      }

      if (common.length > partial.length) {
        if (isCommand) {
          return { newLine: line.replace(/^\s*[\w-]*/i, common) };
        }
        const beforeLast = parts.slice(0, -1).join(" ");
        return { newLine: (beforeLast ? beforeLast + " " : "") + common };
      }

      return { newLine: line, suggestions: completions };
    },
    []
  );

  return { complete };
}
