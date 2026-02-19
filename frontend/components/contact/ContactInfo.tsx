import { SocialLinks } from "@/components/shared/social-links";
import { FaGithub, FaLinkedin, FaLink, MdEmail, MdPhone } from "@/components/ui/icons";
import type { Profile } from "shared";
import styles from "./ContactInfo.module.scss";

function iconForLabel(label: string): React.ReactNode {
  const l = label.toLowerCase();
  if (l.includes("github")) return <FaGithub />;
  if (l.includes("linkedin")) return <FaLinkedin />;
  if (l.includes("email") || l.includes("mail")) return <MdEmail />;
  if (l.includes("tél") || l.includes("telephone") || l.includes("phone"))
    return <MdPhone />;
  return <FaLink />;
}

function toHref(value: string): string {
  const v = value.trim();
  if (!v) return v;
  if (v.startsWith("mailto:") || v.startsWith("tel:") || v.startsWith("http"))
    return v;
  if (/^[^@]+@[^@]+$/.test(v)) return `mailto:${v}`;
  if (/^[\d\s.+()-]{10,}$/.test(v.replace(/\s/g, ""))) return `tel:${v}`;
  return v;
}

export function ContactInfo({ profile }: { profile: Profile }) {
  const social = profile.social ?? [];
  const links = social
    .filter((s) => s.url?.trim())
    .map((s) => {
      const url = toHref(s.url);
      const icon = url.startsWith("tel:") ? <MdPhone /> : iconForLabel(s.label);
      return { url, icon, label: s.label || "Lien" };
    });

  const emailLink = social.find(
    (s) =>
      s.label?.toLowerCase().includes("email") ||
      s.url?.startsWith("mailto:") ||
      /^[^@]+@[^@]+$/.test(s.url || ""),
  );
  const emailHref = emailLink?.url?.startsWith("mailto:")
    ? emailLink.url
    : emailLink?.url
      ? `mailto:${emailLink.url}`
      : null;

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Me contacter</h3>
      <p className={styles.intro}>
        Envie de discuter d&apos;un projet ou d&apos;une opportunité ?
      </p>
      {emailHref && (
        <a href={emailHref} className={styles.email}>
          {emailLink?.url?.replace(/^mailto:/i, "") ?? emailLink?.url}
        </a>
      )}
      <SocialLinks links={links} size="lg" direction="column" />
    </div>
  );
}
