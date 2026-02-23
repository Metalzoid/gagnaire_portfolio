"use client";

import { memo } from "react";
import { FaBriefcase, FaGraduationCap } from "@/components/ui/icons";
import { Tag } from "@/components/ui/tag";
import { TechIcon } from "@/utils/technologyIcon";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { formatDateRange } from "@/utils/date";
import type { Experience } from "shared";
import styles from "./TimelineItem.module.scss";

interface TimelineItemProps {
  item: Experience;
  index: number;
}

export const TimelineItem = memo(function TimelineItem({ item, index }: TimelineItemProps) {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({
    threshold: 0.1,
  });
  const isLeft = index % 2 === 0;
  const Icon = item.type === "work" ? FaBriefcase : FaGraduationCap;

  return (
    <li
      className={`${styles.wrapper} ${styles[isLeft ? "wrapper--left" : "wrapper--right"]} ${isVisible ? styles["wrapper--visible"] : ""}`}
    >
      <div ref={ref} className={styles.observerTarget} aria-hidden="true" />
      <div className={styles.dotWrapper}>
        <div className={styles.dot}>
          <Icon className={styles.dotIcon} aria-hidden="true" />
        </div>
      </div>
      <div className={styles.content}>
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
      </div>
    </li>
  );
});
