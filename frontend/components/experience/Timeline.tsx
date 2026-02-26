"use client";

import { useState, useCallback } from "react";
import { TimelinePoint } from "./TimelinePoint";
import { ExperienceDetailModal } from "./ExperienceDetailModal";
import type { Experience } from "shared";
import styles from "./Timeline.module.scss";

function getTransformOriginFromRect(rect: DOMRect): string {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const x = (centerX / window.innerWidth) * 100;
  const y = (centerY / window.innerHeight) * 100;
  return `${x}% ${y}%`;
}

export function Timeline({ items }: { items: Experience[] }) {
  const [selectedItem, setSelectedItem] = useState<Experience | null>(null);
  const [transformOrigin, setTransformOrigin] = useState<string | undefined>();

  const handleSelect = useCallback((item: Experience, originRect: DOMRect) => {
    setTransformOrigin(getTransformOriginFromRect(originRect));
    setSelectedItem(item);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedItem(null);
    setTransformOrigin(undefined);
  }, []);

  return (
    <div className={styles.wrapper}>
      <ul className={styles.list} aria-label="Parcours professionnel et formation">
        {items.map((item, index) => (
          <TimelinePoint
            key={`${item.type}-${item.title}-${item.startDate}-${index}`}
            item={item}
            onSelect={handleSelect}
          />
        ))}
      </ul>
      <ExperienceDetailModal
        item={selectedItem}
        isOpen={selectedItem !== null}
        onClose={handleClose}
        transformOrigin={transformOrigin}
      />
    </div>
  );
}
