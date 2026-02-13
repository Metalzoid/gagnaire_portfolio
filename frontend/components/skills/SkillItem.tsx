import type { Skill } from "@/types";
import styles from "./SkillItem.module.scss";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {};
// Les icônes sont chargées dynamiquement dans SkillCategory

interface SkillItemProps {
  skill: Skill;
  icon?: React.ReactNode;
}

export function SkillItem({ skill, icon }: SkillItemProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <span className={styles.name}>{skill.name}</span>
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
}
