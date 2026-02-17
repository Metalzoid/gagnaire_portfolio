"use client";

import { usePathname } from "next/navigation";
import { AdminBreadcrumb } from "./AdminBreadcrumb";
import styles from "./AdminHeader.module.scss";

interface AdminHeaderProps {
  onMenuClick?: () => void;
}

const titles: Record<string, string> = {
  "/admin": "Tableau de bord",
  "/admin/login": "Connexion",
  "/admin/projects": "Projets",
  "/admin/technologies": "Technologies",
  "/admin/skills": "Compétences",
  "/admin/experience": "Expériences",
  "/admin/testimonials": "Témoignages",
  "/admin/profile": "Profil",
};

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const pathname = usePathname();
  const title =
    titles[pathname ?? ""] ??
    Object.entries(titles)
      .filter(([path]) => pathname?.startsWith(path))
      .sort((a, b) => b[0].length - a[0].length)[0]?.[1] ??
    "Admin";

  return (
    <header className={styles.header}>
      {onMenuClick && (
        <button
          type="button"
          className={styles.menuButton}
          onClick={onMenuClick}
          aria-label="Ouvrir le menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      )}
      <AdminBreadcrumb />
      <h1 className={styles.title}>{title}</h1>
    </header>
  );
}
