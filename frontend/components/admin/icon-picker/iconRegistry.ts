// --------------------------------------------------------------------------
// Registre d'icônes react-icons (chargement dynamique, admin uniquement)
// --------------------------------------------------------------------------
import type { IconType } from "react-icons";

export type IconSet = "si" | "fa" | "md" | "fi";

export interface IconEntry {
  name: string;
  set: IconSet;
  component: IconType;
}

const SET_CONFIG: { module: string; prefix: string }[] = [
  { module: "react-icons/si", prefix: "Si" },
  { module: "react-icons/fa", prefix: "Fa" },
  { module: "react-icons/md", prefix: "Md" },
  { module: "react-icons/fi", prefix: "Fi" },
];

let cachedEntries: IconEntry[] | null = null;

function extractIcons(
  mod: Record<string, unknown>,
  set: IconSet,
  prefix: string,
): IconEntry[] {
  return Object.entries(mod)
    .filter(
      ([key]) =>
        key.startsWith(prefix) &&
        typeof mod[key] === "function" &&
        key.length > prefix.length,
    )
    .map(([name, comp]) => ({
      name,
      set,
      component: comp as IconType,
    }));
}

export async function loadAllIcons(): Promise<IconEntry[]> {
  if (cachedEntries) return cachedEntries;

  const sets: IconSet[] = ["si", "fa", "md", "fi"];
  const modules = await Promise.all(
    SET_CONFIG.map(({ module: m }) =>
      import(/* webpackChunkName: "react-icons-[request]" */ m).then(
        (mod) => (mod.default ?? mod) as Record<string, unknown>,
      ),
    ),
  );

  cachedEntries = SET_CONFIG.flatMap(({ prefix }, i) =>
    extractIcons(modules[i], sets[i], prefix),
  );

  return cachedEntries;
}

function getSetFromPrefix(name: string): IconSet {
  if (name.startsWith("Si")) return "si";
  if (name.startsWith("Fa")) return "fa";
  if (name.startsWith("Md")) return "md";
  if (name.startsWith("Fi")) return "fi";
  return "si";
}

export async function searchIcons(
  query: string,
  setFilter?: IconSet,
): Promise<IconEntry[]> {
  const all = await loadAllIcons();
  const q = query.trim().toLowerCase();
  let filtered = all;

  if (setFilter) {
    filtered = filtered.filter((e) => getSetFromPrefix(e.name) === setFilter);
  }
  if (q) {
    filtered = filtered.filter((e) => e.name.toLowerCase().includes(q));
  }

  return filtered.slice(0, 80);
}

/** Retourne l'icône par son nom (pour la preview, après loadAllIcons) */
export function getIconByName(name: string | null): IconEntry | null {
  if (!name || !cachedEntries) return null;
  return cachedEntries.find((e) => e.name === name) ?? null;
}
