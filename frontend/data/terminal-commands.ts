// ==========================================================================
// Registre des commandes du terminal hero (desktop)
// ==========================================================================

import type { Profile } from "shared";
import type { SkillCategory } from "shared";
import type { Project } from "shared";

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------

export type TerminalAction =
  | { type: "scroll"; sectionId: string }
  | { type: "navigate"; path: string }
  | { type: "contact" }
  | { type: "openUrl"; url: string }
  | {
      type: "pendingChoice";
      options: Array<
        { type: "scroll"; sectionId: string } | { type: "navigate"; path: string }
      >;
    }
  | { type: "easterGlitch" };

export interface TerminalCommandResult {
  lines: string[];
  action?: TerminalAction;
}

export interface TerminalContext {
  profile: Profile;
  skills: SkillCategory[];
  topProjects: Project[];
}

export type CommandExecutor = (
  args: string[],
  context: TerminalContext
) => TerminalCommandResult;

export interface CommandDef {
  name: string;
  description: string;
  execute: CommandExecutor;
  /** Pour l'autocomplétion (ex: "cd" -> ["a-propos", "projects", ...]) */
  complete?: (partial: string, context: TerminalContext) => string[];
}

// Mapping cd: nom saisi -> section id (home) et/ou path (page)
const CD_SECTION_MAP: Record<string, { sectionId?: string; path?: string }> = {
  about: { sectionId: "a-propos", path: "/about" },
  skills: { sectionId: "competences", path: "/skills" },
  projects: { sectionId: "projets", path: "/projects" },
  testimonials: { sectionId: "temoignages" },
  contact: { sectionId: "contact" },
  experience: { path: "/experience" },
  hero: { sectionId: "hero" },
  "~": { sectionId: "hero" },
  "..": { sectionId: "hero" },
};

const LS_ENTRIES = [
  "about",
  "skills",
  "projects",
  "testimonials",
  "contact",
  "experience",
];

// --------------------------------------------------------------------------
// Commandes
// --------------------------------------------------------------------------

function helpCmd(): TerminalCommandResult {
  return {
    lines: [
      "Commandes disponibles :",
      "  help              Afficher cette aide",
      "  ls                Lister les sections / pages",
      "  cd <cible>        Aller à une section ou une page",
      "  cat <fichier>     Afficher un fichier (README.md, about.txt, skills.txt, projects.txt, contact.txt)",
      "  clear             Effacer l'écran",
      "  open <réseau>     Ouvrir un lien (github, linkedin, ...)",
    ],
  };
}

function lsCmd(): TerminalCommandResult {
  return {
    lines: [LS_ENTRIES.join("  ")],
  };
}

function cdCmd(
  args: string[],
  context: TerminalContext
): TerminalCommandResult {
  void context; // réservé pour usage futur (filtrage par section)
  const target = args[0]?.toLowerCase().trim();
  if (!target) {
    return { lines: ["cd: indiquez une cible (ex: cd projects)"] };
  }

  const mapping = CD_SECTION_MAP[target];
  if (!mapping) {
    return {
      lines: [
        `cd: no such file or directory: ${target}`,
        "Cibles : about, skills, projects, testimonials, contact, experience",
      ],
    };
  }

  const hasSection = !!mapping.sectionId;
  const hasPage = !!mapping.path;

  if (hasSection && hasPage) {
    return {
      lines: [
        "[1] Aller à la section sur cette page (scroll)",
        "[2] Ouvrir la page dédiée",
        "Tapez 1 ou 2 :",
      ],
      action: {
        type: "pendingChoice",
        options: [
          { type: "scroll", sectionId: mapping.sectionId! },
          { type: "navigate", path: mapping.path! },
        ],
      },
    };
  }

  if (hasSection) {
    return {
      lines: [`→ Section "${target}"`],
      action: { type: "scroll", sectionId: mapping.sectionId! },
    };
  }

  if (hasPage) {
    return {
      lines: [`→ Ouverture de ${mapping.path}`],
      action: { type: "navigate", path: mapping.path! },
    };
  }

  return { lines: [] };
}

function catCmd(args: string[], context: TerminalContext): TerminalCommandResult {
  const file = args[0]?.toLowerCase().trim();
  if (!file) {
    return { lines: ["cat: indiquez un fichier (ex: cat README.md)"] };
  }

  const { profile, skills, topProjects } = context;

  switch (file) {
    case "readme.md":
    case "readme": {
      const name = `${profile.firstName} ${profile.lastName}`;
      return {
        lines: [
          `# ${name}`,
          "",
          profile.role,
          "",
          profile.status,
          "",
          profile.bio || "(Pas de bio)",
        ],
      };
    }
    case "about.txt":
    case "about": {
      const { pitch } = profile;
      return {
        lines: [
          "=== Qui suis-je ===",
          pitch.who || "(vide)",
          "",
          "=== Ce que je fais ===",
          pitch.what || "(vide)",
          "",
          "=== Pourquoi ===",
          pitch.why || "(vide)",
          "",
          "=== Ma méthode ===",
          pitch.method || "(vide)",
        ],
      };
    }
    case "skills.txt":
    case "skills": {
      const lines: string[] = [];
      for (const cat of skills) {
        lines.push(`${cat.name}:`);
        for (const s of cat.skills) {
          lines.push(`  - ${s.name}`);
        }
        lines.push("");
      }
      return { lines: lines.length ? lines : ["(Aucune compétence)"] };
    }
    case "projects.txt":
    case "projects": {
      const lines: string[] = [];
      for (const p of topProjects) {
        const techs = p.technologies?.map((t) => t.name).join(", ") || "";
        lines.push(`${p.title}`);
        lines.push(`  ${p.description}`);
        if (techs) lines.push(`  Tech: ${techs}`);
        lines.push("");
      }
      return { lines: lines.length ? lines : ["(Aucun projet mis en avant)"] };
    }
    case "contact.txt":
    case "contact": {
      const lines: string[] = ["Réseaux :"];
      if (profile.social?.length) {
        for (const s of profile.social) {
          lines.push(`  ${s.label}: ${s.url}`);
        }
      } else {
        lines.push("  (Aucun lien configuré)");
      }
      return { lines };
    }
    default:
      return { lines: [`cat: ${file}: No such file or directory`] };
  }
}

function clearCmd(): TerminalCommandResult {
  return { lines: [] };
}

function openCmd(args: string[], context: TerminalContext): TerminalCommandResult {
  const network = args[0]?.toLowerCase().trim();
  if (!network) {
    return {
      lines: [
        "open: indiquez un réseau (ex: open github)",
        "Réseaux: " +
          (context.profile.social?.map((s) => s.label.toLowerCase()).join(", ") ||
            "aucun"),
      ],
    };
  }

  const link = context.profile.social?.find(
    (s) => s.label.toLowerCase() === network
  );
  if (!link) {
    return {
      lines: [
        `open: réseau inconnu "${network}"`,
        "Réseaux: " +
          (context.profile.social?.map((s) => s.label.toLowerCase()).join(", ") ||
            "aucun"),
      ],
    };
  }

  return {
    lines: [`→ Ouverture de ${link.label}`],
    action: { type: "openUrl", url: link.url },
  };
}

// Easter eggs
function sudoCmd(args: string[]): TerminalCommandResult {
  return {
    lines: [
      args.length
        ? `sudo: ${args.join(" ")}: Permission refusée. Vous n'êtes pas root ici. 😏`
        : "sudo: vous devez spécifier une commande",
    ],
  };
}

function rmRfCmd(): TerminalCommandResult {
  return {
    lines: ["Nice try."],
    action: { type: "easterGlitch" },
  };
}

// --------------------------------------------------------------------------
// Parsing et registre
// --------------------------------------------------------------------------

export const COMMANDS: CommandDef[] = [
  {
    name: "help",
    description: "Afficher l'aide",
    execute: () => helpCmd(),
  },
  {
    name: "ls",
    description: "Lister les sections",
    execute: () => lsCmd(),
    complete: () => [],
  },
  {
    name: "cd",
    description: "Changer de section/page",
    execute: cdCmd,
    complete: () =>
      Object.keys(CD_SECTION_MAP).filter((k) => k !== ".." && k !== "~"),
  },
  {
    name: "cat",
    description: "Afficher un fichier",
    execute: catCmd,
    complete: () => [
      "README.md",
      "about.txt",
      "skills.txt",
      "projects.txt",
      "contact.txt",
    ],
  },
  {
    name: "clear",
    description: "Effacer l'écran",
    execute: () => clearCmd(),
  },
  {
    name: "open",
    description: "Ouvrir un lien (github, linkedin...)",
    execute: openCmd,
    complete: (_partial, context) =>
      context.profile.social?.map((s) => s.label.toLowerCase()) ?? [],
  },
  {
    name: "sudo",
    description: "(easter egg)",
    execute: (args) => sudoCmd(args),
  },
  {
    name: "rm",
    description: "(easter egg)",
    execute: (args) => {
      if (args[0] === "-rf" && args[1] === "/") return rmRfCmd();
      return { lines: ["rm: usage: rm -rf /"] };
    },
  },
];

export function parseCommand(input: string): { name: string; args: string[] } {
  const trimmed = input.trim();
  if (!trimmed) return { name: "", args: [] };
  const parts = trimmed.split(/\s+/);
  const name = parts[0]?.toLowerCase() ?? "";
  const args = parts.slice(1);
  return { name, args };
}

export function executeCommand(
  input: string,
  context: TerminalContext
): TerminalCommandResult {
  const { name, args } = parseCommand(input);
  if (!name) return { lines: [] };

  const cmd = COMMANDS.find((c) => c.name === name);
  if (!cmd) {
    return {
      lines: [
        `zsh: command not found: ${name}. Tapez 'help' pour l'aide.`,
      ],
    };
  }

  return cmd.execute(args, context);
}

/** Liste des noms de commandes pour autocomplétion */
export function getCommandNames(): string[] {
  return COMMANDS.map((c) => c.name);
}
