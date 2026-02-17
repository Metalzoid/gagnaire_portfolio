"use client";

import styles from "./Tag.module.scss";

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------
type TagVariant =
  | "default"
  | "tech"
  | "status"
  | "accent"
  | "success"
  | "warning"
  | "error"
  | "info";

interface TagProps {
  label: string;
  icon?: React.ReactNode;
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
  icon,
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

  const content = (
    <>
      {icon && <span className={styles.iconWrapper}>{icon}</span>}
      {label}
    </>
  );

  if (onClick && !disabled) {
    return (
      <button
        type="button"
        className={classes}
        onClick={onClick}
        aria-pressed={active}
        aria-label={`Filtrer par ${label}`}
      >
        {content}
      </button>
    );
  }

  return (
    <span className={classes} aria-disabled={disabled || undefined}>
      {content}
    </span>
  );
};

export default Tag;
