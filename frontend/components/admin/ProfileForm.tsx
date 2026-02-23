"use client";

import { useState } from "react";
import { FormField } from "./FormField";
import { FormError } from "./FormError";
import { SocialLinksEditor } from "./SocialLinksEditor";
import { ProfileMediaManager } from "./ProfileMediaManager";
import { Button } from "@/components/ui/button";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import type { UpdateProfileSchemaType, Profile, SocialLink } from "shared";

const defaultPitch = { who: "", what: "", why: "", method: "" };
const defaultSocial: SocialLink[] = [];

interface ProfileFormProps {
  defaultValues?: Partial<Profile>;
  onSubmit: (data: UpdateProfileSchemaType) => Promise<void>;
  onSocialReorder?: (social: SocialLink[]) => void | Promise<void>;
}

export function ProfileForm({ defaultValues, onSubmit, onSocialReorder }: ProfileFormProps) {
  const [firstName, setFirstName] = useState(defaultValues?.firstName ?? "");
  const [lastName, setLastName] = useState(defaultValues?.lastName ?? "");
  const [role, setRole] = useState(defaultValues?.role ?? "");
  const [status, setStatus] = useState(defaultValues?.status ?? "");
  const [bio, setBio] = useState(defaultValues?.bio ?? "");
  const [photo, setPhoto] = useState(defaultValues?.photo ?? "");
  const [cv, setCv] = useState(defaultValues?.cv ?? "");
  const [pitch, setPitch] = useState(defaultValues?.pitch ?? defaultPitch);
  const [social, setSocial] = useState<SocialLink[]>(
    defaultValues?.social ?? defaultSocial,
  );
  const { error, loading, handleSubmit } = useFormSubmit();

  return (
    <form onSubmit={handleSubmit(() => onSubmit({
        firstName,
        lastName,
        role,
        status,
        bio,
        photo,
        cv,
        pitch,
        social,
      }))} className="admin-profile-form">
      <section className="admin-profile-form__section">
        <h3 className="admin-profile-form__title">Identité</h3>
        <div className="admin-profile-form__row">
          <FormField
            label="Prénom"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName((e.target as HTMLInputElement).value)}
            required
          />
          <FormField
            label="Nom"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName((e.target as HTMLInputElement).value)}
            required
          />
        </div>
        <div className="admin-profile-form__row">
          <FormField
            label="Rôle"
            name="role"
            value={role}
            onChange={(e) => setRole((e.target as HTMLInputElement).value)}
            required
          />
          <FormField
            label="Statut"
            name="status"
            value={status}
            onChange={(e) => setStatus((e.target as HTMLInputElement).value)}
            required
          />
        </div>
      </section>
      <section className="admin-profile-form__section">
        <h3 className="admin-profile-form__title">Bio</h3>
        <FormField
          type="textarea"
          label="Biographie"
          name="bio"
          value={bio}
          onChange={(e) => setBio((e.target as HTMLTextAreaElement).value)}
          required
        />
      </section>
      <section className="admin-profile-form__section">
        <h3 className="admin-profile-form__title">Pitch</h3>
        <FormField
          label="Qui"
          name="pitch.who"
          value={pitch.who}
          onChange={(e) =>
            setPitch({ ...pitch, who: (e.target as HTMLInputElement).value })
          }
        />
        <FormField
          label="Quoi"
          name="pitch.what"
          value={pitch.what}
          onChange={(e) =>
            setPitch({ ...pitch, what: (e.target as HTMLInputElement).value })
          }
        />
        <FormField
          label="Pourquoi"
          name="pitch.why"
          value={pitch.why}
          onChange={(e) =>
            setPitch({ ...pitch, why: (e.target as HTMLInputElement).value })
          }
        />
        <FormField
          label="Comment"
          name="pitch.method"
          value={pitch.method}
          onChange={(e) =>
            setPitch({ ...pitch, method: (e.target as HTMLInputElement).value })
          }
        />
      </section>
      <SocialLinksEditor
        value={social}
        onChange={setSocial}
        onReorder={onSocialReorder}
      />
      <ProfileMediaManager
        photo={photo}
        cv={cv}
        onPhotoChange={setPhoto}
        onCvChange={setCv}
      />
      <FormError error={error} />
      <Button
        type="submit"
        loading={loading}
        disabled={loading}
        ariaLabel="Enregistrer"
      >
        {loading ? "..." : "Enregistrer"}
      </Button>
    </form>
  );
}
