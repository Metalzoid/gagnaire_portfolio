/**
 * Vérifie si un chemin correspond à une image uploadée ou une URL externe.
 * Utilisé par TechnologyForm, technologyIcon, etc.
 */
export function isImagePath(value: string): boolean {
  return (
    value.startsWith("/uploads/") ||
    value.startsWith("/images/") ||
    value.startsWith("http://") ||
    value.startsWith("https://")
  );
}

const IMAGE_EXT_REGEX = /\.(jpg|jpeg|png|webp|svg)$/i;

/**
 * Vérifie si un chemin ou URL pointe vers un fichier image (par extension).
 * Utilisé par FileUpload pour décider d'afficher la preview.
 */
export function isImageFile(pathOrUrl: string): boolean {
  return IMAGE_EXT_REGEX.test(pathOrUrl);
}
