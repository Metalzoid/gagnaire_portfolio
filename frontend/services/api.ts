// ==========================================================================
// Client API - Appels fetch vers le backend
// Remplace frontend/services/data.ts
// ==========================================================================
import type {
  Project,
  SkillCategory,
  Experience,
  Profile,
  Testimonial,
  Technology,
} from "shared";
import { API_BASE_SERVER, API_BASE_CLIENT, API_PREFIX } from "./api-config";

const API_BASE = API_BASE_SERVER;
const API_PATH_PREFIX = API_PREFIX;
const BROWSER_API_BASE = API_BASE_CLIENT;

/**
 * URL d'une image : /uploads/* → backend (rewrite directe), /images/* → assets statiques frontend.
 * Ne pas préfixer /api pour /uploads car le backend sert à /uploads, pas /api/uploads.
 */
export function getBackendImageUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  if (path.startsWith("/images/")) return path; // Assets statiques frontend
  if (path.startsWith("/uploads/")) return path; // Proxy /uploads → backend
  return `${BROWSER_API_BASE}${path}`;
}

/**
 * URL pour télécharger un fichier uploadé (CV, etc.).
 * Quand NEXT_PUBLIC_API_URL est défini (dev), le backend est sur un autre port → URL absolue.
 * Quand vide (prod), same-origin → chemin relatif (rewrite Next.js).
 */
export function getUploadUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  if (!path.startsWith("/uploads/")) return path;
  return BROWSER_API_BASE ? `${BROWSER_API_BASE}${path}` : path;
}

/** Timeout en ms pour les appels API (évite les blocages au build Coolify/Docker) */
const API_TIMEOUT_MS = 5000;

export class ApiError extends Error {
  constructor(
    public status: number,
    public endpoint: string,
  ) {
    super(`API error ${status} for ${endpoint}`);
    this.name = "ApiError";
  }
}

async function fetchAPI<T>(
  endpoint: string,
  options?: { revalidate?: number; cache?: RequestCache },
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const res = await fetch(`${API_BASE}${API_PATH_PREFIX}${endpoint}`, {
      signal: controller.signal,
      next: { revalidate: options?.revalidate ?? 60 },
      cache: options?.cache,
    });
    clearTimeout(timeoutId);
    if (!res.ok) throw new ApiError(res.status, endpoint);
    const json = (await res.json()) as { success: boolean; data: T };
    return json.data;
  } catch (e) {
    clearTimeout(timeoutId);
    throw e;
  }
}

/** Fallback si l'API est injoignable (build, panne, etc.) */
export async function fetchWithFallback<T>(
  endpoint: string,
  fallback: T,
  options?: { revalidate?: number },
): Promise<T> {
  // Au build Docker (Coolify, CI) : pas d'API disponible, retour immédiat du fallback
  if (process.env.SKIP_API_DURING_BUILD === "true") {
    return fallback;
  }

  try {
    return await fetchAPI<T>(endpoint, options);
  } catch {
    console.warn(`API unavailable for ${endpoint}, using fallback`);
    return fallback;
  }
}

// Fallbacks minimaux pour build sans API (CI, etc.)
const FALLBACK_PROFILE: Profile = {
  firstName: "",
  lastName: "",
  role: "",
  status: "",
  bio: "",
  pitch: { who: "", what: "", why: "", method: "" },
  photo: "/images/profile/photo.svg",
  cv: "#",
  social: [],
};

// --------------------------------------------------------------------------
// Projects
// --------------------------------------------------------------------------
export async function getProjects(): Promise<Project[]> {
  return fetchWithFallback<Project[]>("/projects", []);
}

export async function getTopProjects(): Promise<Project[]> {
  return fetchWithFallback<Project[]>("/projects/featured", []);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    return await fetchAPI<Project>(`/projects/${slug}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

// --------------------------------------------------------------------------
// Skills
// --------------------------------------------------------------------------
export async function getSkills(): Promise<SkillCategory[]> {
  return fetchWithFallback<SkillCategory[]>("/skills", []);
}

// --------------------------------------------------------------------------
// Experience
// --------------------------------------------------------------------------
export async function getExperience(): Promise<Experience[]> {
  const data = await fetchWithFallback<Experience[]>("/experience", []);
  return [...data].sort((a, b) => b.startDate.localeCompare(a.startDate));
}

// --------------------------------------------------------------------------
// Profile
// --------------------------------------------------------------------------
export async function getProfile(): Promise<Profile> {
  return fetchWithFallback<Profile>("/profile", FALLBACK_PROFILE);
}

// --------------------------------------------------------------------------
// Technologies (public - pour autocomplete, filtres, etc.)
// --------------------------------------------------------------------------
export async function getTechnologies(): Promise<Technology[]> {
  try {
    return await fetchAPI<Technology[]>("/technologies");
  } catch {
    return [];
  }
}

export async function searchTechnologies(query: string): Promise<Technology[]> {
  const q = encodeURIComponent(query.trim());
  if (!q) return getTechnologies();
  try {
    return await fetchAPI<Technology[]>(`/technologies/search?q=${q}`);
  } catch {
    return [];
  }
}

// --------------------------------------------------------------------------
// Testimonials
// --------------------------------------------------------------------------
export async function getTestimonials(): Promise<Testimonial[]> {
  return fetchWithFallback<Testimonial[]>("/testimonials", []);
}
