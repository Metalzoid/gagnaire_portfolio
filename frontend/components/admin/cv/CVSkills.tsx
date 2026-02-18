import { View, Text } from "@react-pdf/renderer";
import { cvStyles } from "./styles";
import type { SkillCategory } from "shared";

interface CVSkillsProps {
  skills: SkillCategory[];
}

export function CVSkills({ skills }: CVSkillsProps) {
  if (!skills?.length) return null;

  return (
    <View style={cvStyles.section}>
      <Text style={cvStyles.sectionTitle}>Compétences</Text>
      {skills.map((category, i) => (
        <View key={i} style={cvStyles.skillCategory}>
          <Text style={cvStyles.skillCategoryName}>{category.name}</Text>
          {category.skills?.map((skill, j) => {
            const level = Math.min(100, Math.max(0, skill.level ?? 0));
            return (
              <View key={j} style={cvStyles.skillRow}>
                <Text style={cvStyles.skillName}>{skill.name}</Text>
                <View style={cvStyles.skillLevel}>
                  <View
                    style={[
                      cvStyles.skillLevelFill,
                      { width: (level / 100) * 60 },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}
