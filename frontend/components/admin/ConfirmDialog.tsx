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
      <div className="admin-confirm-actions">
        <Button variant="outline" onClick={onCancel} ariaLabel={cancelLabel}>
          {cancelLabel}
        </Button>
        <Button
          variant={variant === "danger" ? "secondary" : "primary"}
          onClick={onConfirm}
          ariaLabel={confirmLabel}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
