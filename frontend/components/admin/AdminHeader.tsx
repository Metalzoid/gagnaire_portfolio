"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { AdminBreadcrumb } from "./AdminBreadcrumb";
import styles from "./AdminHeader.module.scss";

interface AdminHeaderProps {
  onMenuClick?: () => void;
  /** Contenu optionnel à afficher à droite (recherche, etc.) */
  rightActions?: React.ReactNode;
}

function IconSearch() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconChevronDown() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg
      width="20"
      height="20"
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
}

export function AdminHeader({ onMenuClick, rightActions }: AdminHeaderProps) {
  const { logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [userMenuOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.left}>
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
      </div>

      <div className={styles.right}>
        {rightActions ?? (
          <>
            <div className={styles.searchSlot} aria-hidden>
              <span className={styles.searchIcon}>
                <IconSearch />
              </span>
              <span className={styles.searchPlaceholder}>
                Recherche (à venir)
              </span>
            </div>
            <div className={styles.userMenu} ref={userMenuRef}>
              <button
                type="button"
                className={styles.userTrigger}
                onClick={() => setUserMenuOpen((v) => !v)}
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
                aria-label="Menu utilisateur"
              >
                <span className={styles.userAvatar}>
                  <IconUser />
                </span>
                <span className={styles.userLabel}>Compte</span>
                <span className={styles.userChevron}>
                  <IconChevronDown />
                </span>
              </button>
              {userMenuOpen && (
                <div className={styles.userDropdown} role="menu">
                  <Link
                    href="/"
                    className={styles.userDropdownItem}
                    role="menuitem"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Voir le site
                  </Link>
                  <button
                    type="button"
                    className={styles.userDropdownItem}
                    role="menuitem"
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
