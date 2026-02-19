"use client";

import { useRef, useEffect, useLayoutEffect, useState, useCallback } from "react";
import { useTypewriter, formatTerminalLines } from "@/hooks/useTypewriter";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useInteractiveTerminal } from "@/hooks/useInteractiveTerminal";
import type { Profile, SkillCategory, Project } from "shared";
import { useSnapScrollContext } from "@/contexts/SnapScrollContext";
import { useContactModal } from "@/contexts/ContactModalContext";
import { Button } from "@/components/ui/button";
import styles from "./TerminalHero.module.scss";

// --------------------------------------------------------------------------
// Props
// --------------------------------------------------------------------------
export interface TerminalHeroProps {
  profile: Profile;
  skills?: SkillCategory[];
  topProjects?: Project[];
}

// --------------------------------------------------------------------------
// Composant
// --------------------------------------------------------------------------
export function TerminalHero({
  profile,
  skills = [],
  topProjects = [],
}: TerminalHeroProps) {
  const { goToSectionById } = useSnapScrollContext();
  const { openContactModal } = useContactModal();
  const contentRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const lines = formatTerminalLines(profile);
  const { text: displayedText, isComplete } = useTypewriter(lines, {
    speed: 18,
    delayBetweenLines: 260,
    initialDelay: 500,
  });

  const terminalContext = {
    profile,
    skills,
    topProjects,
  };
  const {
    input,
    setInput,
    displayLines,
    onKeyDown,
    inputRef,
    easterTrigger,
    clearEasterTrigger,
    hasCleared,
    focusInput,
  } = useInteractiveTerminal(terminalContext, {
    goToSectionById: (sectionId: string) => {
      if (isDesktop) goToSectionById(sectionId);
    },
    openContactModal,
  });

  const linesDisplay = displayedText.split("\n");
  const showCursor = linesDisplay.length > 0;
  const isInteractive = isComplete && isDesktop;
  const [isFocused, setIsFocused] = useState(false);

  // Scroll en bas quand le contenu change ; plusieurs passes pour rester en bas après layout complet
  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const scrollToBottom = () => {
      const maxScroll = el.scrollHeight - el.clientHeight;
      el.scrollTop = Math.max(0, maxScroll);
    };

    scrollToBottom();
    const raf1 = requestAnimationFrame(() => {
      scrollToBottom();
      requestAnimationFrame(scrollToBottom);
    });
    const t = setTimeout(scrollToBottom, 80);

    return () => {
      cancelAnimationFrame(raf1);
      clearTimeout(t);
    };
  }, [displayedText, displayLines]);

  const handleTerminalClick = () => {
    if (isInteractive) focusInput();
  };

  const scrollContentToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      const el = contentRef.current;
      if (el) {
        el.scrollTop = Math.max(0, el.scrollHeight - el.clientHeight);
      }
    });
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const isNavigationKey = ["ArrowUp", "ArrowDown", "Tab", "Enter"].includes(
        e.key
      );
      if (!isNavigationKey) {
        scrollContentToBottom();
      }
      onKeyDown(e);
    },
    [onKeyDown, scrollContentToBottom]
  );

  // Listener natif en phase capture : intercepte le wheel avant le snap scroll du container
  useEffect(() => {
    const terminal = terminalRef.current;
    const content = contentRef.current;
    if (!terminal || !content) return;

    const handleWheelCapture = (e: WheelEvent) => {
      if (!terminal.contains(e.target as Node)) return;
      e.preventDefault();
      e.stopPropagation();
      const { scrollTop, scrollHeight, clientHeight } = content;
      content.scrollTop = Math.max(
        0,
        Math.min(scrollHeight - clientHeight, scrollTop + e.deltaY)
      );
    };

    terminal.addEventListener("wheel", handleWheelCapture, {
      passive: false,
      capture: true,
    });
    return () => {
      terminal.removeEventListener("wheel", handleWheelCapture, {
        capture: true,
      });
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <div
        ref={terminalRef}
        className={styles.terminal}
        data-focused={isFocused}
        onClick={handleTerminalClick}
        role={isInteractive ? "button" : undefined}
        tabIndex={isInteractive ? -1 : undefined}
        aria-label={
          isInteractive
            ? "Terminal interactif, cliquez pour taper une commande"
            : undefined
        }
        inert={!isDesktop}
      >
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

        {/* Contenu : typewriter puis éventuellement interactif */}
        <div ref={contentRef} className={styles.content}>
          <pre className={styles.output} aria-live="polite">
            {/* Avant clear : typewriter + message d’aide */}
            {!(isInteractive && hasCleared) && (
              <>
                {linesDisplay.map((line, i) => {
                  const isCommand = lines[i]?.startsWith("> ") ?? false;
                  return (
                    <span
                      key={`tw-${i}`}
                      className={`${styles.line} ${
                        isCommand ? styles.lineCommand : styles.lineResult
                      }`}
                    >
                      {line}
                      {i === linesDisplay.length - 1 && showCursor && !isInteractive && (
                        <span className={styles.cursor} aria-hidden="true" />
                      )}
                    </span>
                  );
                })}
                {isInteractive && !hasCleared && (
                  <span className={`${styles.line} ${styles.lineResult}`}>
                    Tapez &apos;help&apos; pour voir les commandes disponibles
                  </span>
                )}
              </>
            )}

            {/* Bloc interactif : historique des commandes + prompt */}
            {isInteractive && (
              <>
                {displayLines.map((item, i) =>
                  item.type === "command" ? (
                    <span
                      key={`cmd-${i}`}
                      className={`${styles.line} ${styles.lineCommand}`}
                    >
                      {item.text ? `> ${item.text}` : ">"}
                    </span>
                  ) : (
                    item.lines.map((outputLine, j) => (
                      <span
                        key={`out-${i}-${j}`}
                        className={`${styles.line} ${styles.lineResult} ${
                          item.ascii ? styles.lineAscii : ""
                        }`}
                      >
                        {outputLine}
                      </span>
                    ))
                  )
                )}
                <span className={`${styles.line} ${styles.lineCommand}`}>
                  ~/portfolio &gt; {input}
                  <span className={styles.cursor} aria-hidden="true" />
                </span>
              </>
            )}
          </pre>
          {/* Input caché pour la saisie (desktop uniquement) */}
          {isInteractive && (
            <input
              ref={inputRef}
              type="text"
              className={styles.hiddenInput}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              aria-label="Commande terminal"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
            />
          )}
        </div>

        {/* Overlays easter eggs */}
        {easterTrigger === "glitch" && (
          <div
            className={styles.easterGlitch}
            onAnimationEnd={clearEasterTrigger}
            aria-hidden
          />
        )}
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
