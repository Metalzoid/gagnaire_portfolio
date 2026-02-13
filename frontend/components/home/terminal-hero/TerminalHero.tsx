"use client";

import { useRef, useEffect } from "react";
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
    speed: 28,
    delayBetweenLines: 400,
    initialDelay: 500,
  });

  const linesDisplay = displayedText.split("\n");
  const showCursor = linesDisplay.length > 0;
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [displayedText]);

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
          <span className={styles.terminalTitle}>zsh</span>
        </div>

        {/* Contenu typewriter */}
        <div ref={contentRef} className={styles.content}>
          <pre className={styles.output} aria-live="polite">
            {linesDisplay.map((line, i) => {
              const isCommand = lines[i]?.startsWith("> ") ?? false;
              return (
                <span
                  key={i}
                  className={`${styles.line} ${
                    isCommand ? styles.lineCommand : styles.lineResult
                  }`}
                >
                  {line}
                  {i === linesDisplay.length - 1 && showCursor && (
                    <span className={styles.cursor} aria-hidden="true" />
                  )}
                </span>
              );
            })}
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
