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

const OFFSET = 12;

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

      let left: number;
      let top: number;

      if (fromMouse && coords) {
        left = coords.x - tooltipRect.width / 2;
        top = coords.y - tooltipRect.height - OFFSET;

        if (left < padding) left = padding;
        if (left + tooltipRect.width > window.innerWidth - padding) {
          left = window.innerWidth - tooltipRect.width - padding;
        }
        if (top < padding) {
          top = coords.y + OFFSET;
        }
      } else if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        left = rect.left + rect.width / 2 - tooltipRect.width / 2;
        top = rect.top - tooltipRect.height - OFFSET;

        if (left < padding) left = padding;
        if (left + tooltipRect.width > window.innerWidth - padding) {
          left = window.innerWidth - tooltipRect.width - padding;
        }
        if (top < padding) {
          top = rect.bottom + OFFSET;
        }
      } else {
        return;
      }

      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
    };

    const rafId = requestAnimationFrame(() => {
      updatePosition();
      if (fromMouse) {
        requestAnimationFrame(updatePosition);
      }
    });

    return () => cancelAnimationFrame(rafId);
  }, [isVisible, coords, fromMouse]);

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
      className={`${styles.tooltip} ${
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
