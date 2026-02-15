"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import type { SkillCategory, Skill } from "@/types";
import styles from "./SkillRadar.module.scss";

// --------------------------------------------------------------------------
// Données pour un radar par catégorie (max 6 compétences)
// --------------------------------------------------------------------------
function getRadarData(category: SkillCategory) {
  return category.skills
    .filter((s: Skill) => s.level !== undefined)
    .slice(0, 6)
    .map((s: Skill) => ({ name: s.name, value: s.level, fullMark: 100 }));
}

// --------------------------------------------------------------------------
// Couleurs palette Dracula
// --------------------------------------------------------------------------
const COLORS = {
  fill: "var(--color-accent-primary)",
  stroke: "var(--color-accent-primary)",
};

export function SkillRadar({ category }: { category: SkillCategory }) {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.2 });
  const data = getRadarData(category);

  if (data.length === 0) return null;

  return (
    <div
      ref={ref}
      className={`${styles.wrapper} ${isVisible ? styles["wrapper--visible"] : ""}`}
    >
      <h3 className={styles.categoryTitle}>{category.name}</h3>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart
            data={data}
            cx="50%"
            cy="50%"
            outerRadius="80%"
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <PolarGrid stroke="var(--color-chart-grid-inactive)" />
            <PolarAngleAxis
              dataKey="name"
              tick={{ fill: "var(--color-text-secondary)", fontSize: 11 }}
            />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
            <Radar
              name={category.name}
              dataKey="value"
              stroke={COLORS.stroke}
              fill={COLORS.fill}
              fillOpacity={0.5}
              strokeWidth={2.5}
              isAnimationActive={isVisible}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
