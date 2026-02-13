"use client";

import {
  FaReact,
  FaNode,
  FaGitAlt,
  FaHtml5,
  FaSass,
  FaDocker,
  FaCode,
  FaFigma,
  FaServer,
} from "react-icons/fa";
import {
  SiTypescript,
  SiPostgresql,
  SiNextdotjs,
  SiExpress,
} from "react-icons/si";
import type { SkillCategory as SkillCategoryType } from "@/types";
import { SkillItem } from "./SkillItem";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import styles from "./SkillCategory.module.scss";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FaReact,
  SiTypescript,
  FaHtml5,
  SiNextdotjs,
  FaSass,
  FaNode,
  SiExpress,
  SiPostgresql,
  FaServer,
  FaGitAlt,
  FaDocker,
  FaCode,
  FaFigma,
};

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
        {category.skills.map((skill) => {
          const IconComponent = skill.icon ? iconMap[skill.icon] : null;
          return (
            <SkillItem
              key={skill.name}
              skill={skill}
              icon={
                IconComponent ? (
                  <IconComponent className={styles.skillIcon} />
                ) : undefined
              }
            />
          );
        })}
      </div>
    </div>
  );
}
