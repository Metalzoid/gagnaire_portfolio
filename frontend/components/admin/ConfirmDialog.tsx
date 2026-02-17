"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "default";
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  onConfirm,
  onCancel,
  variant = "danger",
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <p className="admin-confirm-message">{message}</p>
      <div style={{ display: "flex", gap: "var(--spacing-md)", justifyContent: "flex-end", marginTop: "var(--spacing-lg)" }}>
        <Button variant="outline" onClick={onCancel} ariaLabel={cancelLabel}>
          {cancelLabel}
        </Button>
        <Button
          variant={variant === "danger" ? "primary" : "primary"}
          onClick={onConfirm}
          ariaLabel={confirmLabel}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
