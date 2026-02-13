"use client";

import Link from "next/link";
import styles from "./Button.module.scss";

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------
interface ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
  className?: string;
  type?: "button" | "submit" | "reset";
}

// --------------------------------------------------------------------------
// Spinner pour l'état loading
// --------------------------------------------------------------------------
const Spinner = () => (
  <span className={styles.spinner} aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="31.4 31.4"
      />
    </svg>
  </span>
);

// --------------------------------------------------------------------------
// Composant
// --------------------------------------------------------------------------
const Button = ({
  variant = "primary",
  size = "md",
  href,
  icon,
  loading = false,
  disabled = false,
  children,
  onClick,
  ariaLabel,
  className,
  type = "button",
}: ButtonProps) => {
  const isDisabled = disabled || loading;

  const classes = [
    styles.button,
    styles[`button--${variant}`],
    styles[`button--${size}`],
    loading ? styles["button--loading"] : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {loading && <Spinner />}
      {icon && !loading && <span className={styles.icon}>{icon}</span>}
      <span className={loading ? styles.hiddenText : ""}>{children}</span>
    </>
  );

  // Rendu en tant que Link si href est fourni
  if (href && !isDisabled) {
    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
    >
      {content}
    </button>
  );
};

export default Button;
