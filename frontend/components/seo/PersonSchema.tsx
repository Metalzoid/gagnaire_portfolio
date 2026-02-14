import { JsonLd } from "./JsonLd";
import { getProfile } from "@/services/data";
import { SITE_URL } from "@/lib/site-config";

export function PersonSchema() {
  const profile = getProfile();
  const fullName = `${profile.firstName} ${profile.lastName}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: fullName,
    jobTitle: profile.role,
    url: SITE_URL,
    sameAs: [profile.social.github, profile.social.linkedin].filter(Boolean),
    knowsAbout: ["React", "Node.js", "TypeScript", "Next.js"],
    alumniOf: {
      "@type": "EducationalOrganization" as const,
      name: "OpenClassrooms",
    },
  };

  return <JsonLd data={schema} />;
}
