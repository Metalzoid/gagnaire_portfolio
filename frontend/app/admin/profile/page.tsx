"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/services/admin-api";
import { ProfileForm } from "@/components/admin/ProfileForm";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import type { Profile, UpdateProfileSchemaType } from "shared";

export default function AdminProfilePage() {
  const toast = useToast();
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Attendre que l'auth soit prête (évite race sur refresh de page)
  useEffect(() => {
    if (!isAuthenticated) return;

    queueMicrotask(() => setLoading(true));
    adminApi.profile
      .get()
      .then(setProfile)
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const handleSubmit = async (data: UpdateProfileSchemaType) => {
    await adminApi.profile.update(data);
    setProfile((prev) => (prev ? { ...prev, ...data } : null));
    toast.success("Profil enregistré");
  };

  const handleSocialReorder = async (social: Profile["social"]) => {
    await adminApi.profile.update({ social });
    setProfile((prev) => (prev ? { ...prev, social } : null));
    toast.success("Ordre des réseaux enregistré");
  };

  if (loading) return <p>Chargement...</p>;
  if (!profile) return <p>Aucun profil en base. Exécutez le seed backend.</p>;

  return (
    <div>
      <ProfileForm
        defaultValues={profile}
        onSubmit={handleSubmit}
        onSocialReorder={handleSocialReorder}
      />
    </div>
  );
}
