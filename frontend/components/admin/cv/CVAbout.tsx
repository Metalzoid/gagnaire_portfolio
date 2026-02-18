import { View, Text } from "@react-pdf/renderer";
import { cvStyles } from "./styles";

interface CVAboutProps {
  bio: string;
}

export function CVAbout({ bio }: CVAboutProps) {
  if (!bio?.trim()) return null;

  return (
    <View style={cvStyles.section}>
      <Text style={cvStyles.sectionTitle}>À propos</Text>
      <Text style={cvStyles.aboutText}>{bio}</Text>
    </View>
  );
}
