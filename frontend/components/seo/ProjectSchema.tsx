import { JsonLd } from "./JsonLd";
import { getProfile } from "@/services/data";
import type { Project } from "@/types";
import { SITE_URL } from "@/lib/site-config";

interface ProjectSchemaProps {
  project: Project;
}

export function ProjectSchema({ project }: ProjectSchemaProps) {
  const profile = getProfile();
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
