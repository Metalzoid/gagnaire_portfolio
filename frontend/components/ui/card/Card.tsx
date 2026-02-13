"use client";

import Link from "next/link";
import { ImageWithFallback, PLACEHOLDER_PROJECT_IMAGE } from "@/components/ui/image-with-fallback";
import { Tag } from "@/components/ui/tag";
import styles from "./Card.module.scss";

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------
interface CardProps {
  image?: string;
  title: string;
  description?: string;
  tags?: string[];
  href?: string;
  hoverable?: boolean;
  children?: React.ReactNode;
  className?: string;
}

// --------------------------------------------------------------------------
// Composant
// --------------------------------------------------------------------------
const Card = ({
  image,
  title,
  description,
  tags,
  href,
  hoverable = false,
  children,
  className,
}: CardProps) => {
  const classes = [
    styles.card,
    hoverable ? styles["card--hoverable"] : "",
    href ? styles["card--clickable"] : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {image && (
        <div className={styles.imageWrapper}>
          <ImageWithFallback
            src={image}
            fallbackSrc={PLACEHOLDER_PROJECT_IMAGE}
            alt={title}
            fill
            sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
            className={styles.image}
          />
        </div>
      )}
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.description}>{description}</p>}
        {tags && tags.length > 0 && (
          <div className={styles.tags}>
            {tags.map((tag) => (
              <Tag key={tag} label={tag} variant="tech" />
            ))}
          </div>
        )}
        {children}
      </div>
    </>
  );

  // Carte cliquable (lien)
  if (href) {
    return (
      <Link href={href} className={classes} aria-label={`Voir ${title}`}>
        {content}
      </Link>
    );
  }

  return (
    <article className={classes}>
      {content}
    </article>
  );
};

export default Card;
