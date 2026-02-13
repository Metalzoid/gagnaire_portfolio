import styles from "./Container.module.scss";

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------
interface ContainerProps {
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
}

// --------------------------------------------------------------------------
// Composant
// --------------------------------------------------------------------------
const Container = ({
  as: Component = "div",
  className,
  children,
}: ContainerProps) => {
  const classes = [styles.container, className].filter(Boolean).join(" ");

  return <Component className={classes}>{children}</Component>;
};

export default Container;
