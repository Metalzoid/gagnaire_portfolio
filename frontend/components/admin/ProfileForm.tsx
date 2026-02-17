"use client";

import { useState } from "react";
import { FormField } from "./FormField";
import { ProfileMediaManager } from "./ProfileMediaManager";
import { Button } from "@/components/ui/button";
import type { UpdateProfileSchemaType, Profile } from "shared";

const defaultPitch = { who: "", what: "", why: "", method: "" };
const defaultSocial = { github: "", linkedin: "", email: "" };

interface ProfileFormProps {
  defaultValues?: Partial<Profile>;
  onSubmit: (data: UpdateProfileSchemaType) => Promise<void>;
}

export function ProfileForm({ defaultValues, onSubmit }: ProfileFormProps) {
  const [firstName, setFirstName] = useState(defaultValues?.firstName ?? "");
  const [lastName, setLastName] = useState(defaultValues?.lastName ?? "");
  const [role, setRole] = useState(defaultValues?.role ?? "");
  const [status, setStatus] = useState(defaultValues?.status ?? "");
  const [bio, setBio] = useState(defaultValues?.bio ?? "");
  const [photo, setPhoto] = useState(defaultValues?.photo ?? "");
  const [cv, setCv] = useState(defaultValues?.cv ?? "");
  const [pitch, setPitch] = useState(defaultValues?.pitch ?? defaultPitch);
  const [social, setSocial] = useState(defaultValues?.social ?? defaultSocial);
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
    <form onSubmit={handleSubmit}>
      <h3>Identité</h3>
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
      <h3>Bio</h3>
      <FormField
        type="textarea"
        label="Biographie"
        name="bio"
        value={bio}
        onChange={(e) => setBio((e.target as HTMLTextAreaElement).value)}
        required
      />
      <h3>Pitch</h3>
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
      <h3>Réseaux</h3>
      <FormField
        label="GitHub"
        name="social.github"
        value={social.github}
        onChange={(e) =>
          setSocial({ ...social, github: (e.target as HTMLInputElement).value })
        }
      />
      <FormField
        label="LinkedIn"
        name="social.linkedin"
        value={social.linkedin}
        onChange={(e) =>
          setSocial({
            ...social,
            linkedin: (e.target as HTMLInputElement).value,
          })
        }
      />
      <FormField
        type="email"
        label="Email"
        name="social.email"
        value={social.email}
        onChange={(e) =>
          setSocial({ ...social, email: (e.target as HTMLInputElement).value })
        }
      />
      <ProfileMediaManager
        photo={photo}
        cv={cv}
        onPhotoChange={setPhoto}
        onCvChange={setCv}
      />
      {error && <p style={{ color: "var(--color-error)" }}>{error}</p>}
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
