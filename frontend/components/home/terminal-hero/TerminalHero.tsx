"use client";

import { getProfile } from "@/services/data";
import { useTypewriter, formatTerminalLines } from "@/hooks/useTypewriter";
import { useSnapScrollContext } from "@/contexts/SnapScrollContext";
import { useContactModal } from "@/contexts/ContactModalContext";
import { Button } from "@/components/ui/button";
import styles from "./TerminalHero.module.scss";

// --------------------------------------------------------------------------
// Composant
// --------------------------------------------------------------------------
export function TerminalHero() {
  const profile = getProfile();
  const { goToSectionById } = useSnapScrollContext();
  const { openContactModal } = useContactModal();
  const lines = formatTerminalLines(profile);
  const displayedText = useTypewriter(lines, {
    speed: 40,
    delayBetweenLines: 600,
    initialDelay: 800,
  });

  const linesDisplay = displayedText.split("\n");
  const showCursor = linesDisplay.length > 0;

  return (
    <div className={styles.wrapper}>
      <div className={styles.terminal}>
        {/* Barre de titre */}
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
          <span className={styles.terminalTitle}>terminal</span>
        </div>

        {/* Contenu typewriter */}
        <div className={styles.content}>
          <pre className={styles.output} aria-live="polite">
            {linesDisplay.map((line, i) => (
              <span key={i} className={styles.line}>
                {line}
                {i === linesDisplay.length - 1 && showCursor && (
                  <span className={styles.cursor} aria-hidden="true" />
                )}
              </span>
            ))}
          </pre>
        </div>
      </div>

      {/* CTAs */}
      <div className={styles.ctas}>
        <Button
          variant="primary"
          size="lg"
          ariaLabel="Voir mes projets"
          onClick={() => goToSectionById("projets")}
        >
          Voir mes projets
        </Button>
        <Button
          variant="outline"
          size="lg"
          ariaLabel="Me contacter"
          onClick={openContactModal}
        >
          Me contacter
        </Button>
      </div>
    </div>
  );
}
