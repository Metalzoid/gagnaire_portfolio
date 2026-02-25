import { memo } from "react";
import type { Skill } from "shared";
import styles from "./SkillItem.module.scss";

interface SkillItemProps {
  skill: Skill;
  icon?: React.ReactNode;
}

export const SkillItem = memo(function SkillItem({ skill, icon }: SkillItemProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          {icon && <span className={styles.icon}>{icon}</span>}
          <span className={styles.name}>{skill.name}</span>
        </div>
        <span className={styles.level}>{skill.level} %</span>
      </div>
      <div className={styles.progressWrapper}>
        <div
          className={styles.progressBar}
          style={{ width: `${skill.level}%` }}
          role="progressbar"
          aria-valuenow={skill.level}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${skill.name}: ${skill.level}%`}
        />
      </div>
    </div>
  );
});
