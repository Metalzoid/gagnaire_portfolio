"use client";

import { memo } from "react";
import { FaBriefcase, FaGraduationCap } from "@/components/ui/icons";
import { ExperienceDetailContent } from "./ExperienceDetailContent";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import type { Experience } from "shared";
import styles from "./TimelineItem.module.scss";

interface TimelineItemProps {
  item: Experience;
  index: number;
}

export const TimelineItem = memo(function TimelineItem({
  item,
  index,
}: TimelineItemProps) {
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
      <div className={styles.itemRow}>
        <div className={styles.dotCardGroup}>
          <div className={styles.dotWrapper}>
            <div className={styles.dot}>
              <Icon className={styles.dotIcon} aria-hidden="true" />
            </div>
          </div>
          <div className={styles.content}>
            <ExperienceDetailContent item={item} />
          </div>
        </div>
      </div>
    </li>
  );
});
