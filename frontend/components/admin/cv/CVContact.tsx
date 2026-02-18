import { View, Text } from "@react-pdf/renderer";
import { cvStyles } from "./styles";
import type { Profile } from "shared";

interface CVContactProps {
  profile: Profile;
}

export function CVContact({ profile }: CVContactProps) {
  const social = profile.social ?? [];
  const contactLines = social
    .filter((s) => s.url?.trim())
    .map((s) => (s.label?.trim() ? `${s.label}: ${s.url}` : s.url));

  if (contactLines.length === 0) return null;

  return (
    <View style={cvStyles.section}>
      <Text style={cvStyles.sectionTitle}>Contact</Text>
      <Text style={cvStyles.contact}>{contactLines.join("\n")}</Text>
    </View>
  );
}
