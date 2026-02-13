import styles from "./Badge.module.scss";

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------
interface BadgeProps {
  label: string;
  variant?: "tech" | "status" | "custom";
  color?: string;
  className?: string;
}

// --------------------------------------------------------------------------
// Composant
// --------------------------------------------------------------------------
const Badge = ({
  label,
  variant = "tech",
  color,
  className,
}: BadgeProps) => {
  const classes = [
    styles.badge,
    styles[`badge--${variant}`],
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const customStyle = color ? { "--badge-color": color } as React.CSSProperties : undefined;

  return (
    <span className={classes} style={customStyle}>
      {label}
    </span>
  );
};

export default Badge;
