"use client";

import { TimelineItem } from "./TimelineItem";
import type { Experience } from "shared";
import styles from "./Timeline.module.scss";

export function Timeline({ items }: { items: Experience[] }) {

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
