"use client";

import Skeleton from "@/components/ui/skeleton/Skeleton";
import styles from "./SkillRadar.module.scss";

/**
 * Skeleton pour le radar chart pendant le lazy load.
 * Dimensions fixes pour éviter le CLS.
 */
export function SkillRadarSkeleton() {
  return (
    <div className={`${styles.wrapper} ${styles["wrapper--visible"]}`}>
      <Skeleton
        height="28px"
        width="120px"
        variant="text"
        className={styles.categoryTitle}
      />
      <div className={styles.chartWrapper} style={{ minHeight: 280 }}>
        <Skeleton height="280px" width="100%" variant="rect" />
      </div>
    </div>
  );
}
