// ==========================================================================
// API Admin - Appels authentifiés avec Bearer + refresh automatique sur 401
// ==========================================================================
import type {
  Project,
  ProjectImage,
  SkillCategory,
  Experience,
  Profile,
  Testimonial,
  Technology,
  ContactRequest,
  CreateProjectSchemaType,
  UpdateProjectSchemaType,
  CreateSkillSchemaType,
  CreateSkillCategorySchemaType,
  UpdateSkillSchemaType,
  UpdateSkillCategorySchemaType,
  CreateExperienceSchemaType,
  UpdateExperienceSchemaType,
  CreateTechnologySchemaType,
  UpdateTechnologySchemaType,
  CreateTestimonialSchemaType,
  UpdateTestimonialSchemaType,
  UpdateProfileSchemaType,
} from "shared";
import { API_BASE_CLIENT, API_PREFIX } from "./api-config";

const API_BASE = API_BASE_CLIENT;
const API_PATH_PREFIX = API_PREFIX;

export class AdminApiError extends Error {
  constructor(
    public status: number,
    public endpoint: string,
    message?: string,
  ) {
    super(message || `Admin API error ${status} for ${endpoint}`);
    this.name = "AdminApiError";
  }
}

export type TokenProvider = () => string | null;

let tokenProvider: TokenProvider = () => null;
let onTokensRefreshed:
  | ((accessToken: string, expiresIn: string) => void)
  | null = null;
let onLogout: (() => void) | null = null;

export function configureAdminApi(config: {
  getToken: TokenProvider;
  onTokensRefreshed: (accessToken: string, expiresIn: string) => void;
  onLogout: () => void;
}) {
  tokenProvider = config.getToken;
  onTokensRefreshed = config.onTokensRefreshed;
  onLogout = config.onLogout;
}

async function refreshTokens(): Promise<{ accessToken: string } | null> {
  const res = await fetch(`${API_BASE}${API_PATH_PREFIX}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) return null;
  const json = (await res.json()) as {
    success: boolean;
    data: { accessToken: string; expiresIn: string };
  };
  if (!json.success || !json.data) return null;

  onTokensRefreshed?.(json.data.accessToken, json.data.expiresIn);
  return { accessToken: json.data.accessToken };
}

async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit & { _retry?: boolean } = {},
  overrideToken?: string,
): Promise<T> {
  const token = overrideToken ?? tokenProvider();
  if (!token && !options._retry) {
    throw new AdminApiError(401, endpoint, "Non authentifié");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${API_PATH_PREFIX}${endpoint}`, {
    ...options,
    cache: "no-store",
    credentials: "include",
    headers,
  });

  if (res.status === 401 && !options._retry) {
    const newTokens = await refreshTokens();
    if (newTokens) {
      return fetchWithAuth<T>(
        endpoint,
        { ...options, _retry: true },
        newTokens.accessToken,
      );
    }
    onLogout?.();
    throw new AdminApiError(401, endpoint, "Session expirée");
  }

  if (!res.ok) {
    const errBody = (await res.json().catch(() => ({}))) as {
      error?: { message?: string };
    };
    throw new AdminApiError(res.status, endpoint, errBody.error?.message);
  }

  const json = (await res.json()) as { success: boolean; data: T };
  return json.data;
}

async function uploadWithAuth<T = { path: string }>(
  endpoint: string,
  formData: FormData,
): Promise<T> {
  const token = tokenProvider();
  if (!token) throw new AdminApiError(401, endpoint, "Non authentifié");

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  const res = await fetch(`${API_BASE}${API_PATH_PREFIX}${endpoint}`, {
    method: "POST",
    cache: "no-store",
    credentials: "include",
    headers,
    body: formData,
  });

  if (res.status === 401) {
    const newTokens = await refreshTokens();
    if (newTokens) {
      headers.Authorization = `Bearer ${newTokens.accessToken}`;
      const retry = await fetch(`${API_BASE}${API_PATH_PREFIX}${endpoint}`, {
        method: "POST",
        cache: "no-store",
        credentials: "include",
        headers,
        body: formData,
      });
      if (!retry.ok) {
        const errBody = (await retry.json().catch(() => ({}))) as {
          error?: { message?: string };
        };
        throw new AdminApiError(retry.status, endpoint, errBody.error?.message);
      }
      const json = (await retry.json()) as { success: boolean; data: T };
      return json.data;
    }
    onLogout?.();
    throw new AdminApiError(401, endpoint, "Session expirée");
  }

  if (!res.ok) {
    const errBody = (await res.json().catch(() => ({}))) as {
      error?: { message?: string };
    };
    throw new AdminApiError(res.status, endpoint, errBody.error?.message);
  }

  const json = (await res.json()) as { success: boolean; data: T };
  return json.data;
}

async function postAdmin<T>(endpoint: string, data: unknown): Promise<T> {
  return fetchWithAuth<T>(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

async function putAdmin<T>(endpoint: string, data: unknown): Promise<T> {
  return fetchWithAuth<T>(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

async function patchAdmin<T>(endpoint: string, data: unknown): Promise<T> {
  return fetchWithAuth<T>(endpoint, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

async function deleteAdmin(endpoint: string): Promise<void> {
  await fetchWithAuth(endpoint, { method: "DELETE" });
}

// --------------------------------------------------------------------------
// Admin API
// --------------------------------------------------------------------------
/**
 * Construit l'URL d'un fichier pour affichage : /uploads/* → backend (proxy direct), /images/* → assets frontend.
 * Ne pas préfixer /api pour /uploads car le backend sert à /uploads, pas /api/uploads.
 */
export function getUploadUrl(filePath: string): string {
  if (!filePath) return "";
  if (filePath.startsWith("http") || filePath.startsWith("data:"))
    return filePath;
  if (filePath.startsWith("/images/")) return filePath;
  if (filePath.startsWith("/uploads/")) return filePath;
  return `${API_BASE}${filePath}`;
}

export const adminApi = {
  upload: async (file: File, category: string): Promise<{ path: string }> => {
    const formData = new FormData();
    formData.append("category", category);
    formData.append("file", file);
    return uploadWithAuth<{ path: string }>("/admin/upload", formData);
  },
  auth: {
    login: async (email: string, password: string) => {
      const res = await fetch(`${API_BASE}${API_PATH_PREFIX}/auth/login`, {
        method: "POST",
        cache: "no-store",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as {
          error?: { message?: string };
        };
        throw new AdminApiError(res.status, "/auth/login", err.error?.message);
      }
      const json = (await res.json()) as {
        success: boolean;
        data: { accessToken: string; expiresIn: string };
      };
      return json.data;
    },
    logout: async () => {
      await fetch(`${API_BASE}${API_PATH_PREFIX}/auth/logout`, {
        method: "POST",
        cache: "no-store",
        credentials: "include",
      }).catch(() => {});
    },
    me: () => fetchWithAuth<{ id: string; email: string }>("/auth/me"),
  },
  projects: {
    list: () => fetchWithAuth<Project[]>("/projects"),
    getBySlug: (slug: string) => fetchWithAuth<Project>(`/projects/${slug}`),
    create: (data: CreateProjectSchemaType) =>
      postAdmin<Project>("/admin/projects", data),
    update: (id: string, data: UpdateProjectSchemaType) =>
      putAdmin<Project>(`/admin/projects/${id}`, data),
    delete: (id: string) => deleteAdmin(`/admin/projects/${id}`),
    updateOrder: (id: string, order: number) =>
      patchAdmin<Project>(`/admin/projects/${id}/order`, { order }),
    uploadImage: async (
      projectId: string,
      file: File,
    ): Promise<ProjectImage> => {
      const formData = new FormData();
      formData.append("file", file);
      return uploadWithAuth<ProjectImage>(
        `/admin/projects/${projectId}/images`,
        formData,
      );
    },
    deleteImage: (projectId: string, imageId: string) =>
      deleteAdmin(`/admin/projects/${projectId}/images/${imageId}`),
    reorderImages: (projectId: string, orderedIds: string[]) =>
      patchAdmin<ProjectImage[]>(`/admin/projects/${projectId}/images/order`, {
        orderedIds,
      }),
  },
  skills: {
    list: () => fetchWithAuth<SkillCategory[]>("/skills"),
    createCategory: (data: CreateSkillCategorySchemaType) =>
      postAdmin<SkillCategory>("/admin/skills/categories", data),
    updateCategory: (id: string, data: UpdateSkillCategorySchemaType) =>
      putAdmin<SkillCategory>(`/admin/skills/categories/${id}`, data),
    deleteCategory: (id: string) =>
      deleteAdmin(`/admin/skills/categories/${id}`),
    create: (data: CreateSkillSchemaType) => postAdmin(`/admin/skills`, data),
    update: (id: string, data: UpdateSkillSchemaType) =>
      putAdmin(`/admin/skills/${id}`, data),
    delete: (id: string) => deleteAdmin(`/admin/skills/${id}`),
  },
  experience: {
    list: () => fetchWithAuth<Experience[]>("/experience"),
    create: (data: CreateExperienceSchemaType) =>
      postAdmin<Experience>("/admin/experience", data),
    update: (id: string, data: UpdateExperienceSchemaType) =>
      putAdmin<Experience>(`/admin/experience/${id}`, data),
    delete: (id: string) => deleteAdmin(`/admin/experience/${id}`),
  },
  testimonials: {
    list: () => fetchWithAuth<Testimonial[]>("/testimonials"),
    create: (data: CreateTestimonialSchemaType) =>
      postAdmin<Testimonial>("/admin/testimonials", data),
    update: (id: string, data: UpdateTestimonialSchemaType) =>
      putAdmin<Testimonial>(`/admin/testimonials/${id}`, data),
    delete: (id: string) => deleteAdmin(`/admin/testimonials/${id}`),
  },
  technologies: {
    list: () => fetchWithAuth<Technology[]>("/technologies"),
    search: (query: string) => {
      const q = encodeURIComponent(query.trim());
      return fetchWithAuth<Technology[]>(
        q ? `/technologies/search?q=${q}` : "/technologies",
      );
    },
    create: (data: CreateTechnologySchemaType) =>
      postAdmin<Technology>("/admin/technologies", data),
    update: (id: string, data: UpdateTechnologySchemaType) =>
      putAdmin<Technology>(`/admin/technologies/${id}`, data),
    delete: (id: string) => deleteAdmin(`/admin/technologies/${id}`),
  },
  contacts: {
    list: () => fetchWithAuth<ContactRequest[]>("/admin/contacts"),
    updateStatus: (id: string, status: ContactRequest["status"]) =>
      patchAdmin<ContactRequest>(`/admin/contacts/${id}`, { status }),
  },
  profile: {
    get: async () => {
      try {
        return await fetchWithAuth<Profile>("/profile");
      } catch (e) {
        if (e instanceof AdminApiError && e.status === 404) return null;
        throw e;
      }
    },
    update: (data: UpdateProfileSchemaType) =>
      putAdmin<Profile>("/admin/profile", data),
  },
  cv: {
    /** Récupère toutes les données nécessaires pour générer le CV */
    getData: async () => {
      const [profile, experience, skills, projects] = await Promise.all([
        adminApi.profile.get(),
        fetchWithAuth<Experience[]>("/experience"),
        fetchWithAuth<SkillCategory[]>("/skills"),
        fetchWithAuth<Project[]>("/projects/featured").catch(() =>
          fetchWithAuth<Project[]>("/projects"),
        ),
      ]);

      const defaultProfile: Profile = {
        firstName: "",
        lastName: "",
        role: "",
        status: "",
        bio: "",
        pitch: { who: "", what: "", why: "", method: "" },
        photo: "",
        social: [],
        cv: "",
      };

      return {
        profile: profile ?? defaultProfile,
        experience: experience ?? [],
        skills: skills ?? [],
        projects: projects ?? [],
      };
    },
  },
};
