"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./AdminBreadcrumb.module.scss";

const segmentLabels: Record<string, string> = {
  admin: "Admin",
  login: "Connexion",
  projects: "Projets",
  technologies: "Technologies",
  skills: "Compétences",
  experience: "Expériences",
  testimonials: "Témoignages",
  profile: "Profil",
  new: "Nouveau",
  edit: "Modifier",
};

export function AdminBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname?.split("/").filter(Boolean) ?? [];

  return (
    <nav aria-label="Fil d'Ariane" className={styles.breadcrumb}>
      {segments.map((seg, i) => {
        const href = "/" + segments.slice(0, i + 1).join("/");
        const label = segmentLabels[seg] ?? seg;
        const isLast = i === segments.length - 1;

        return (
          <span key={href}>
            {isLast ? (
              <span className={styles.current}>{label}</span>
            ) : (
              <Link href={href} className={styles.link}>
                {label}
              </Link>
            )}
            {!isLast && <span className={styles.sep}> / </span>}
          </span>
        );
      })}
    </nav>
  );
}
