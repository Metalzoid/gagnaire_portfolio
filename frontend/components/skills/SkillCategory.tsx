"use client";

import type { SkillCategory as SkillCategoryType, Skill } from "shared";
import { SkillItem } from "./SkillItem";
import { TechIcon, canRenderTechIcon } from "@/utils/technologyIcon";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import styles from "./SkillCategory.module.scss";

interface SkillCategoryProps {
  category: SkillCategoryType;
}

export function SkillCategory({ category }: SkillCategoryProps) {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`${styles.wrapper} ${isVisible ? styles["wrapper--visible"] : ""}`}
    >
      <h3 className={styles.title}>{category.name}</h3>
      <div className={styles.list}>
        {category.skills.map((skill: Skill) => (
          <SkillItem
            key={skill.name}
            skill={skill}
            icon={
              canRenderTechIcon(skill.icon) ? (
                <TechIcon
                  icon={skill.icon!}
                  name={skill.name}
                  className={styles.skillIcon}
                />
              ) : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}
