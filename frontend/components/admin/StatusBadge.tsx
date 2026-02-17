"use client";

import styles from "./StatusBadge.module.scss";

type Variant = "featured" | "current" | "work" | "education" | "default";

interface StatusBadgeProps {
  children: React.ReactNode;
  variant?: Variant;
}

export function StatusBadge({ children, variant = "default" }: StatusBadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[`badge--${variant}`]}`}>
      {children}
    </span>
  );
}
