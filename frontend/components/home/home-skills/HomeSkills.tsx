"use client";

import { useMemo } from "react";
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
import { getSkills } from "@/services/data";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";
import styles from "./HomeSkills.module.scss";

// --------------------------------------------------------------------------
// Mapping icônes React Icons
// --------------------------------------------------------------------------
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

// --------------------------------------------------------------------------
// Composant
// --------------------------------------------------------------------------
export function HomeSkills() {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.2 });
  const skillsData = getSkills();

  const mainSkills = useMemo(() => {
    const skills: { name: string; icon: string }[] = [];
    for (const cat of skillsData) {
      for (const s of cat.skills) {
        if (s.icon && iconMap[s.icon]) {
          skills.push({ name: s.name, icon: s.icon });
          if (skills.length >= 8) break;
        }
      }
      if (skills.length >= 8) break;
    }
    return skills;
  }, [skillsData]);

  return (
    <div
      ref={ref}
      className={`${styles.wrapper} ${isVisible ? styles["wrapper--visible"] : ""}`}
    >
      <h2 className={styles.title}>Compétences</h2>
      <p className={styles.intro}>
        Technologies et outils que j&apos;utilise au quotidien.
      </p>
      <div className={styles.iconGrid}>
        {mainSkills.map((skill) => {
          const IconComponent = iconMap[skill.icon];
          return (
            <div
              key={skill.name}
              className={styles.iconItem}
              title={skill.name}
            >
              {IconComponent && (
                <IconComponent className={styles.icon} aria-hidden="true" />
              )}
              <span className={styles.iconLabel}>{skill.name}</span>
            </div>
          );
        })}
      </div>
      <div className={styles.cta}>
        <Button
          href="/skills"
          variant="outline"
          ariaLabel="Toutes mes compétences"
        >
          Toutes mes compétences
        </Button>
      </div>
    </div>
  );
}
