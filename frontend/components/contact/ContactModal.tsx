"use client";

import Modal from "@/components/ui/modal/Modal";
import { ContactForm } from "./ContactForm";
import { useContactModal } from "@/contexts/ContactModalContext";
import styles from "./ContactModal.module.scss";

// --------------------------------------------------------------------------
// Composant
// --------------------------------------------------------------------------
export function ContactModal() {
  const { isOpen, closeContactModal } = useContactModal();

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeContactModal}
      title="Me contacter"
    >
      <div className={styles.formWrapper}>
        <ContactForm />
      </div>
    </Modal>
  );
}
