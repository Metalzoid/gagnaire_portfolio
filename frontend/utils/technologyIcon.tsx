"use client";

import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { getBackendImageUrl } from "@/services/api";
import {
  FaReact,
  FaNode,
  FaGitAlt,
  FaHtml5,
  FaSass,
  FaDocker,
  FaCode,
  FaFigma,
  FaServer,
  SiTypescript,
  SiPostgresql,
  SiNextdotjs,
  SiExpress,
  SiPrisma,
  SiTailwindcss,
  SiJavascript,
  SiRust,
  SiPython,
  SiSwift,
  SiKotlin,
  SiMongodb,
  SiRedis,
  SiAmazon,
  SiVercel,
  SiGraphql,
} from "@/components/ui/icons";
import type { IconType } from "@/components/ui/icons";

/** Sous-ensemble d'icônes react-icons pour l'affichage public (technologies, skills) */
const ICON_MAP: Record<string, IconType> = {
  FaReact,
  FaNode,
  FaGitAlt,
  FaHtml5,
  FaSass,
  FaDocker,
  FaCode,
  FaFigma,
  FaServer,
  SiTypescript,
  SiPostgresql,
  SiNextdotjs,
  SiExpress,
  SiPrisma,
  SiTailwindcss,
  SiJavascript,
  SiRust,
  SiPython,
  SiSwift,
  SiKotlin,
  SiMongodb,
  SiRedis,
  SiAmazon,
  SiVercel,
  SiGraphql,
};

function isImagePath(icon: string): boolean {
  return (
    icon.startsWith("/uploads/") ||
    icon.startsWith("/images/") ||
    icon.startsWith("http://") ||
    icon.startsWith("https://")
  );
}

/** Indique si une icône sera affichée (présente dans le map ou chemin image) */
export function canRenderTechIcon(icon?: string | null): boolean {
  if (!icon) return false;
  if (isImagePath(icon)) return true;
  return icon in ICON_MAP;
}

interface TechIconProps {
  icon?: string | null;
  name: string;
  size?: number;
  className?: string;
}

/**
 * Affiche l'icône d'une technologie : image uploadée ou react-icon.
 * Si icon est un chemin d'image (/uploads/..., http...), affiche une Image.
 * Sinon si c'est un nom react-icon connu, affiche l'icône.
 */
export function TechIcon({
  icon,
  name,
  size = 20,
  className,
}: TechIconProps): React.ReactNode {
  if (!icon) return null;

  if (isImagePath(icon)) {
    const url = getBackendImageUrl(icon);
    return (
      <ImageWithFallback
        src={url}
        alt={name}
        width={size}
        height={size}
        className={className}
        unoptimized
      />
    );
  }

  const IconComponent = ICON_MAP[icon];
  if (!IconComponent) return null;

  return <IconComponent size={size} className={className} aria-hidden />;
}
