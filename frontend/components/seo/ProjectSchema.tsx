import { JsonLd } from "./JsonLd";
import type { Project, Profile } from "shared";
import { SITE_URL } from "@/lib/site-config";

interface ProjectSchemaProps {
  project: Project;
  profile: Profile;
}

export function ProjectSchema({ project, profile }: ProjectSchemaProps) {
  const fullName = `${profile.firstName} ${profile.lastName}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.title,
    description: project.description,
    author: {
      "@type": "Person" as const,
      name: fullName,
    },
    programmingLanguage: project.technologies,
    url: `${SITE_URL}/projects/${project.slug}`,
    ...(project.github && { codeRepository: project.github }),
  };

  return <JsonLd data={schema} />;
}
