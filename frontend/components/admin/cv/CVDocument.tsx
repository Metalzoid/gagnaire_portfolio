import { Document, Page, View } from "@react-pdf/renderer";
import { cvStyles } from "./styles";
import { CVHeader } from "./CVHeader";
import { CVContact } from "./CVContact";
import { CVAbout } from "./CVAbout";
import { CVExperience } from "./CVExperience";
import { CVSkills } from "./CVSkills";
import { CVProjects } from "./CVProjects";
import type { CVData } from "./types";

interface CVDocumentProps {
  data: CVData;
  photoUrl: string;
}

export function CVDocument({ data, photoUrl }: CVDocumentProps) {
  const experience = data.experience
    .filter((e) => e.visible)
    .map((e) => e.data);
  const projects = data.projects.filter((p) => p.visible).map((p) => p.data);

  return (
    <Document>
      <Page size="A4" style={cvStyles.page}>
        <CVHeader profile={data.profile} photoUrl={photoUrl} compact />
        <View style={cvStyles.mainRow}>
          <View style={cvStyles.sidebar}>
            <CVContact profile={data.profile} />
            <CVSkills skills={data.skills} />
          </View>
          <View style={cvStyles.mainCol}>
            <CVAbout bio={data.profile.bio} />
            <CVExperience experience={experience} />
            <CVProjects projects={projects} />
          </View>
        </View>
      </Page>
    </Document>
  );
}
