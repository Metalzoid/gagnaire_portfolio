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
} from "shared";

// En Docker : API_URL_INTERNAL (backend:3001). En local : NEXT_PUBLIC_API_URL ou localhost.
const API_BASE =
  process.env.DOCKER_ENV === "true" && process.env.API_URL_INTERNAL
    ? process.env.API_URL_INTERNAL
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export class ApiError extends Error {
  constructor(
    public status: number,
    public endpoint: string
  ) {
    super(`API error ${status} for ${endpoint}`);
    this.name = "ApiError";
  }
}

async function fetchAPI<T>(
  endpoint: string,
  options?: { revalidate?: number; cache?: RequestCache }
): Promise<T> {
  const res = await fetch(`${API_BASE}/api/v1${endpoint}`, {
    next: { revalidate: options?.revalidate ?? 60 },
    cache: options?.cache,
  });
  if (!res.ok) throw new ApiError(res.status, endpoint);
  const json = (await res.json()) as { success: boolean; data: T };
  return json.data;
}

/** Fallback si l'API est injoignable (build, panne, etc.) */
export async function fetchWithFallback<T>(
  endpoint: string,
  fallback: T,
  options?: { revalidate?: number }
): Promise<T> {
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
  social: { github: "", linkedin: "", email: "" },
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
// Testimonials
// --------------------------------------------------------------------------
export async function getTestimonials(): Promise<Testimonial[]> {
  return fetchWithFallback<Testimonial[]>("/testimonials", []);
}
