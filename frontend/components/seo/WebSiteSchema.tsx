import { JsonLd } from "./JsonLd";
import type { Profile } from "shared";
import { SITE_URL } from "@/lib/site-config";

export function WebSiteSchema({ profile }: { profile: Profile }) {
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
