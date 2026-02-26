"use client";

import { FaBriefcase, FaGraduationCap } from "@/components/ui/icons";
import { Tag } from "@/components/ui/tag";
import { TechIcon } from "@/utils/technologyIcon";
import { formatDateRange } from "@/utils/date";
import type { Experience } from "shared";
import styles from "./ExperienceDetailContent.module.scss";

interface ExperienceDetailContentProps {
  item: Experience;
}

/** Contenu détaillé d'une expérience (réutilisable dans la modale) */
export function ExperienceDetailContent({ item }: ExperienceDetailContentProps) {
  const Icon = item.type === "work" ? FaBriefcase : FaGraduationCap;

  return (
    <article className={styles.wrapper}>
      <div className={styles.dateRow}>
        <time className={styles.date}>
          {formatDateRange(item.startDate, item.endDate, item.current)}
        </time>
        {item.current && <Tag label="En cours" variant="status" />}
      </div>
      <h3 className={styles.title}>{item.title}</h3>
      {(item.company || item.location) && (
        <p className={styles.meta}>
          {item.company}
          {item.location && ` — ${item.location}`}
        </p>
      )}
      <p className={styles.description}>{item.description}</p>
      {item.technologies && item.technologies.length > 0 && (
        <div className={styles.techs}>
          {item.technologies.map((tech) => (
            <Tag
              key={tech.id}
              label={tech.name}
              variant="tech"
              icon={
                tech.icon ? (
                  <TechIcon icon={tech.icon} name={tech.name} size={16} />
                ) : undefined
              }
            />
          ))}
        </div>
      )}
      <span className={styles.iconDeco} aria-hidden="true">
        <Icon />
      </span>
    </article>
  );
}
