"use client";

import { getExperience } from "@/services/data";
import { TimelineItem } from "./TimelineItem";
import { useMemo } from "react";
import styles from "./Timeline.module.scss";

export function Timeline() {
  const items = useMemo(() => getExperience(), []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.line} aria-hidden="true" />
      <ul className={styles.list}>
        {items.map((item, index) => (
          <TimelineItem
            key={`${item.type}-${item.title}-${index}`}
            item={item}
            index={index}
          />
        ))}
      </ul>
    </div>
  );
}
