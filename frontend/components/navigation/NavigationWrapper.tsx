"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useLockBodyScroll from "@/hooks/useLockBodyScroll";
import useKeyPress from "@/hooks/useKeyPress";
import BurgerButton from "./BurgerButton";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import Image from "next/image";
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
          <Image
            src="/icon.svg"
            alt=""
            width={20}
            height={20}
            aria-hidden
          />
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
