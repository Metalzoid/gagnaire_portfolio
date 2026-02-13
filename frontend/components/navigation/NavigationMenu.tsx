"use client";

import { useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
// Note: "contact" ouvre la modal, pas de page dédiée
const sectionToPage: Record<string, string> = {
  hero: "/",
  "a-propos": "/about",
  competences: "/skills",
  projets: "/projects",
  temoignages: "/#temoignages",
};

// --------------------------------------------------------------------------
// Variantes framer-motion
// --------------------------------------------------------------------------
const menuVariants = {
  closed: {
    x: "100%",
    transition: {
      type: "tween" as const,
      duration: 0.3,
      ease: "easeIn" as const,
    },
  },
  open: {
    x: 0,
    transition: {
      type: "tween" as const,
      duration: 0.35,
      ease: "easeOut" as const,
    },
  },
};

const overlayVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
};

const linkVariants = {
  closed: { opacity: 0, x: 30 },
  open: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.1 + i * 0.05, duration: 0.25 },
  }),
};

// --------------------------------------------------------------------------
// Composant
// --------------------------------------------------------------------------
const NavigationMenu = ({ isOpen, onClose }: NavigationMenuProps) => {
  const menuRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const { sections, currentSection, goToSectionById } = useSnapScrollContext();
  const { openContactModal } = useContactModal();

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

  // Attacher le focus trap et focus initial
  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener("keydown", handleKeyDown);

    // Focus le premier élément focusable au montage
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className={styles.overlay}
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Menu */}
          <motion.nav
            ref={menuRef}
            className={styles.menu}
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            role="navigation"
            aria-label="Menu principal"
          >
            <ul className={styles.list}>
              {/* Ordre défini dans data/navigation.ts */}
              {navigationLinks.map((item, i) => {
                if (item.type === "link") {
                  return (
                    <motion.li
                      key={`link-${item.href}`}
                      className={styles.item}
                      variants={linkVariants}
                      initial="closed"
                      animate="open"
                      custom={i}
                    >
                      <Link
                        href={item.href}
                        className={styles.link}
                        onClick={onClose}
                      >
                        {item.label}
                      </Link>
                    </motion.li>
                  );
                }

                const section = sections.find((s) => s.id === item.id);
                if (!section) return null;

                const isActive = isHomePage && currentSection === sections.indexOf(section);
                const isContact = section.id === "contact";

                // Contact : toujours ouvrir la modal (pas de redirection)
                if (isContact) {
                  return (
                    <motion.li
                      key={section.id}
                      className={styles.item}
                      variants={linkVariants}
                      initial="closed"
                      animate="open"
                      custom={i}
                    >
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
                    </motion.li>
                  );
                }

                const href = sectionToPage[section.id] ?? `/#${section.id}`;
                // Sur home : scroll si autre section, sinon href (déjà sur la section)
                const useLink = !isHomePage || isActive;

                return (
                  <motion.li
                    key={section.id}
                    className={styles.item}
                    variants={linkVariants}
                    initial="closed"
                    animate="open"
                    custom={i}
                  >
                    {useLink ? (
                      <Link
                        href={href}
                        className={`${styles.link} ${
                          isActive ? styles["link--active"] : ""
                        }`}
                        onClick={onClose}
                        aria-current={isActive ? "page" : undefined}
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
                  </motion.li>
                );
              })}
            </ul>

            <div className={styles.footer}>
              <ThemeToggle />
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
};

export default NavigationMenu;
