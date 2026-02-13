import styles from "./Section.module.scss";

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------
interface SectionProps {
  title?: string;
  id?: string;
  className?: string;
  snapTarget?: boolean;
  children: React.ReactNode;
}

// --------------------------------------------------------------------------
// Composant
// --------------------------------------------------------------------------
const Section = ({
  title,
  id,
  className,
  snapTarget = false,
  children,
}: SectionProps) => {
  const titleId = id ? `${id}-title` : undefined;

  const classes = [
    styles.section,
    snapTarget ? styles["section--snap"] : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      id={id}
      className={classes}
      aria-label={!title ? undefined : undefined}
      aria-labelledby={title ? titleId : undefined}
    >
      {title && (
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
      )}
      {children}
    </section>
  );
};

export default Section;
