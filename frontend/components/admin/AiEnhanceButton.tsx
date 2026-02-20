"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

interface AiEnhanceButtonProps {
  onEnhance: () => Promise<void>;
  label?: string;
  confirmMessage?: string;
}

export function AiEnhanceButton({
  onEnhance,
  label = "Améliorer avec l'IA",
  confirmMessage = "L'IA va réécrire le contenu. Cette action consomme des tokens OpenAI et modifie directement les données en base. Continuer ?",
}: AiEnhanceButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirm = async () => {
    setShowConfirm(false);
    setLoading(true);
    try {
      await onEnhance();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setShowConfirm(true)}
        loading={loading}
        disabled={loading}
        ariaLabel={label}
      >
        {label}
      </Button>
      <ConfirmDialog
        isOpen={showConfirm}
        title="Amélioration IA"
        message={confirmMessage}
        confirmLabel="Améliorer"
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm(false)}
        variant="default"
      />
    </>
  );
}
