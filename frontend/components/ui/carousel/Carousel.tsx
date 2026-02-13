"use client";

import {
  useState,
  useCallback,
  useEffect,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import styles from "./Carousel.module.scss";

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------
interface CarouselProps<T> {
  /** Liste des éléments à afficher */
  items: T[];
  /** Fonction de rendu pour chaque élément */
  renderItem: (item: T, index: number) => ReactNode;
  /** Lecture automatique */
  autoPlay?: boolean;
  /** Intervalle de défilement auto (ms) */
  autoPlayInterval?: number;
  /** Afficher les indicateurs (dots) */
  showDots?: boolean;
  /** Afficher les flèches de navigation */
  showArrows?: boolean;
  /** Afficher le compteur de page (ex: 1 / 3) */
  showCounter?: boolean;
  /** Boucle infinie */
  loop?: boolean;
  /** Label accessible pour le carousel */
  ariaLabel?: string;
  /** Classe CSS additionnelle */
  className?: string;
}

// --------------------------------------------------------------------------
// Constantes
// --------------------------------------------------------------------------
const SWIPE_THRESHOLD = 50;
const TRANSITION_DURATION = 400;

// --------------------------------------------------------------------------
// Composant
// --------------------------------------------------------------------------
function Carousel<T>({
  items,
  renderItem,
  autoPlay = false,
  autoPlayInterval = 5000,
  showDots = false,
  showArrows = true,
  showCounter = false,
  loop = true,
  ariaLabel = "Carousel",
  className,
}: CarouselProps<T>) {
  const total = items.length;

  // Avec loop : track [slide0, slide1, ..., slideN, clone(slide0)] pour défilement droit à la fin
  const displayItems = loop && total > 1 ? [...items, items[0]] : items;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [disableTransition, setDisableTransition] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  // Refs pour le swipe tactile (mobile)
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isDraggingRef = useRef(false);

  const prefersReducedMotion = useSyncExternalStore(
    (onStoreChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onStoreChange);
      return () => mq.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );

  // Index logique pour dots/compteur (0 à total-1)
  const logicalIndex = currentIndex >= total ? 0 : currentIndex;

  // --------------------------------------------------------------------------
  // Visibilité : timer démarre en vue, reset quand hors vue
  // --------------------------------------------------------------------------
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // --------------------------------------------------------------------------
  // Reset instantané après passage sur le clone (sans animation)
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!loop || total <= 1) return;
    if (currentIndex === total) {
      // On vient d'arriver sur le clone du premier slide → reset à 0
      const t = setTimeout(() => {
        setDisableTransition(true);
        setCurrentIndex(0);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setDisableTransition(false));
        });
      }, TRANSITION_DURATION);
      return () => clearTimeout(t);
    }
  }, [currentIndex, loop, total]);

  // --------------------------------------------------------------------------
  // Navigation
  // --------------------------------------------------------------------------
  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning || total === 0) return;

      setIsTransitioning(true);

      let target: number;
      if (loop && total > 1) {
        if (index < 0) {
          target = total - 1; // prev depuis 0 → last réel
        } else if (index >= total) {
          target = total; // next depuis last → clone (défilement droit)
        } else {
          target = index;
        }
      } else {
        target = Math.max(0, Math.min(index, total - 1));
      }

      setCurrentIndex(target);
      setTimeout(() => setIsTransitioning(false), TRANSITION_DURATION);
    },
    [isTransitioning, total, loop],
  );

  const goNext = useCallback(() => {
    if (!loop && currentIndex >= total - 1) return;
    goTo(currentIndex + 1);
  }, [currentIndex, total, loop, goTo]);

  const goPrev = useCallback(() => {
    if (!loop && currentIndex <= 0) return;
    goTo(currentIndex - 1);
  }, [currentIndex, loop, goTo]);

  // --------------------------------------------------------------------------
  // Auto-play : démarre quand en vue, pause/reset hors vue ou drag
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!autoPlay || !isInView || isPaused || isDragging || total <= 1) return;

    const timer = setInterval(goNext, autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, isInView, isPaused, isDragging, goNext, total]);

  // --------------------------------------------------------------------------
  // Clavier
  // --------------------------------------------------------------------------
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          goPrev();
          break;
        case "ArrowRight":
          e.preventDefault();
          goNext();
          break;
      }
    },
    [goPrev, goNext],
  );

  // --------------------------------------------------------------------------
  // Swipe tactile : suivi du doigt en temps réel (mobile)
  // --------------------------------------------------------------------------
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isDraggingRef.current = true;
    setIsDragging(true);
    viewportRef.current?.style.setProperty("--carousel-drag", "0px");
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const currentX = e.touches[0].clientX;
      let delta = touchStartX.current - currentX;

      // Résistance aux bords (mode non-loop)
      if (!loop && total > 1) {
        if (currentIndex === 0 && delta < 0) {
          delta *= 0.3;
        } else if (currentIndex >= total - 1 && delta > 0) {
          delta *= 0.3;
        }
      }
      viewportRef.current?.style.setProperty("--carousel-drag", `${delta}px`);
    },
    [currentIndex, loop, total],
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const endX = e.changedTouches?.[0]?.clientX;
      const diff = endX != null ? touchStartX.current - endX : 0;

      if (!isTransitioning && Math.abs(diff) > SWIPE_THRESHOLD) {
        if (diff > 0) {
          goNext();
        } else {
          goPrev();
        }
      }

      viewportRef.current?.style.removeProperty("--carousel-drag");
      isDraggingRef.current = false;
      setIsDragging(false);
    },
    [goNext, goPrev, isTransitioning],
  );

  // Désactiver le scroll vertical pendant un drag horizontal (passive: false requis)
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || !e.touches[0]) return;
      const deltaX = Math.abs(e.touches[0].clientX - touchStartX.current);
      const deltaY = Math.abs(e.touches[0].clientY - touchStartY.current);
      if (deltaX > deltaY && deltaX > 5) {
        e.preventDefault();
      }
    };

    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => el.removeEventListener("touchmove", handleTouchMove);
  }, []);

  // --------------------------------------------------------------------------
  // Rendu
  // --------------------------------------------------------------------------
  if (total === 0) return null;

  const canGoPrev = loop || currentIndex > 0;
  const canGoNext = loop || currentIndex < total - 1;

  const wrapperClasses = [styles.carousel, className ?? ""]
    .filter(Boolean)
    .join(" ");

  const baseTranslate = -currentIndex * 100;
  const transitionValue = prefersReducedMotion
    ? "none"
    : "transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
  const trackStyle = {
    transform: `translateX(calc(${baseTranslate}% - var(--carousel-drag, 0px)))`,
    transition: disableTransition || isDragging ? "none" : transitionValue,
  };

  return (
    <div
      ref={wrapperRef}
      className={wrapperClasses}
      role="region"
      aria-label={ariaLabel}
      aria-roledescription="carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
    >
      {/* Conteneur flex : flèche gauche | viewport | flèche droite */}
      <div className={styles.carouselInner}>
        {/* Flèche précédent (à gauche, hors du contenu) */}
        {showArrows && total > 1 && (
          <button
            className={`${styles.arrow} ${styles["arrow--prev"]}`}
            onClick={goPrev}
            disabled={!canGoPrev}
            aria-label="Slide précédent"
            tabIndex={0}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        {/* Piste de slides (swipe tactile sur le viewport uniquement) */}
        <div
          ref={viewportRef}
          className={styles.viewport}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className={styles.track} style={trackStyle}>
            {displayItems.map((item, index) => (
              <div
                key={index}
                className={`${styles.slide} ${
                  !isDragging && !isTransitioning && index !== currentIndex
                    ? styles["slide--hidden"]
                    : ""
                }`}
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${logicalIndex + 1} sur ${total}`}
                aria-hidden={index !== currentIndex ? "true" : "false"}
              >
                {renderItem(item, index % total)}
              </div>
            ))}
          </div>
        </div>

        {/* Flèche suivant (à droite, hors du contenu) */}
        {showArrows && total > 1 && (
          <button
            className={`${styles.arrow} ${styles["arrow--next"]}`}
            onClick={goNext}
            disabled={!canGoNext}
            aria-label="Slide suivant"
            tabIndex={0}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </button>
        )}
      </div>

      {/* Navigation bas : dots + compteur (optionnel) */}
      {total > 1 && (showDots || showCounter) && (
        <div className={styles.nav}>
          {showDots && (
            <div
              className={styles.dots}
              role="tablist"
              aria-label="Navigation slides"
            >
              {items.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${
                    index === logicalIndex ? styles["dot--active"] : ""
                  }`}
                  onClick={() => goTo(index)}
                  role="tab"
                  aria-selected={index === logicalIndex}
                  aria-label={`Aller au slide ${index + 1}`}
                  tabIndex={index === logicalIndex ? 0 : -1}
                />
              ))}
            </div>
          )}
          {showCounter && (
            <div className={styles.counter} aria-live="polite">
              <span className={styles.counterCurrent}>{logicalIndex + 1}</span>
              <span className={styles.counterSeparator}>/</span>
              <span className={styles.counterTotal}>{total}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Carousel;
