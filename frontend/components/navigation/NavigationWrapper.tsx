"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import useLockBodyScroll from "@/hooks/useLockBodyScroll";
import useKeyPress from "@/hooks/useKeyPress";
import BurgerButton from "./BurgerButton";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import Link from "next/link";
import styles from "./NavigationWrapper.module.scss";

const NavigationMenu = dynamic(() => import("./NavigationMenu"), {
  ssr: false,
});

interface NavigationWrapperProps {
  children: React.ReactNode;
}

const NavigationWrapper = ({ children }: NavigationWrapperProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  // Verrouiller le scroll quand le menu est ouvert
  useLockBodyScroll(menuOpen);

  // Fermer le menu avec Escape
  useKeyPress("Escape", closeMenu, menuOpen);

  return (
    <>
      {!isHome && (
        <Link
          href="/"
          className={styles.homeLink}
          aria-label="Retour à l'accueil"
        >
          <svg
            viewBox="0 0 576 512"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64A16 16 0 0 0 432 480l112-.29a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z" />
          </svg>
        </Link>
      )}
      <div className={styles.topBar}>
        <div className={styles.themeToggleDesktop}>
          <ThemeToggle />
        </div>
        <BurgerButton isOpen={menuOpen} onClick={toggleMenu} />
      </div>
      {menuOpen && (
        <NavigationMenu isOpen={menuOpen} onClose={closeMenu} />
      )}
      <div
        className={`${styles.content} ${
          menuOpen ? styles["content--shifted"] : ""
        }`}
      >
        {children}
      </div>
    </>
  );
};

export default NavigationWrapper;
