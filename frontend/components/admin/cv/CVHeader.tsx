import { View, Text, Image } from "@react-pdf/renderer";
import { cvStyles } from "./styles";
import type { Profile } from "shared";

interface CVHeaderProps {
  profile: Profile;
  photoUrl: string;
  /** Masquer les infos contact (affichées dans la sidebar) */
  compact?: boolean;
}

export function CVHeader({ profile, photoUrl, compact = false }: CVHeaderProps) {
  const fullName = `${profile.firstName} ${profile.lastName}`.trim();
  const contactLines: string[] = [];
  if (!compact && profile.social?.length) {
    profile.social
      .filter((s) => s.url?.trim())
      .forEach((s) =>
        contactLines.push(s.label?.trim() ? `${s.label}: ${s.url}` : s.url),
      );
  }

  return (
    <View style={cvStyles.header}>
      <View style={cvStyles.headerLeft}>
        <Text style={cvStyles.name}>{fullName || "Nom"}</Text>
        <Text style={cvStyles.role}>{profile.role || "Titre"}</Text>
        {contactLines.length > 0 && (
          <Text style={cvStyles.contact}>{contactLines.join("\n")}</Text>
        )}
      </View>
      {photoUrl && (
        <View style={cvStyles.headerRight}>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- Image @react-pdf, pas d'attribut alt */}
          <Image src={photoUrl} style={cvStyles.photo} />
        </View>
      )}
    </View>
  );
}
