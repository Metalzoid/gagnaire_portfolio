import { View, Text } from "@react-pdf/renderer";
import { cvStyles } from "./styles";
import type { Experience } from "shared";

interface CVExperienceProps {
  experience: Experience[];
}

function formatDate(date: string | null): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("fr-FR", {
    month: "short",
    year: "numeric",
  });
}

export function CVExperience({ experience }: CVExperienceProps) {
  const sorted = [...experience].sort((a, b) =>
    b.startDate.localeCompare(a.startDate),
  );

  if (sorted.length === 0) return null;

  return (
    <View style={cvStyles.section}>
      <Text style={cvStyles.sectionTitle}>Expérience</Text>
      {sorted.map((exp, i) => (
        <View key={i} style={cvStyles.experienceItem}>
          <View style={cvStyles.experienceHeader}>
            <Text style={cvStyles.experienceTitle}>{exp.title}</Text>
            <Text style={cvStyles.experienceDate}>
              {formatDate(exp.startDate)}
              {exp.current ? " - Présent" : exp.endDate ? ` - ${formatDate(exp.endDate)}` : ""}
            </Text>
          </View>
          {(exp.company || exp.location) && (
            <Text style={cvStyles.experienceCompany}>
              {[exp.company, exp.location].filter(Boolean).join(" • ")}
            </Text>
          )}
          {exp.description?.trim() && (
            <Text style={cvStyles.experienceDescription}>
              {exp.description}
            </Text>
          )}
          {exp.technologies && exp.technologies.length > 0 && (
            <View style={cvStyles.experienceTech}>
              {exp.technologies.map((tech) => (
                <Text key={tech.id} style={cvStyles.techTag}>
                  {tech.name}
                </Text>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );
}
