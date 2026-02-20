"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useSnapScrollContext } from "@/contexts/SnapScrollContext";
import { useContactModal } from "@/contexts/ContactModalContext";
import { navigationLinks } from "@/data/navigation";
import styles from "./NavigationMenu.module.scss";

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------
interface NavigationMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mapping section id -> page dédiée (quand pas sur home)
const sectionToPage: Record<string, string> = {
  hero: "/",
  "a-propos": "/about",
  competences: "/skills",
  projets: "/projects",
  temoignages: "/#temoignages",
};

// --------------------------------------------------------------------------
// Composant
// --------------------------------------------------------------------------
const NavigationMenu = ({ isOpen, onClose }: NavigationMenuProps) => {
  const menuRef = useRef<HTMLElement>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const { sections, currentSection, goToSectionById } = useSnapScrollContext();
  const { openContactModal } = useContactModal();

  // Appliquer les classes "open" après mount pour lancer l'animation d'entrée
  useEffect(() => {
    if (isOpen && !isClosing) {
      const t = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(t);
    }
    if (!isOpen) {
      const t = requestAnimationFrame(() => setIsVisible(false));
      return () => cancelAnimationFrame(t);
    }
  }, [isOpen, isClosing]);

  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
  }, [isClosing]);

  const handleTransitionEnd = useCallback(
    (e: React.TransitionEvent<HTMLElement>) => {
      if (e.target !== menuRef.current || e.propertyName !== "transform")
        return;
      if (isClosing) {
        onClose();
      }
    },
    [isClosing, onClose],
  );

  // Focus trap : piège le focus dans le menu quand ouvert
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isOpen || !menuRef.current) return;

      if (event.key === "Tab") {
        const focusable = menuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === first) {
            event.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }
    },
    [isOpen],
  );

  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener("keydown", handleKeyDown);

    const timer = setTimeout(() => {
      if (menuRef.current) {
        const firstFocusable = menuRef.current.querySelector<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        firstFocusable?.focus();
      }
    }, 100);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen && !isClosing) return null;

  const overlayClass = [
    styles.overlay,
    isVisible && !isClosing ? styles["overlay--open"] : "",
    isClosing ? styles["overlay--closing"] : "",
  ]
    .filter(Boolean)
    .join(" ");

  const menuClass = [
    styles.menu,
    isVisible && !isClosing ? styles["menu--open"] : "",
    isClosing ? styles["menu--closing"] : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <div
        className={overlayClass}
        onClick={handleClose}
        onTransitionEnd={() => {
          if (isClosing) {
            // L'overlay disparaît en premier, on ne fait rien ici (le menu gère onClose)
          }
        }}
        aria-hidden="true"
      />

      <nav
        ref={menuRef}
        className={menuClass}
        role="navigation"
        aria-label="Menu principal"
        onTransitionEnd={handleTransitionEnd}
      >
        <ul className={styles.list}>
          {navigationLinks.map((item) => {
            if (item.type === "link") {
              const isCurrentPage = pathname === item.href;
              return (
                <li key={`link-${item.href}`} className={styles.item}>
                  <Link
                    href={item.href}
                    className={`${styles.link} ${
                      isCurrentPage ? styles["link--active"] : ""
                    }`}
                    onClick={onClose}
                    aria-current={isCurrentPage ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            }

            const section = sections.find((s) => s.id === item.id);
            if (!section) return null;

            const isActive =
              isHomePage && currentSection === sections.indexOf(section);
            const isContact = section.id === "contact";

            if (isContact) {
              return (
                <li key={section.id} className={styles.item}>
                  <button
                    type="button"
                    className={`${styles.link} ${
                      isActive ? styles["link--active"] : ""
                    }`}
                    onClick={() => {
                      openContactModal();
                      onClose();
                    }}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {section.label}
                  </button>
                </li>
              );
            }

            const href = sectionToPage[section.id] ?? `/#${section.id}`;
            const isCurrentPage = !isHomePage && pathname === href;
            const useLink = !isHomePage || isActive;

            return (
              <li key={section.id} className={styles.item}>
                {useLink ? (
                  <Link
                    href={href}
                    className={`${styles.link} ${
                      isActive || isCurrentPage
                        ? styles["link--active"]
                        : ""
                    }`}
                    onClick={onClose}
                    aria-current={
                      isActive || isCurrentPage ? "page" : undefined
                    }
                  >
                    {section.label}
                  </Link>
                ) : (
                  <button
                    type="button"
                    className={styles.link}
                    onClick={() => {
                      goToSectionById(section.id);
                      onClose();
                    }}
                  >
                    {section.label}
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        <div className={styles.footer}>
          <ThemeToggle />
        </div>
      </nav>
    </>
  );
};

export default NavigationMenu;
