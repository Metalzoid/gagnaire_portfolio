import { API_BASE_CLIENT } from "@/services/api-config";

/**
 * URL pour afficher un fichier uploadé (preview d'image, téléchargement CV, etc.).
 * - /uploads/* et /images/* → chemin relatif (proxy Next.js ou assets statiques)
 * - http(s):// ou data: → URL absolue inchangée
 * - Autre chemin → préfixé avec l'URL API client
 */
export function getUploadUrl(filePath: string): string {
  if (!filePath) return "";
  if (filePath.startsWith("http") || filePath.startsWith("data:"))
    return filePath;
  if (filePath.startsWith("/images/")) return filePath;
  if (filePath.startsWith("/uploads/")) return filePath;
  return `${API_BASE_CLIENT}${filePath}`;
}
