"use client";

import { useState } from "react";
import { FormField } from "./FormField";
import { ProfileMediaManager } from "./ProfileMediaManager";
import { OrderableList } from "./OrderableList";
import { Button } from "@/components/ui/button";
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
  const [socialIds, setSocialIds] = useState<string[]>(() =>
    (defaultValues?.social ?? defaultSocial).map(() => crypto.randomUUID()),
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSubmit({
        firstName,
        lastName,
        role,
        status,
        bio,
        photo,
        cv,
        pitch,
        social,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-profile-form">
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
      <section className="admin-profile-form__section admin-profile-form__section--social">
        <h3 className="admin-profile-form__title">Réseaux sociaux</h3>
        <OrderableList<SocialLink>
          items={social.map((s, i) => ({ id: socialIds[i] ?? crypto.randomUUID(), data: s }))}
          onReorder={(items) => {
            const nextData = items.map((item) => item.data);
            const nextIds = items.map((item) => item.id);
            setSocial(nextData);
            setSocialIds(nextIds);
            onSocialReorder?.(nextData);
          }}
          renderItem={({ data, id }) => {
            const idx = socialIds.indexOf(id);
            if (idx < 0) return null;
            return (
              <div className="admin-profile-form__social-item">
                <div className="admin-profile-form__social-fields">
                  <FormField
                    label="Label"
                    name={`social.${idx}.label`}
                    value={data.label}
                    onChange={(e) => {
                      const next = [...social];
                      next[idx] = { ...next[idx], label: (e.target as HTMLInputElement).value };
                      setSocial(next);
                    }}
                  />
                  <FormField
                    label="Valeur"
                    name={`social.${idx}.url`}
                    value={data.url}
                    onChange={(e) => {
                      const next = [...social];
                      next[idx] = { ...next[idx], url: (e.target as HTMLInputElement).value };
                      setSocial(next);
                    }}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSocial(social.filter((_, i) => i !== idx));
                    setSocialIds(socialIds.filter((_, i) => i !== idx));
                  }}
                  ariaLabel="Supprimer le lien"
                  className="admin-profile-form__social-remove"
                >
                  Supprimer
                </Button>
              </div>
            );
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            setSocial([...social, { label: "", url: "" }]);
            setSocialIds([...socialIds, crypto.randomUUID()]);
          }}
          ariaLabel="Ajouter un lien"
          className="admin-profile-form__social-add"
        >
          + Ajouter un lien
        </Button>
      </section>
      <ProfileMediaManager
        photo={photo}
        cv={cv}
        onPhotoChange={setPhoto}
        onCvChange={setCv}
      />
      {error && <p className="admin-form-error" role="alert">{error}</p>}
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
