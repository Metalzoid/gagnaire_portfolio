"use client";

import { useRef, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AdminBreadcrumb } from "./AdminBreadcrumb";
import styles from "./AdminHeader.module.scss";

interface AdminHeaderProps {
  onMenuClick?: () => void;
  /** Contenu optionnel à afficher à droite */
  rightActions?: React.ReactNode;
}

function IconExternalLink() {
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
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
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
          <div className={styles.burgerMenu} ref={userMenuRef}>
            <button
              type="button"
              className={styles.burgerTrigger}
              onClick={() => setUserMenuOpen((v) => !v)}
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
              aria-label="Menu"
            >
              <span className={styles.burgerIcon} aria-hidden>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </span>
            </button>
            {userMenuOpen && (
              <div className={styles.userDropdown} role="menu">
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.userDropdownItem}
                  role="menuitem"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <span className={styles.externalLinkWrap}>
                    Voir le site
                    <IconExternalLink />
                  </span>
                </a>
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
        )}
      </div>
    </header>
  );
}
