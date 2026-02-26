"use client";

import { Modal } from "@/components/ui/modal";
import { ExperienceDetailContent } from "./ExperienceDetailContent";
import type { Experience } from "shared";

interface ExperienceDetailModalProps {
  item: Experience | null;
  isOpen: boolean;
  onClose: () => void;
  transformOrigin?: string;
}

export function ExperienceDetailModal({
  item,
  isOpen,
  onClose,
  transformOrigin,
}: ExperienceDetailModalProps) {
  if (!item) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item.title}
      size="lg"
      transformOrigin={transformOrigin}
    >
      <ExperienceDetailContent item={item} />
    </Modal>
  );
}
