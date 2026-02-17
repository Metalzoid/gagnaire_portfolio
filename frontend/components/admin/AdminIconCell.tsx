"use client";

import { useEffect, useState } from "react";
import { loadAllIcons, getIconByName } from "./icon-picker";
import { TechIcon } from "@/utils/technologyIcon";

interface AdminIconCellProps {
  icon: string | null;
  name: string;
  size?: number;
}

/**
 * Affiche l'icône d'une technologie dans l'admin.
 * Gère les images uploadées et toutes les icônes react-icons (via le registre).
 */
export function AdminIconCell({
  icon,
  name,
  size = 20,
}: AdminIconCellProps): React.ReactNode {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (icon && !icon.startsWith("/") && !icon.startsWith("http")) {
      loadAllIcons().then(() => setReady(true));
    } else {
      queueMicrotask(() => setReady(true));
    }
  }, [icon]);

  if (!icon) return null;

  // Images uploadées : utilisation directe de TechIcon
  if (
    icon.startsWith("/uploads/") ||
    icon.startsWith("/images/") ||
    icon.startsWith("http")
  ) {
    return <TechIcon icon={icon} name={name} size={size} />;
  }

  // Icônes react-icons : chargement via le registre
  if (!ready) {
    return <span>{icon}</span>;
  }

  const entry = getIconByName(icon);
  if (!entry) return <span>{icon}</span>;

  const IconComp = entry.component;
  return <IconComp size={size} aria-hidden />;
}
