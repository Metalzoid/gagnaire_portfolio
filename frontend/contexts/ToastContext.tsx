"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------
export type ToastVariant = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  expiresAt: number;
}

interface ToastContextValue {
  toasts: ToastItem[];
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

// --------------------------------------------------------------------------
// Context
// --------------------------------------------------------------------------
const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_DURATION_MS = 4000;

// --------------------------------------------------------------------------
// Provider
// --------------------------------------------------------------------------
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, variant: ToastVariant) => {
    const id = crypto.randomUUID();
    const expiresAt = Date.now() + TOAST_DURATION_MS;
    setToasts((prev) => [...prev, { id, message, variant, expiresAt }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback(
    (message: string) => addToast(message, "success"),
    [addToast],
  );
  const error = useCallback(
    (message: string) => addToast(message, "error"),
    [addToast],
  );
  const info = useCallback(
    (message: string) => addToast(message, "info"),
    [addToast],
  );

  // Nettoyage des toasts expirés
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setToasts((prev) => {
        const stillValid = prev.filter((t) => t.expiresAt > now);
        if (stillValid.length === prev.length) return prev;
        return stillValid;
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const value: ToastContextValue = {
    toasts,
    success,
    error,
    info,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

// --------------------------------------------------------------------------
// Container (affiche les toasts)
// --------------------------------------------------------------------------
function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="admin-toast-container"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((t) => (
        <ToastItemComponent
          key={t.id}
          item={t}
          onRemove={() => onRemove(t.id)}
        />
      ))}
    </div>
  );
}

function ToastItemComponent({
  item,
  onRemove,
}: {
  item: ToastItem;
  onRemove: () => void;
}) {
  useEffect(() => {
    const remaining = Math.max(0, item.expiresAt - Date.now());
    const timer = setTimeout(onRemove, remaining);
    return () => clearTimeout(timer);
  }, [item.expiresAt, item.id, onRemove]);

  return (
    <div className={`admin-toast admin-toast--${item.variant}`} role="alert">
      {item.message}
    </div>
  );
}

// --------------------------------------------------------------------------
// Hook
// --------------------------------------------------------------------------
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      success: () => {},
      error: () => {},
      info: () => {},
      toasts: [],
    };
  }
  return ctx;
}
