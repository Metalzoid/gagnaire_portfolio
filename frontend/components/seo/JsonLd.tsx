/**
 * Composant wrapper pour injecter des données structurées JSON-LD.
 */
interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export function JsonLd({ data }: JsonLdProps) {
  const json =
    Array.isArray(data) || typeof data === "object"
      ? JSON.stringify(Array.isArray(data) ? data : data)
      : "";

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
