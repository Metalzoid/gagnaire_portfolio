"use client";

import styles from "./Tag.module.scss";

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------
type TagVariant =
  | "default"
  | "accent"
  | "success"
  | "warning"
  | "error"
  | "info";

interface TagProps {
  label: string;
  active?: boolean;
  disabled?: boolean;
  variant?: TagVariant;
  className?: string;
  onClick?: () => void;
}

// --------------------------------------------------------------------------
// Composant
// --------------------------------------------------------------------------
const Tag = ({
  label,
  active = false,
  disabled = false,
  variant = "default",
  className,
  onClick,
}: TagProps) => {
  const classes = [
    styles.tag,
    active ? styles["tag--active"] : "",
    disabled ? styles["tag--disabled"] : "",
    variant !== "default" ? styles[`tag--${variant}`] : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  if (onClick && !disabled) {
    return (
      <button
        type="button"
        className={classes}
        onClick={onClick}
        aria-pressed={active}
        aria-label={`Filtrer par ${label}`}
      >
        {label}
      </button>
    );
  }

  return (
    <span
      className={classes}
      aria-disabled={disabled || undefined}
    >
      {label}
    </span>
  );
};

export default Tag;
