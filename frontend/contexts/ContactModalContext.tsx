"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------
export interface ContactModalContextType {
  isOpen: boolean;
  openContactModal: () => void;
  closeContactModal: () => void;
}

const ContactModalContext = createContext<ContactModalContextType | null>(null);

// --------------------------------------------------------------------------
// Provider
// --------------------------------------------------------------------------
interface ContactModalProviderProps {
  children: React.ReactNode;
}

export function ContactModalProvider({ children }: ContactModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openContactModal = useCallback(() => setIsOpen(true), []);
  const closeContactModal = useCallback(() => setIsOpen(false), []);

  const value = useMemo<ContactModalContextType>(
    () => ({
      isOpen,
      openContactModal,
      closeContactModal,
    }),
    [isOpen, openContactModal, closeContactModal]
  );

  return (
    <ContactModalContext.Provider value={value}>
      {children}
    </ContactModalContext.Provider>
  );
}

// --------------------------------------------------------------------------
// Hook
// --------------------------------------------------------------------------
export function useContactModal(): ContactModalContextType {
  const ctx = useContext(ContactModalContext);
  if (!ctx) {
    throw new Error(
      "useContactModal doit être utilisé dans un ContactModalProvider"
    );
  }
  return ctx;
}
