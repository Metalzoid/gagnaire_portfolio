import { View, Text } from "@react-pdf/renderer";
import { cvStyles } from "./styles";
import type { Project } from "shared";

interface CVProjectsProps {
  projects: Project[];
}

export function CVProjects({ projects }: CVProjectsProps) {
  const featured = projects?.filter((p) => p.featured) ?? [];
  const display = featured.length > 0 ? featured : projects?.slice(0, 3) ?? [];

  if (display.length === 0) return null;

  return (
    <View style={cvStyles.section}>
      <Text style={cvStyles.sectionTitle}>Projets</Text>
      {display.map((project, i) => (
        <View key={i} style={cvStyles.projectItem}>
          <Text style={cvStyles.projectTitle}>{project.title}</Text>
          {project.description?.trim() && (
            <Text style={cvStyles.projectDescription}>{project.description}</Text>
          )}
          {project.technologies && project.technologies.length > 0 && (
            <View style={cvStyles.projectTech}>
              {project.technologies.map((tech) => (
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
