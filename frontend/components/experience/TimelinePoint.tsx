"use client";

import { useRef } from "react";
import { FaBriefcase, FaGraduationCap } from "@/components/ui/icons";
import { formatMonthYear } from "@/utils/date";
import type { Experience } from "shared";
import styles from "./TimelinePoint.module.scss";

interface TimelinePointProps {
  item: Experience;
  onSelect: (item: Experience, originRect: DOMRect) => void;
}

export function TimelinePoint({ item, onSelect }: TimelinePointProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const Icon = item.type === "work" ? FaBriefcase : FaGraduationCap;
  const dateLabel = formatMonthYear(item.startDate);

  const handleClick = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      onSelect(item, rect);
    } else {
      onSelect(item, new DOMRect(0, 0, 0, 0));
    }
  };

  return (
    <li className={styles.wrapper}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.point}
        onClick={handleClick}
        aria-label={`Voir le détail : ${item.title}`}
        aria-haspopup="dialog"
      >
        <span className={styles.dot}>
          <Icon className={styles.dotIcon} aria-hidden="true" />
        </span>
        <span className={styles.label}>{dateLabel}</span>
      </button>
    </li>
  );
}
