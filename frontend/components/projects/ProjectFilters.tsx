"use client";

import { Tag } from "@/components/ui/tag";
import styles from "./ProjectFilters.module.scss";

interface ProjectFiltersProps {
  allTags: string[];
  selectedTags: Set<string>;
  onToggleTag: (tag: string) => void;
  onClear: () => void;
}

export function ProjectFilters({
  allTags,
  selectedTags,
  onToggleTag,
  onClear,
}: ProjectFiltersProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.tags}>
        {allTags.map((tag) => (
          <Tag
            key={tag}
            label={tag}
            active={selectedTags.has(tag)}
            onClick={() => onToggleTag(tag)}
          />
        ))}
        {selectedTags.size > 0 && (
          <Tag
            label="Tout afficher"
            onClick={onClear}
            className={styles.clearTag}
          />
        )}
      </div>
    </div>
  );
}
