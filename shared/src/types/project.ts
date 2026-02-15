// --------------------------------------------------------------------------
// Project
// --------------------------------------------------------------------------
export interface ProjectImages {
  main: string;
  thumbnails: string[];
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  category: string;
  images: ProjectImages;
  github?: string | null;
  demo?: string | null;
  featured: boolean;
  date: string;
}
