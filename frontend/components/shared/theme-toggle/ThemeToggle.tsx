"use client";

import { useTheme } from "@/hooks/useTheme";
import { FiSun, FiMoon } from "react-icons/fi";
import styles from "./ThemeToggle.module.scss";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
      title={isDark ? "Mode clair" : "Mode sombre"}
      type="button"
    >
      <span className={styles.icon} aria-hidden="true">
        {isDark ? <FiSun /> : <FiMoon />}
      </span>
    </button>
  );
};

export default ThemeToggle;
