"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { adminApi, getUploadUrl } from "@/services/admin-api";
import { useToast } from "@/contexts/ToastContext";
import { CVEditForm } from "@/components/admin/cv";
import type { CVData, CVItem } from "@/components/admin/cv";
import styles from "./page.module.scss";

const CVPreview = dynamic(
  () =>
    import("@/components/admin/cv/CVPreview").then((mod) => ({
      default: mod.CVPreview,
    })),
  { ssr: false },
);

function buildPhotoUrl(photoPath: string): string {
  if (!photoPath) return "";
  if (photoPath.startsWith("http")) return photoPath;
  if (typeof window === "undefined") return photoPath;
  return `${window.location.origin}${photoPath}`;
}

export default function AdminCVPage() {
  const toast = useToast();
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const raw = await adminApi.cv.getData();
      const experience: CVItem<import("shared").Experience>[] = (raw.experience ?? []).map(
        (exp, i) => ({
          id: (exp as { id?: string }).id ?? `exp-${i}`,
          visible: true,
          data: exp,
        }),
      );
      const projects: CVItem<import("shared").Project>[] = (raw.projects ?? []).map(
        (proj, i) => ({
          id: (proj as { id?: string }).id ?? proj.slug ?? `proj-${i}`,
          visible: true,
          data: proj,
        }),
      );
      setCvData({
        profile: raw.profile,
        experience,
        skills: raw.skills ?? [],
        projects,
      });
    } catch {
      toast.error("Impossible de charger les données");
      setCvData(null);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleGenerateAndSave = async (blob: Blob) => {
    setSaving(true);
    try {
      const filename = `cv-gagnaire-${Date.now()}.pdf`;
      const file = new File([blob], filename, { type: "application/pdf" });
      const { path } = await adminApi.upload(file, "cv");
      const profile = cvData?.profile;
      if (profile) {
        await adminApi.profile.update({ cv: path });
        setCvData((prev) =>
          prev ? { ...prev, profile: { ...prev.profile, cv: path } } : null,
        );
      }
      toast.success("CV généré et enregistré");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erreur lors de l'enregistrement",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleManualUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/pdf") return;

    setUploading(true);
    try {
      const { path } = await adminApi.upload(file, "cv");
      const profile = cvData?.profile;
      if (profile) {
        await adminApi.profile.update({ cv: path });
        setCvData((prev) =>
          prev ? { ...prev, profile: { ...prev.profile, cv: path } } : null,
        );
      }
      toast.success("CV uploadé et enregistré");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de l'upload");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  if (loading) return <p>Chargement des données…</p>;
  if (!cvData) return <p>Aucune donnée disponible pour générer le CV.</p>;

  const photoUrl = buildPhotoUrl(cvData.profile.photo);
  const currentCvUrl = cvData.profile.cv ? getUploadUrl(cvData.profile.cv) : "";

  return (
    <CVPreview
      data={cvData}
      photoUrl={photoUrl}
      onGenerateAndSave={handleGenerateAndSave}
      isSaving={saving}
      onManualUpload={handleManualUpload}
      isUploading={uploading}
      currentCvUrl={currentCvUrl || undefined}
      editForm={
        <CVEditForm
          data={cvData}
          onChange={setCvData}
        />
      }
      styles={styles}
    />
  );
}
