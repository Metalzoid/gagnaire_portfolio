"use client";

import styles from "./BurgerButton.module.scss";

interface BurgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const BurgerButton = ({ isOpen, onClick }: BurgerButtonProps) => {
  return (
    <button
      className={`${styles.burger} ${isOpen ? styles["burger--open"] : ""}`}
      onClick={onClick}
      aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu de navigation"}
      aria-expanded={isOpen}
      type="button"
    >
      <span className={styles.bar} aria-hidden="true" />
      <span className={styles.bar} aria-hidden="true" />
      <span className={styles.bar} aria-hidden="true" />
    </button>
  );
};

export default BurgerButton;
