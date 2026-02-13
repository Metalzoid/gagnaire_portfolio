"use client";

import { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTypewriter } from "@/hooks/useTypewriter";
import { useContactModal } from "@/contexts/ContactModalContext";
import styles from "./not-found.module.scss";

export default function NotFound() {
  const pathname = usePathname();
  const { openContactModal } = useContactModal();
  const lines = [
    `> cd ${pathname || "/page-inconnue"}`,
    "bash: cd: " +
      (pathname || "/page-inconnue") +
      ": No such file or directory",
    "",
    "> Error 404",
    "La page que vous cherchez n'existe pas.",
    "",
    "> ls solutions/",
    "  retour-accueil    voir-projets    me-contacter",
    "",
    "> _",
  ];

  const displayedText = useTypewriter(lines, {
    speed: 30,
    delayBetweenLines: 200,
    initialDelay: 300,
  });

  const linesDisplay = displayedText.split("\n");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [displayedText]);

  return (
    <div className={`page page--404 ${styles.page}`}>
      <div className={styles.wrapper}>
        <div className={styles.terminal}>
          <div className={styles.titleBar}>
            <div className={styles.dots}>
              <span
                className={styles.dot}
                data-color="red"
                aria-hidden="true"
              />
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
                    {i === linesDisplay.length - 1 &&
                      linesDisplay.length > 0 && (
                        <span className={styles.cursor} aria-hidden="true" />
                      )}
                  </span>
                );
              })}
            </pre>
          </div>
        </div>

        <div className={styles.links}>
          <Link href="/" className={styles.link}>
            retour-accueil
          </Link>
          <Link href="/projects" className={styles.link}>
            voir-projets
          </Link>
          <button
            type="button"
            className={styles.link}
            onClick={openContactModal}
          >
            me-contacter
          </button>
        </div>
      </div>
    </div>
  );
}
