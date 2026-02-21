import styles from "./TerminalHero.module.scss";

// --------------------------------------------------------------------------
// Skeleton léger pour le chargement du TerminalHero (évite CLS)
// Contenu vide : uniquement le cadre du terminal, pas de texte placeholder
// --------------------------------------------------------------------------
export function TerminalHeroSkeleton() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.terminal}>
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
          <pre className={styles.output} aria-busy="true" />
        </div>
      </div>
      <div className={styles.ctas} aria-hidden="true">
        <div className={styles.skeletonBtn} />
        <div className={styles.skeletonBtn} />
      </div>
    </div>
  );
}
