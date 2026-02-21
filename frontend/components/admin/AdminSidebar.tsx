"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminApi } from "@/services/admin-api";
import styles from "./AdminSidebar.module.scss";

const iconSize = 20;

const IconDashboard = () => (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden
  >
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
);

const IconFolder = () => (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden
  >
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const IconBriefcase = () => (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden
  >
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" />
  </svg>
);

const IconQuote = () => (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden
  >
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2z" />
    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2z" />
  </svg>
);

const IconCode = () => (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const IconStar = () => (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const IconSparkles = () => (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden
  >
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    <path d="M18 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" />
  </svg>
);

const IconUser = () => (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconFile = () => (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const IconMail = () => (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const navSections = [
  {
    label: "Contenu",
    items: [
      { href: "/admin/projects", label: "Projets", icon: IconFolder },
      { href: "/admin/experience", label: "Expériences", icon: IconBriefcase },
      { href: "/admin/testimonials", label: "Témoignages", icon: IconQuote },
    ],
  },
  {
    label: "Demandes",
    items: [{ href: "/admin/contacts", label: "Contacts", icon: IconMail }],
  },
  {
    label: "Configuration",
    items: [
      { href: "/admin/technologies", label: "Technologies", icon: IconCode },
      { href: "/admin/skills", label: "Compétences", icon: IconStar },
    ],
  },
  {
    label: "Documents",
    items: [{ href: "/admin/cv", label: "CV", icon: IconFile }],
  },
  {
    label: "Paramètres",
    items: [
      { href: "/admin/profile", label: "Profil", icon: IconUser },
      { href: "/admin/ai", label: "IA", icon: IconSparkles, aiOnly: true as const },
    ],
  },
];

const dashboardItem = {
  href: "/admin",
  label: "Tableau de bord",
  icon: IconDashboard,
};

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [aiEnabled, setAiEnabled] = useState(false);

  useEffect(() => {
    adminApi.ai.getStatus().then((s) => setAiEnabled(s.enabled)).catch(() => {});
  }, []);

  const filteredSections = useMemo(
    () =>
      navSections
        .map((section) => ({
          ...section,
          items: section.items.filter(
            (item) => !("aiOnly" in item && item.aiOnly) || aiEnabled,
          ),
        }))
        .filter((section) => section.items.length > 0),
    [aiEnabled],
  );

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname?.startsWith(href);

  const handleNavClick = () => {
    onClose?.();
  };

  useEffect(() => {
    if (!isOpen || !onClose) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <>
      {onClose && (
        <div
          className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ""}`}
          onClick={onClose}
          aria-hidden={!isOpen}
        />
      )}
      <aside
        className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}
        aria-hidden={onClose && !isOpen}
      >
        <div className={styles.brand}>
          <Link href="/admin">Portfolio Admin</Link>
        </div>
        <nav className={styles.nav} aria-label="Navigation principale">
          <Link
            href={dashboardItem.href}
            className={`${styles.navItem} ${isActive(dashboardItem.href) ? styles.active : ""}`}
            onClick={handleNavClick}
          >
            <span className={styles.icon}>{<dashboardItem.icon />}</span>
            {dashboardItem.label}
          </Link>
          {filteredSections.map((section) => (
            <div key={section.label} className={styles.section}>
              <span className={styles.sectionLabel}>{section.label}</span>
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navItem} ${isActive(item.href) ? styles.active : ""}`}
                  onClick={handleNavClick}
                >
                  <span className={styles.icon}>{<item.icon />}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
