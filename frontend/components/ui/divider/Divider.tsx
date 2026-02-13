"use client";

import styles from "./Divider.module.scss";

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------
interface DividerProps {
  variant?: "line" | "dots" | "gradient";
  className?: string;
}

// --------------------------------------------------------------------------
// Composant
// --------------------------------------------------------------------------
const Divider = ({ variant = "line", className }: DividerProps) => {
  const classes = [
    styles.divider,
    styles[`divider--${variant}`],
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  if (variant === "dots") {
    return (
      <div className={classes} role="presentation" aria-hidden="true">
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </div>
    );
  }

  return <hr className={classes} role="presentation" aria-hidden="true" />;
};

export default Divider;
