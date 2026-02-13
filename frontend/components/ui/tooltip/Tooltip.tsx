"use client";

import {
  useId,
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useSyncExternalStore,
  cloneElement,
  isValidElement,
} from "react";
import type { ReactElement, ReactNode } from "react";
import { createPortal } from "react-dom";
import styles from "./Tooltip.module.scss";

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------
interface TooltipProps {
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  children: ReactNode;
}

type Position = TooltipProps["position"];

const OFFSET = 12;

// Position opposée pour le flip automatique
const FLIP_MAP: Record<NonNullable<Position>, NonNullable<Position>> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

// --------------------------------------------------------------------------
// Helpers de positionnement
// --------------------------------------------------------------------------

/** Calcule left/top selon la position souhaitée */
function computePosition(
  position: NonNullable<Position>,
  anchor: { x: number; y: number; width: number; height: number },
  tooltipRect: { width: number; height: number }
): { left: number; top: number } {
  switch (position) {
    case "bottom":
      return {
        left: anchor.x + anchor.width / 2 - tooltipRect.width / 2,
        top: anchor.y + anchor.height + OFFSET,
      };
    case "left":
      return {
        left: anchor.x - tooltipRect.width - OFFSET,
        top: anchor.y + anchor.height / 2 - tooltipRect.height / 2,
      };
    case "right":
      return {
        left: anchor.x + anchor.width + OFFSET,
        top: anchor.y + anchor.height / 2 - tooltipRect.height / 2,
      };
    case "top":
    default:
      return {
        left: anchor.x + anchor.width / 2 - tooltipRect.width / 2,
        top: anchor.y - tooltipRect.height - OFFSET,
      };
  }
}

/** Vérifie si le tooltip déborde du viewport */
function isOutOfBounds(
  position: NonNullable<Position>,
  coords: { left: number; top: number },
  tooltipRect: { width: number; height: number },
  padding: number
): boolean {
  switch (position) {
    case "top":
      return coords.top < padding;
    case "bottom":
      return coords.top + tooltipRect.height > window.innerHeight - padding;
    case "left":
      return coords.left < padding;
    case "right":
      return coords.left + tooltipRect.width > window.innerWidth - padding;
    default:
      return false;
  }
}

/** Contraint les coordonnées dans les limites du viewport */
function clampToViewport(
  left: number,
  top: number,
  tooltipRect: { width: number; height: number },
  padding: number
): { left: number; top: number } {
  let l = left;
  let t = top;

  if (l < padding) l = padding;
  if (l + tooltipRect.width > window.innerWidth - padding) {
    l = window.innerWidth - tooltipRect.width - padding;
  }
  if (t < padding) t = padding;
  if (t + tooltipRect.height > window.innerHeight - padding) {
    t = window.innerHeight - tooltipRect.height - padding;
  }

  return { left: l, top: t };
}

// --------------------------------------------------------------------------
// Composant
// --------------------------------------------------------------------------
// Subscribe no-op : le statut de montage client ne change jamais
const subscribeNoop = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const Tooltip = ({ content, position = "top", children }: TooltipProps) => {
  // Détection client via useSyncExternalStore (évite setState dans un effet)
  const mounted = useSyncExternalStore(
    subscribeNoop,
    getClientSnapshot,
    getServerSnapshot
  );
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
  const [fromMouse, setFromMouse] = useState(false);
  const [resolvedPosition, setResolvedPosition] =
    useState<NonNullable<Position>>(position);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipId = useId();

  const handleMouseEnter = (e: React.MouseEvent) => {
    setFromMouse(true);
    setCoords({ x: e.clientX, y: e.clientY });
    setIsVisible(true);
  };
  const handleMouseLeave = () => {
    setFromMouse(false);
    setCoords(null);
    setIsVisible(false);
  };
  const handleFocus = () => {
    setIsVisible(true);
  };
  const handleBlur = () => {
    setIsVisible(false);
  };

  // Écouter mousemove au niveau document pour un suivi fiable du curseur
  useEffect(() => {
    if (!isVisible || !fromMouse) return;

    const handleDocMouseMove = (e: MouseEvent) => {
      setCoords({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener("mousemove", handleDocMouseMove, {
      passive: true,
    });
    return () => document.removeEventListener("mousemove", handleDocMouseMove);
  }, [isVisible, fromMouse]);

  // Positionner le tooltip via mise à jour directe du DOM (évite setState dans l'effet)
  useLayoutEffect(() => {
    if (!isVisible || !tooltipRef.current) return;

    const tooltip = tooltipRef.current;
    const padding = 8;

    const updatePosition = () => {
      if (!tooltipRef.current || !tooltip.isConnected) return;
      const tooltipRect = tooltip.getBoundingClientRect();
      const ttSize = { width: tooltipRect.width, height: tooltipRect.height };

      // Construire l'ancre (curseur souris ou élément déclencheur)
      let anchor: { x: number; y: number; width: number; height: number };

      if (fromMouse && coords) {
        // En mode souris, l'ancre est un point (0×0) centré sur le curseur
        anchor = { x: coords.x, y: coords.y, width: 0, height: 0 };
      } else if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        anchor = {
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
        };
      } else {
        return;
      }

      // Calculer la position souhaitée
      let pos = position;
      let result = computePosition(pos, anchor, ttSize);

      // Flip si la position déborde du viewport
      if (isOutOfBounds(pos, result, ttSize, padding)) {
        const flipped = FLIP_MAP[pos];
        const flippedResult = computePosition(flipped, anchor, ttSize);

        // Utiliser le flip seulement s'il ne déborde pas non plus
        if (!isOutOfBounds(flipped, flippedResult, ttSize, padding)) {
          pos = flipped;
          result = flippedResult;
        }
      }

      // Contraindre dans le viewport (sécurité finale)
      const clamped = clampToViewport(result.left, result.top, ttSize, padding);

      tooltip.style.left = `${clamped.left}px`;
      tooltip.style.top = `${clamped.top}px`;

      // Mettre à jour la position résolue pour l'animation CSS
      setResolvedPosition(pos);
    };

    const rafId = requestAnimationFrame(() => {
      updatePosition();
      if (fromMouse) {
        requestAnimationFrame(updatePosition);
      }
    });

    return () => cancelAnimationFrame(rafId);
  }, [isVisible, coords, fromMouse, position]);

  const trigger = isValidElement(children)
    ? cloneElement(children as ReactElement<{ "aria-describedby"?: string }>, {
        "aria-describedby": isVisible ? tooltipId : undefined,
      })
    : children;

  const tooltipEl = (
    <div
      ref={tooltipRef}
      id={tooltipId}
      role="tooltip"
      className={`${styles.tooltip} ${styles[`tooltip--${resolvedPosition}`]} ${
        isVisible ? styles["tooltip--visible"] : ""
      }`}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
      }}
    >
      {content}
    </div>
  );

  return (
    <div
      ref={triggerRef}
      className={styles.wrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {trigger}
      {mounted ? createPortal(tooltipEl, document.body) : null}
    </div>
  );
};

export default Tooltip;
