"use client";

import styles from "./Skeleton.module.scss";

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------
interface SkeletonProps {
  width?: string;
  height?: string;
  variant?: "text" | "circle" | "rect";
  className?: string;
}

// --------------------------------------------------------------------------
// Composant
// --------------------------------------------------------------------------
const Skeleton = ({
  width,
  height,
  variant = "rect",
  className,
}: SkeletonProps) => {
  const classes = [
    styles.skeleton,
    styles[`skeleton--${variant}`],
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const style: React.CSSProperties = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div
      className={classes}
      style={style}
      role="presentation"
      aria-hidden="true"
    />
  );
};

export default Skeleton;
