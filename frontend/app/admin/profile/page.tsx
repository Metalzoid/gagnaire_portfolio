"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/services/admin-api";
import { ProfileForm } from "@/components/admin/ProfileForm";
import { useToast } from "@/contexts/ToastContext";
import type { Profile, UpdateProfileSchemaType } from "shared";

export default function AdminProfilePage() {
  const toast = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.profile
      .get()
      .then(setProfile)
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (data: UpdateProfileSchemaType) => {
    await adminApi.profile.update(data);
    setProfile((prev) => (prev ? { ...prev, ...data } : null));
    toast.success("Profil enregistré");
  };

  if (loading) return <p>Chargement...</p>;
  if (!profile) return <p>Aucun profil en base. Exécutez le seed backend.</p>;

  return (
    <div>
      <ProfileForm defaultValues={profile} onSubmit={handleSubmit} />
    </div>
  );
}
