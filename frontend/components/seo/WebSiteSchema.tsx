import { JsonLd } from "./JsonLd";
import { getProfile } from "@/services/data";
import { SITE_URL } from "@/lib/site-config";

export function WebSiteSchema() {
  const profile = getProfile();
  const fullName = `${profile.firstName} ${profile.lastName}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `Portfolio ${fullName}`,
    url: SITE_URL,
    description:
      "Portfolio de Florian Gagnaire, développeur web fullstack en alternance. Projets React, Node.js, TypeScript.",
    author: {
      "@type": "Person" as const,
      name: fullName,
    },
    inLanguage: "fr",
  };

  return <JsonLd data={schema} />;
}
