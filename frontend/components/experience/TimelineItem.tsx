"use client";

import { FaBriefcase, FaGraduationCap } from "react-icons/fa";
import { Tag } from "@/components/ui/tag";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import type { Experience } from "@/types";
import styles from "./TimelineItem.module.scss";

interface TimelineItemProps {
  item: Experience;
  index: number;
}

function formatDateRange(
  startDate: string,
  endDate: string | null,
  current: boolean,
) {
  const [year, month] = startDate.split("-");
  const months: Record<string, string> = {
    "01": "Jan",
    "02": "Fév",
    "03": "Mar",
    "04": "Avr",
    "05": "Mai",
    "06": "Juin",
    "07": "Juil",
    "08": "Août",
    "09": "Sep",
    "10": "Oct",
    "11": "Nov",
    "12": "Déc",
  };
  const start = `${months[month] || month} ${year}`;
  const end = current
    ? "Présent"
    : endDate
      ? (() => {
          const [ey, em] = endDate.split("-");
          return `${months[em] || em} ${ey}`;
        })()
      : "";
  return end ? `${start} - ${end}` : start;
}

export function TimelineItem({ item, index }: TimelineItemProps) {
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
              <Tag key={tech} label={tech} variant="tech" />
            ))}
          </div>
        )}
      </div>
    </li>
  );
}
