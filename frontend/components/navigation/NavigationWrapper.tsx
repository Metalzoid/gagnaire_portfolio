"use client";

import { useCallback, useState } from "react";
import useLockBodyScroll from "@/hooks/useLockBodyScroll";
import useKeyPress from "@/hooks/useKeyPress";
import BurgerButton from "./BurgerButton";
import NavigationMenu from "./NavigationMenu";
import styles from "./NavigationWrapper.module.scss";

interface NavigationWrapperProps {
  children: React.ReactNode;
}

const NavigationWrapper = ({ children }: NavigationWrapperProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

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
      <BurgerButton isOpen={menuOpen} onClick={toggleMenu} />
      <NavigationMenu isOpen={menuOpen} onClose={closeMenu} />
      <div
        className={`${styles.content} ${menuOpen ? styles["content--shifted"] : ""}`}
      >
        {children}
      </div>
    </>
  );
};

export default NavigationWrapper;
