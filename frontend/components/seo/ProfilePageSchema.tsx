import { JsonLd } from "./JsonLd";
import type { Profile } from "shared";
import { SITE_URL } from "@/lib/site-config";

export function ProfilePageSchema({ profile }: { profile: Profile }) {
  const fullName = `${profile.firstName} ${profile.lastName}`;
  const imageUrl = profile.photo.startsWith("/")
    ? `${SITE_URL}${profile.photo}`
    : profile.photo;

  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person" as const,
      name: fullName,
      description: profile.bio,
      image: imageUrl,
    },
  };

  return <JsonLd data={schema} />;
}
