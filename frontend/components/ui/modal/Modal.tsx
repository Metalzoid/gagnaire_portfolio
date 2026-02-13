"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import useLockBodyScroll from "@/hooks/useLockBodyScroll";
import useKeyPress from "@/hooks/useKeyPress";
import styles from "./Modal.module.scss";

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

// --------------------------------------------------------------------------
// Variantes framer-motion
// --------------------------------------------------------------------------
const overlayVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
  exit: { opacity: 0 },
};

const contentVariants = {
  closed: { opacity: 0, scale: 0.95 },
  open: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

// --------------------------------------------------------------------------
// Composant
// --------------------------------------------------------------------------
const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  // Détection client sans mismatch d'hydratation (serveur → false, client → true)
  const isBrowser = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useLockBodyScroll(isOpen);
  useKeyPress("Escape", onClose, isOpen);

  // Focus trap : piège le focus dans le dialog quand ouvert
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

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.overlay}
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="exit"
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <div className={styles.dialogWrapper}>
            <motion.div
              ref={dialogRef}
              className={styles.dialog}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? titleId : undefined}
              variants={contentVariants}
              initial="closed"
              animate="open"
              exit="exit"
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
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
                  onClick={onClose}
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
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  if (!isBrowser) return null;

  return createPortal(modalContent, document.body);
};

export default Modal;
