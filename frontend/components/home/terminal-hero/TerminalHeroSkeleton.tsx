import type { Profile } from "shared";
import styles from "./TerminalHero.module.scss";

// --------------------------------------------------------------------------
// Skeleton léger pour le chargement du TerminalHero (évite CLS)
// --------------------------------------------------------------------------
export interface TerminalHeroSkeletonProps {
  profile?: Profile;
}

export function TerminalHeroSkeleton({ profile }: TerminalHeroSkeletonProps) {
  const fullName = profile
    ? `${profile.firstName} ${profile.lastName}`
    : "...";
  const role = profile?.role ?? "...";

  return (
    <div className={styles.wrapper}>
      <div className={styles.terminal} data-focused="false">
        <div className={styles.titleBar}>
          <div className={styles.dots}>
            <span className={styles.dot} data-color="red" aria-hidden="true" />
            <span
              className={styles.dot}
              data-color="yellow"
              aria-hidden="true"
            />
            <span
              className={styles.dot}
              data-color="green"
              aria-hidden="true"
            />
          </div>
          <span className={styles.terminalTitle}>zsh</span>
        </div>
        <div className={styles.content}>
          <pre className={styles.output}>
            <span className={`${styles.line} ${styles.lineCommand}`}>
              &gt; whoami
            </span>
            <span className={`${styles.line} ${styles.lineResult}`}>
              {fullName}
            </span>
            <span className={`${styles.line} ${styles.lineCommand}`}>
              &gt; role
            </span>
            <span className={`${styles.line} ${styles.lineResult}`}>
              {role}
            </span>
          </pre>
        </div>
      </div>
      <div className={styles.ctas} aria-hidden="true">
        <div className={styles.skeletonBtn} />
        <div className={styles.skeletonBtn} />
      </div>
    </div>
  );
}
