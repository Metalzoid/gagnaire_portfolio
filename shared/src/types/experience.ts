// --------------------------------------------------------------------------
// Experience
// --------------------------------------------------------------------------
export interface Experience {
  type: "work" | "education";
  title: string;
  company?: string;
  location?: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  technologies?: string[];
}
