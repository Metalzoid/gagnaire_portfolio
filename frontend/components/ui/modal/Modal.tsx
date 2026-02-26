"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useSyncExternalStore,
  useState,
} from "react";
import { createPortal } from "react-dom";
import useLockBodyScroll from "@/hooks/useLockBodyScroll";
import useKeyPress from "@/hooks/useKeyPress";
import styles from "./Modal.module.scss";

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------
export type ModalSize = "sm" | "md" | "lg";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  /** Origine de l'animation d'ouverture (ex. "35% 60%" pour partir du point cliqué) */
  transformOrigin?: string;
  children: React.ReactNode;
}

// --------------------------------------------------------------------------
// Composant
// --------------------------------------------------------------------------
const Modal = ({
  isOpen,
  onClose,
  title,
  size = "sm",
  transformOrigin,
  children,
}: ModalProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const closingHandledRef = useRef(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const isBrowser = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen && !isClosing) {
      const t = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(t);
    }
    if (!isOpen) {
      const t = requestAnimationFrame(() => setIsVisible(false));
      return () => cancelAnimationFrame(t);
    }
  }, [isOpen, isClosing]);

  const finishClose = useCallback(() => {
    if (closingHandledRef.current) return;
    closingHandledRef.current = true;
    const focusEl = previousFocusRef.current;
    onClose();
    setIsClosing(false); // Permet le démontage (return null quand !isOpen && !isClosing)
    requestAnimationFrame(() => {
      focusEl?.focus();
    });
  }, [onClose]);

  const handleClose = useCallback(() => {
    if (isClosing) return;
    closingHandledRef.current = false;
    setIsClosing(true);
  }, [isClosing]);

  // Fallback : si onTransitionEnd ne se déclenche pas, forcer la fermeture
  useEffect(() => {
    if (!isClosing) return;
    const fallback = setTimeout(() => finishClose(), 300);
    return () => clearTimeout(fallback);
  }, [isClosing, finishClose]);

  const handleDialogTransitionEnd = useCallback(
    (e: React.TransitionEvent<HTMLDivElement>) => {
      if (e.target !== dialogRef.current || !isClosing) return;
      finishClose();
    },
    [isClosing, finishClose],
  );

  useLockBodyScroll(isOpen);
  useKeyPress("Escape", handleClose, isOpen);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isOpen || !dialogRef.current) return;

      if (event.key === "Tab") {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === first) {
            event.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }
    },
    [isOpen],
  );

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    document.addEventListener("keydown", handleKeyDown);

    const timer = setTimeout(() => {
      if (dialogRef.current) {
        const firstFocusable = dialogRef.current.querySelector<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        firstFocusable?.focus();
      }
    }, 100);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen && !isClosing) return null;

  const overlayClass = [
    styles.overlay,
    isVisible && !isClosing ? styles["overlay--open"] : "",
    isClosing ? styles["overlay--closing"] : "",
  ]
    .filter(Boolean)
    .join(" ");

  const dialogClass = [
    styles.dialog,
    isVisible && !isClosing ? styles["dialog--open"] : "",
    isClosing ? styles["dialog--closing"] : "",
  ]
    .filter(Boolean)
    .join(" ");

  const modalContent = (
    <>
      <div
        className={overlayClass}
        onClick={handleClose}
        aria-hidden="true"
      />
      <div
        className={`${styles.dialogWrapper} ${styles[`dialogWrapper--${size}`]}`}
      >
        <div
          ref={dialogRef}
          className={dialogClass}
          style={transformOrigin ? { transformOrigin } : undefined}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          onClick={(e) => e.stopPropagation()}
          onTransitionEnd={handleDialogTransitionEnd}
        >
          <div className={styles.header}>
            {title && (
              <h2 id={titleId} className={styles.title}>
                {title}
              </h2>
            )}
            <button
              type="button"
              className={styles.closeButton}
              onClick={handleClose}
              aria-label="Fermer la fenêtre"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </>
  );

  if (!isBrowser) return null;

  return createPortal(modalContent, document.body);
};

export default Modal;
